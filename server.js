// 이달의 농식품 프록시 서버
// - API 키는 .env 에만 두고, 브라우저에는 절대 내려보내지 않는다.
// - 브라우저(index.html)는 /api/foods, /api/food 만 호출하고, 이 서버가 키를 붙여 공공데이터포털에 대신 요청한다.
// 실행: node server.js  (Node 18+ 필요, 외부 패키지 없음)

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

// ── .env 로드 (dotenv 없이 간단 파싱) ──────────────────────────────
function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (!(m[1] in process.env)) process.env[m[1]] = value;
  }
}
loadEnv(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT || 3000);
const SERVICE_KEY = process.env.DATA_GO_KR_KEY || "";
// 서비스 루트(End Point). 오퍼레이션명(/foodList 등)은 코드에서 붙인다.
const API_BASE = (process.env.FOOD_API_BASE || "https://apis.data.go.kr/1390803/allbaroFoodMonth").replace(/\/$/, "");
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || ""; // 다른 도메인에서 호출 허용 시 지정

// ── 캐시: 메모리 + 파일(.cache/). 목록은 하루, 상세는 7일 ─────────────
const CACHE_FILE = path.join(__dirname, ".cache", "cache.json");
const TTL = { list: 24 * 60 * 60 * 1000, detail: 7 * 24 * 60 * 60 * 1000 };
let cache = {};
try { cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")); } catch {}
function cacheGet(key, ttl) {
  const hit = cache[key];
  return hit && Date.now() - hit.at < ttl ? hit.body : null;
}
function cacheSet(key, body) {
  cache[key] = { at: Date.now(), body };
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
  } catch {}
}

// ── API 호출: 한 줄로 세워 간격을 두고, 초당 제한(코드 23)이면 기다렸다 재시도 ──
const GAP_MS = 1500;
const RETRY_WAITS = [4000, 12000, 30000];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tail = Promise.resolve();
let lastCallAt = 0;

function callApi(operation, params) {
  const job = tail.then(() => run(operation, params));
  tail = job.catch(() => {}); // 앞 요청이 실패해도 다음 요청은 진행
  return job;
}

async function run(operation, params) {
  for (let attempt = 0; ; attempt++) {
    const wait = lastCallAt + GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastCallAt = Date.now();

    // serviceKey 는 포털에서 받은 "Encoding" 키를 그대로 붙인다 (이중 인코딩 방지)
    const qs = new URLSearchParams({ format: "json", ...params });
    const res = await fetch(`${API_BASE}/${operation}?serviceKey=${SERVICE_KEY}&${qs}`, {
      signal: AbortSignal.timeout(15_000),
    });
    const text = await res.text();

    if (/<returnReasonCode>23<\/returnReasonCode>/.test(text) && attempt < RETRY_WAITS.length) {
      await sleep(RETRY_WAITS[attempt]);
      continue;
    }
    return parseResponse(text);
  }
}

// 응답 형태가 두 가지다: 게이트웨이 오류(XML) / 정상({response:{header,body}}) / 파라미터 오류({header,body:null})
function parseResponse(text) {
  if (text.trim().startsWith("<")) {
    const msg = text.match(/<returnAuthMsg>(.*?)<\/returnAuthMsg>/)?.[1] || "알 수 없는 게이트웨이 오류";
    const code = text.match(/<returnReasonCode>(.*?)<\/returnReasonCode>/)?.[1];
    throw new Error(`${msg} (code ${code})`);
  }
  const json = JSON.parse(text);
  const root = json.response || json;
  const code = String(root.header?.resultCode ?? "");
  if (code !== "200") throw new Error(`${root.header?.resultMsg || "응답 오류"} (code ${code})`);
  return root.body;
}

const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

// ── 데이터 가공 ───────────────────────────────────────────────────
async function getFoodList(month) {
  const key = `list:${month}`;
  const hit = cacheGet(key, TTL.list);
  if (hit) return hit;
  const body = await callApi("foodList", { srchMonth: String(month), pageNo: "1", numOfRows: "50" });
  const items = asArray(body?.items?.item).map((i) => ({ sn: i.fdmtSn, name: i.fdmtNm, image: i.fdmtImgUrl || "" }));
  const result = { month, items };
  cacheSet(key, result);
  return result;
}

