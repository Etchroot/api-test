// index.html(목록)과 detail.html(상세)이 함께 쓰는 코드: DOM 헬퍼, 아이콘, 공공데이터포털 호출
// 서버 없이 브라우저가 포털을 직접 호출한다. 인증키는 로컬의 config.js 에만 있고 git 에는 올라가지 않는다.
// (이 방식은 키가 브라우저에 보이므로 config.js 를 공유하거나 이 페이지를 공개 배포하면 안 된다)

// API 주소는 여기 한 곳에 모은다. 주소를 바꾸면 화면이 쓰는 API가 바뀐다.
const API = {
  BASE: "https://apis.data.go.kr/1390803/allbaroFoodMonth", // 🔌 농촌진흥청 이달의 농식품 (공공데이터포털)
  FOOD_LIST: "foodList",       // 🔌 월별 식재료 목록 (목록은 foods-data.js 에 고정해 두어 지금은 호출하지 않는다)
  FOOD_DETAIL: "foodCont",     // 🔌 식재료 상세 (고르는 법, 보관법, 영양 등)
  RECIPE_DETAIL: "recipeCont", // 🔌 레시피 상세 (재료, 조리 순서)
};

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
  chevron: ["m6 9 6 6 6-6"], // 아래 화살표 (토글 버튼)
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
const API_BASE = String(CFG.API_BASE || API.BASE).replace(/\/$/, "");
// Encoding 키(%XX 포함)는 그대로, Decoding 키(+ / = 포함)는 인코딩해서 붙인다
function normalizeKey(k) {
  k = String(k || "").trim();
  if (!k || /여기에/.test(k)) return "";
  return /%[0-9A-Fa-f]{2}/.test(k) ? k : encodeURIComponent(k);
}

// 키는 두 곳에서 온다: ① 내 컴퓨터의 config.js ② 화면에서 직접 입력(GitHub Pages 등). 입력한 키는 이 탭의 sessionStorage 에만 둔다
// (탭을 닫으면 사라진다. 저장소·서버로는 보내지 않고 공공데이터포털에만 전달한다)
const KEY_STORE = "foodmonth:servicekey";
function readStoredKey() { try { return sessionStorage.getItem(KEY_STORE) || ""; } catch { return ""; } }
let KEY_PARAM = normalizeKey(CFG.SERVICE_KEY) || normalizeKey(readStoredKey());
const hasKey = () => !!KEY_PARAM;
const keyFromConfig = () => !!normalizeKey(CFG.SERVICE_KEY);
function saveKey(k) {
  const n = normalizeKey(k);
  if (!n) return false;
  try { sessionStorage.setItem(KEY_STORE, k.trim()); } catch {}
  KEY_PARAM = n;
  return true;
}
function clearKey() {
  try { sessionStorage.removeItem(KEY_STORE); } catch {}
  KEY_PARAM = normalizeKey(CFG.SERVICE_KEY); // config.js 의 키가 있으면 그대로 쓴다
}

// 인증키 입력 칸. 저장하면 onSaved 를 부른다. message 가 있으면 왜 다시 입력하는지 보여 준다.
function keyPanel(onSaved, message) {
  const box = el("form", null, "keybox");
  box.append(el("h3", "인증키를 입력하면 상세 정보를 볼 수 있어요"));
  if (message) box.append(el("p", message, "err"));
  const label = el("label", "공공데이터포털 일반 인증키");
  label.htmlFor = "keyinput";
  const input = el("input");
  input.type = "password"; input.id = "keyinput"; input.autocomplete = "off"; input.spellcheck = false;
  input.placeholder = "발급받은 인증키(Encoding 또는 Decoding)";
  const btn = el("button", "저장하고 불러오기");
  btn.type = "submit";
  box.append(label, input, btn,
    el("p", "키는 이 탭에만 저장되고(탭을 닫으면 사라져요) 공공데이터포털에만 전달돼요. 저장소나 다른 서버로는 보내지 않아요. 다른 사람과 키를 공유하지 마세요.", "hint"));
  box.addEventListener("submit", (e) => {
    e.preventDefault();
    if (saveKey(input.value)) onSaved(); else input.focus();
  });
  return box;
}

const GAP_MS = 1500, RETRY_WAITS = [4000, 12000, 30000];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let tail = Promise.resolve(), lastCallAt = 0;

