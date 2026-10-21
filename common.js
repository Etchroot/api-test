// index.html(목록)과 detail.html(상세)이 함께 쓰는 코드: DOM 헬퍼, 아이콘, 공공데이터포털 호출
// 서버 없이 브라우저가 포털을 직접 호출한다. 인증키는 로컬의 config.js 에만 있고 git 에는 올라가지 않는다.
// (이 방식은 키가 브라우저에 보이므로 config.js 를 공유하거나 이 페이지를 공개 배포하면 안 된다)

// API 응답은 외부 데이터이므로 innerHTML 대신 textContent 로 넣는다 (XSS 방지)
function el(tag, text, cls) {
  const n = document.createElement(tag);
  if (text != null) n.textContent = text;
  if (cls) n.className = cls;
  return n;
}

const SEASONS = { 12: ["winter", "겨울"], 1: ["winter", "겨울"], 2: ["winter", "겨울"], 3: ["spring", "봄"], 4: ["spring", "봄"], 5: ["spring", "봄"],
                  6: ["summer", "여름"], 7: ["summer", "여름"], 8: ["summer", "여름"], 9: ["fall", "가을"], 10: ["fall", "가을"], 11: ["fall", "가을"] };
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Lucide 스타일 SVG 아이콘 (이모지 대신 사용)
const ICONS = {
  leaf: ["M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z", "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"],
  utensils: ["M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2", "M7 2v20", "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"],
};
function icon(name) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  for (const d of ICONS[name]) { const p = document.createElementNS(ns, "path"); p.setAttribute("d", d); svg.append(p); }
  return svg;
}

// 이미지 서버가 500 등으로 실패해도 깨진 아이콘 대신 아이콘 자리표시로 바꾼다 (복구되면 자동으로 이미지가 나온다)
// ratio: 자리표시 영역의 가로세로 비율, drop: true 면 실패 시 그냥 제거(조리 사진용)
function placeholder(iconName, ratio, alt) {
  const ph = el("div", null, "ph");
  ph.style.aspectRatio = ratio;
  ph.setAttribute("role", "img"); ph.setAttribute("aria-label", alt || "");
  ph.append(icon(iconName));
  return ph;
}
function safeImg(src, { alt = "", iconName = "leaf", ratio = "4/3", drop = false } = {}) {
  const img = el("img");
  img.alt = alt; img.loading = "lazy"; img.src = src;
  img.addEventListener("error", () => {
    if (drop) return img.remove();
    img.replaceWith(placeholder(iconName, ratio, alt));
  }, { once: true });
  return img;
}

// ── 공공데이터포털 직접 호출 ─────────────────
const CFG = window.APP_CONFIG || {};
const API_BASE = String(CFG.API_BASE || "https://apis.data.go.kr/1390803/allbaroFoodMonth").replace(/\/$/, "");
// Encoding 키(%XX 포함)는 그대로, Decoding 키(+ / = 포함)는 인코딩해서 붙인다
const KEY_PARAM = CFG.SERVICE_KEY && !/여기에/.test(CFG.SERVICE_KEY)
  ? (/%[0-9A-Fa-f]{2}/.test(CFG.SERVICE_KEY) ? CFG.SERVICE_KEY : encodeURIComponent(CFG.SERVICE_KEY))
  : "";

const GAP_MS = 1500, RETRY_WAITS = [4000, 12000, 30000];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tail = Promise.resolve(), lastCallAt = 0;

// 호출 제한(초당 요청 수)이 빡빡해서 한 줄로 세워 간격을 두고, 제한 오류(코드 23)면 기다렸다 재시도한다
function callApi(operation, params) {
  if (!KEY_PARAM) return Promise.reject(new Error("config.js 가 없거나 SERVICE_KEY 가 비어 있습니다 (config.example.js 참고)"));
  const job = tail.then(() => run(operation, params));
  tail = job.catch(() => {});
  return job;
}

async function run(operation, params) {
  for (let attempt = 0; ; attempt++) {
    const wait = lastCallAt + GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastCallAt = Date.now();
    const qs = new URLSearchParams({ format: "json", ...params });
    const res = await fetch(`${API_BASE}/${operation}?serviceKey=${KEY_PARAM}&${qs}`);
    const text = await res.text();
    if (/<returnReasonCode>23<\/returnReasonCode>/.test(text) && attempt < RETRY_WAITS.length) {
      await sleep(RETRY_WAITS[attempt]);
      continue;
    }
    return parseResponse(text);
  }
}