async function getFoodDetail(sn) {
  const key = `detail:${sn}`;
  const hit = cacheGet(key, TTL.detail);
  if (hit) return hit;
  const body = await callApi("foodCont", { srchFdmtSn: String(sn) });
  const s = body?.stdInfo || {};
  const n = body?.ntkInfo || {};
  const result = {
    sn: s.fdmtSn,
    name: s.fdmtNm,
    origin: s.ctvtIndcDtl || "",        // 유래·재배
    pick: s.prchCheatDtl || "",         // 품종·고르는 법
    storage: s.cstdyMthDtl || "",       // 보관법·손질법
    tip: s.etcInfoDtl || "",            // 기타 팁
    eat: n.ntkMthDtl || "",             // 먹는 법
    nutrition: n.ntrIrdntEfcyDtl || "", // 영양·효능
    research: n.rltRsrchInfoDtl || "",  // 관련 연구
    stats: n.cnsmpqyDtl || "",          // 생산·소비 현황
    recipes: asArray(body?.connRecipeList?.recipeInfo).map((r) => ({
      sn: r.recipeSn, name: r.recipeNm, image: r.recipeImgUrl || "",
    })),
  };
  cacheSet(key, result);
  return result;
}

async function getRecipeDetail(sn) {
  const key = `recipe:${sn}`;
  const hit = cacheGet(key, TTL.detail);
  if (hit) return hit;
  const body = await callApi("recipeCont", { srchRecipeSn: String(sn) });
  const s = body?.stdInfo || {};
  const nu = body?.nutriInfo || {};
  const result = {
    sn: s.recipeSn,
    name: s.recipeNm,
    ingredients: s.matrlInfo || "",  // "▶ 구분 : 재료(양), ..." 형태
    steps: s.ckngMthInfo || "",      // "1. ... 2. ..." 형태
    note: s.grpMlsvApplc || "",      // 조리 시 주의사항
    nutrition: { kcal: nu.clri, carb: nu.crbh, fat: nu.lipd, protein: nu.prot, sodium: nu.na },
    images: asArray(body?.ckngImgList?.ckngImg).map((i) => i.ckngImgUrl).filter(Boolean),
  };
  cacheSet(key, result);
  return result;
}

// ── HTTP 서버 ──────────────────────────────────────────────────────
const STATIC = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/sample-data.js": ["sample-data.js", "text/javascript; charset=utf-8"],
};

function sendJson(res, status, body) {
  const headers = { "Content-Type": "application/json; charset=utf-8" };
  if (ALLOWED_ORIGIN) headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN;
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

async function handleApi(res, fn) {
  if (!SERVICE_KEY) return sendJson(res, 500, { error: "서버에 DATA_GO_KR_KEY 가 설정되지 않았습니다." });
  try {
    sendJson(res, 200, await fn());
  } catch (e) {
    // 에러 메시지에 키가 섞이지 않도록 원문 URL은 절대 응답에 넣지 않는다
    sendJson(res, 502, { error: e.message });
  }
}

http
  .createServer((req, res) => {
    const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);

    if (pathname === "/api/foods") {
      const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
      if (!Number.isInteger(month) || month < 1 || month > 12) return sendJson(res, 400, { error: "month 는 1~12" });
      return handleApi(res, () => getFoodList(month));
    }
    if (pathname === "/api/food") {
      const sn = searchParams.get("sn") || "";
      if (!/^\d{1,6}$/.test(sn)) return sendJson(res, 400, { error: "sn 은 숫자여야 합니다" });
      return handleApi(res, () => getFoodDetail(sn));
    }

    if (pathname === "/api/recipe") {
      const sn = searchParams.get("sn") || "";
      if (!/^\d{1,6}$/.test(sn)) return sendJson(res, 400, { error: "sn 은 숫자여야 합니다" });
      return handleApi(res, () => getRecipeDetail(sn));
    }

    const file = STATIC[pathname];
    if (file) {
      res.writeHead(200, { "Content-Type": file[1] });
      return fs.createReadStream(path.join(__dirname, file[0])).pipe(res);
    }
    res.writeHead(404).end("Not Found");
  })
  .listen(PORT, () => {
    console.log(`http://localhost:${PORT} 에서 실행 중`);
    if (!SERVICE_KEY) console.warn("⚠ .env 에 DATA_GO_KR_KEY 가 없습니다. 샘플 데이터로만 표시됩니다.");
  });
