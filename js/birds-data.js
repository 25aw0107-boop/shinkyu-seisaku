/* ======================
  从json文件异步获取鸟类数据
  ====================== */

function urlFromThisModule(relativePath) {
  return new URL(relativePath, import.meta.url).toString();
}

const AREA_TO_URL = {
  kushiro: urlFromThisModule("data/birds-kushiro.json"),
  utonai: urlFromThisModule("data/birds-utonai.json"),
  izunuma: urlFromThisModule("data/birds-izunuma.json"),
};

const cacheByArea = new Map();

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${url} (${res.status})`);
  }
  return res.json();
}

export async function getBirdsByArea(area) {
  const url = AREA_TO_URL[area];
  if (!url) return [];

  if (cacheByArea.has(area)) return cacheByArea.get(area);

  const data = await fetchJson(url);
  const list = Array.isArray(data) ? data : [];

  cacheByArea.set(area, list);
  return list;
}

export async function getBirdByAreaAndId(area, id) {
  if (!area || !id) return null;

  const list = await getBirdsByArea(area);
  return list.find((b) => String(b.id) === String(id)) || null;
}




// 复制按钮功能
const btnCopy = document.getElementById("btn-copy");

if (btnCopy) {
  btnCopy.addEventListener("click", async () => {
    // 直接从DOM读取（页面已经渲染好的内容）
    const waName = getText("basic-waName");
    const gakuName = getText("basic-gakuName");
    const eiName = getText("basic-eiName");

    if (!waName && !gakuName && !eiName) return;

    const text = [
      waName,
      gakuName ? `学名：\n${gakuName}` : "",
      eiName ? `英名：\n${eiName}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);

      // 視覚フィードバック
      const prev = btnCopy.textContent;
      btnCopy.textContent = "コピー済み";
      setTimeout(() => {
        btnCopy.textContent = prev || "コピー";
      }, 1200);
    } catch (e) {
      console.error(e);
      alert("コピーに失敗しました。");
    }
  });
}

function getText(id) {
  const el = document.getElementById(id);
  return el ? el.textContent.trim() : "";
}