// 응답 형태: 게이트웨이 오류(XML) / 정상({response:{header,body}}) / 파라미터 오류({header,body:null})
function parseResponse(text) {
  if (text.trim().startsWith("<")) {
    const msg = text.match(/<returnAuthMsg>(.*?)<\/returnAuthMsg>/)?.[1] || "알 수 없는 게이트웨이 오류";
    const code = text.match(/<returnReasonCode>(.*?)<\/returnReasonCode>/)?.[1];
    throw new Error(`${msg} (code ${code})`);
  }
  const root = JSON.parse(text);
  const r = root.response || root;
  const code = String(r.header?.resultCode ?? "");
  if (code !== "200") throw new Error(`${r.header?.resultMsg || "응답 오류"} (code ${code})`);
  return r.body;
}

const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

// 호출 횟수를 아끼려고 localStorage 에 캐시한다 (목록 1일, 상세·레시피 7일). 막혀 있어도 동작은 한다.
const TTL = { list: 24 * 3600e3, detail: 7 * 24 * 3600e3 };
async function cached(key, ttl, fetcher) {
  try {
    const hit = JSON.parse(localStorage.getItem(`foodmonth:${key}`) || "null");
    if (hit && Date.now() - hit.at < ttl) return hit.body;
  } catch {}
  const body = await fetcher();
  try { localStorage.setItem(`foodmonth:${key}`, JSON.stringify({ at: Date.now(), body })); } catch {}
  return body;
}

// 식재료 사진 주소 (foods-data.js 의 FOOD_PHOTOS). 사진이 없으면 빈 문자열 → 잎 아이콘 자리표시가 나온다.
function foodPhoto(sn) { return (window.FOOD_PHOTOS || {})[sn] || null; }
function foodPhotoUrl(sn, w = 900) {
  const p = foodPhoto(sn);
  return p ? `https://images.unsplash.com/photo-${p.id}?fm=jpg&q=70&w=${w}&auto=format&fit=crop` : "";
}

// 월별 목록은 foods-data.js 에 고정해 두었다. 이 함수는 고정 목록이 없을 때만 API 로 받는다.
const fetchFoodList = (month) => cached(`list:${month}`, TTL.list, async () => {
  const body = await callApi("foodList", { srchMonth: String(month), pageNo: "1", numOfRows: "50" });
  return { month, items: asArray(body?.items?.item).map((i) => ({ sn: i.fdmtSn, name: i.fdmtNm, image: i.fdmtImgUrl || "" })) };
});

const fetchFoodDetail = (sn) => cached(`food:${sn}`, TTL.detail, async () => {
  const body = await callApi("foodCont", { srchFdmtSn: String(sn) });
  const s = body?.stdInfo || {}, n = body?.ntkInfo || {};
  return {
    sn: s.fdmtSn, name: s.fdmtNm,
    origin: s.ctvtIndcDtl || "", pick: s.prchCheatDtl || "", storage: s.cstdyMthDtl || "", tip: s.etcInfoDtl || "",
    eat: n.ntkMthDtl || "", nutrition: n.ntrIrdntEfcyDtl || "", research: n.rltRsrchInfoDtl || "", stats: n.cnsmpqyDtl || "",
    recipes: asArray(body?.connRecipeList?.recipeInfo).map((r) => ({ sn: r.recipeSn, name: r.recipeNm, image: r.recipeImgUrl || "" })),
  };
});

const fetchRecipe = (sn) => cached(`recipe:${sn}`, TTL.detail, async () => {
  const body = await callApi("recipeCont", { srchRecipeSn: String(sn) });
  const s = body?.stdInfo || {}, nu = body?.nutriInfo || {};
  return {
    sn: s.recipeSn, name: s.recipeNm, ingredients: s.matrlInfo || "", steps: s.ckngMthInfo || "", note: s.grpMlsvApplc || "",
    nutrition: { kcal: nu.clri, carb: nu.crbh, fat: nu.lipd, protein: nu.prot, sodium: nu.na },
    images: asArray(body?.ckngImgList?.ckngImg).map((i) => i.ckngImgUrl).filter(Boolean),
  };
});