// 호출 제한(초당 요청 수)이 빡빡해서 한 줄로 세워 간격을 두고, 제한 오류(코드 23)면 기다렸다 재시도한다
function callApi(operation, params) {
  if (!KEY_PARAM) return Promise.reject(new Error("인증키가 없습니다 (config.js 를 만들거나 화면에서 키를 입력하세요)"));
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
    const url = `${API_BASE}/${operation}?serviceKey=${KEY_PARAM}&${qs}`;
    const res = await fetch(url); // 🔌 API 호출
    logCall({ label: `${operation} ${qs}`, shown: `${API_BASE}/${operation}?serviceKey=●●●●&${qs}`, url, status: res.status });
    const text = await res.text();
    if (/returnReasonCode[^0-9]{1,6}23\b/.test(text) && attempt < RETRY_WAITS.length) { // XML·JSON 어느 쪽으로 와도
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
  const gw = root.OpenAPI_ServiceResponse?.cmmMsgHeader; // 게이트웨이 오류가 JSON 으로 올 때 (예: 등록되지 않은 서비스키)
  if (gw) throw new Error(`${gw.returnAuthMsg || gw.errMsg || "게이트웨이 오류"} (code ${gw.returnReasonCode})`);
  const r = root.response || root;
  const code = String(r.header?.resultCode ?? "");
  if (code !== "200") throw new Error(`${r.header?.resultMsg || "응답 오류"} (code ${code})`);
  return r.body;
}

// ── "🔌 이 화면이 쓰는 API" 상자: 실제로 부른 주소(키는 가림)를 보여 준다 ──
const API_LOG = [];
function logCall(entry) {
  API_LOG.push({ ...entry, at: new Date() });
  if (API_LOG.length > 30) API_LOG.shift();
  document.dispatchEvent(new Event("apilog"));
}

function apiBox(note) {
  const box = el("section", null, "apibox");
  box.setAttribute("aria-labelledby", "apibox-title");
  const title = el("h2", "🔌 이 화면이 쓰는 API");
  title.id = "apibox-title";
  box.append(title);
  const ul = el("ul", null, "api-ops");
  for (const [name, op, desc] of [["식재료 목록", API.FOOD_LIST, "고정 목록(foods-data.js)을 써서 호출하지 않음"], ["식재료 상세", API.FOOD_DETAIL, "상세 화면에서 호출"], ["레시피 상세", API.RECIPE_DETAIL, "추천 요리를 누르면 호출"]]) {
    ul.append(el("li", `${name}: ${API_BASE}/${op} — ${desc}`));
  }
  box.append(ul);
  if (note) box.append(el("p", note, "hint"));
  const head = el("h3", "실제로 부른 주소");
  const list = el("ol", null, "api-calls");
  const warn = el("p", "원본 보기 링크에는 내 인증키가 들어 있어요. 화면을 다른 사람에게 보여 주는 중에는 누르지 마세요.", "hint");
  box.append(head, list, warn);
  const draw = () => {
    list.replaceChildren();
    if (!API_LOG.length) { list.append(el("li", "아직 부른 주소가 없어요.", "hint")); return; }
    for (const c of API_LOG) {
      const li = el("li");
      if (c.cached) { li.append(el("span", `${c.label} — 이 브라우저에 저장된 결과를 써서 호출하지 않았어요`)); }
      else {
        li.append(el("code", c.shown), document.createTextNode(` (HTTP ${c.status}) `));
        const a = el("a", "새 탭에서 원본 JSON 보기");
        a.href = c.url; a.target = "_blank"; a.rel = "noopener noreferrer";
        li.append(a);
      }
      list.append(li);
    }
  };
  draw();
  document.addEventListener("apilog", draw);
  return box;
}

const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

// 호출 횟수를 아끼려고 localStorage 에 캐시한다 (목록 1일, 상세·레시피 7일). 막혀 있어도 동작은 한다.
const TTL = { list: 24 * 3600e3, detail: 7 * 24 * 3600e3 };
async function cached(key, ttl, fetcher) {
  try {
    const hit = JSON.parse(localStorage.getItem(`foodmonth:${key}`) || "null");
    if (hit && Date.now() - hit.at < ttl) { logCall({ label: key, cached: true }); return hit.body; }
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
  const body = await callApi(API.FOOD_LIST, { srchMonth: String(month), pageNo: "1", numOfRows: "50" });
  return { month, items: asArray(body?.items?.item).map((i) => ({ sn: i.fdmtSn, name: i.fdmtNm, image: i.fdmtImgUrl || "" })) };
});

const fetchFoodDetail = (sn) => cached(`food:${sn}`, TTL.detail, async () => {
  const body = await callApi(API.FOOD_DETAIL, { srchFdmtSn: String(sn) });
  const s = body?.stdInfo || {}, n = body?.ntkInfo || {};
  return {
    sn: s.fdmtSn, name: s.fdmtNm,
    origin: s.ctvtIndcDtl || "", pick: s.prchCheatDtl || "", storage: s.cstdyMthDtl || "", tip: s.etcInfoDtl || "",
    eat: n.ntkMthDtl || "", nutrition: n.ntrIrdntEfcyDtl || "", research: n.rltRsrchInfoDtl || "", stats: n.cnsmpqyDtl || "",
    recipes: asArray(body?.connRecipeList?.recipeInfo).map((r) => ({ sn: r.recipeSn, name: r.recipeNm, image: r.recipeImgUrl || "" })),
  };
});

const fetchRecipe = (sn) => cached(`recipe:${sn}`, TTL.detail, async () => {
  const body = await callApi(API.RECIPE_DETAIL, { srchRecipeSn: String(sn) });
  const s = body?.stdInfo || {}, nu = body?.nutriInfo || {};
  return {
    sn: s.recipeSn, name: s.recipeNm, ingredients: s.matrlInfo || "", steps: s.ckngMthInfo || "", note: s.grpMlsvApplc || "",
    nutrition: { kcal: nu.clri, carb: nu.crbh, fat: nu.lipd, protein: nu.prot, sodium: nu.na },
    images: asArray(body?.ckngImgList?.ckngImg).map((i) => i.ckngImgUrl).filter(Boolean),
  };
});
