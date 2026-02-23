/* ==================================================
    野鳥詳細页面的脚本
   ================================================== */

import { getBirdByAreaAndId } from "./birds-data.js";

// DOM 获取（保持你原本的 id）
const nameJaEl = document.getElementById("bird-name-ja");      // 顶部：和名
const imgEl = document.getElementById("bird-image");           // 顶部：图片
const backLinkEl = document.getElementById("bird-back-link");  // 戻るリンク

const btnScrollBasic = document.getElementById("btn-scroll-basic"); // 基本情報按钮
const btnCopy = document.getElementById("btn-copy");                // コピー按钮

const SCROLL_OFFSET = 76; // header 偏移


//  URL 参数解析
const params = new URLSearchParams(location.search);
const area = params.get("area") || "kushiro";
const id = params.get("id");

// 返回链接：按 area 切换
if (backLinkEl) {
  if (area === "utonai") backLinkEl.href = "../Utonai/index.html";
  else if (area === "izunuma") backLinkEl.href = "../Izunuma/index.html";
  else backLinkEl.href = "../Kushiro/index.html";
}

// 启动：异步取数据后再渲染
(async function main() {
  const bird = id ? await getBirdByAreaAndId(area, id) : null;

  if (!bird) {
    renderNotFound();
    return;
  }

  renderTop(bird);
  fillBasicInfo(bird.detail?.basicInfo);
  fillEcology(bird.detail?.ecology);
  fillList("list-appearance", bird.detail?.appearance);
  fillList("list-behavior", bird.detail?.behavior);
  fillList("list-cautions", bird.detail?.cautions);
  bindActions();
})().catch((e) => {
  console.error("[bird-detail.js] Failed to init:", e);
  renderNotFound();
});

// 渲染：找不到鸟时
function renderNotFound() {
  if (nameJaEl) nameJaEl.textContent = "該当の鳥が見つかりませんでした";
  if (imgEl) {
    imgEl.src = "";
    imgEl.alt = "";
  }

  fillBasicInfo(null);
  fillEcology(null);
  fillList("list-appearance", []);
  fillList("list-behavior", []);
  fillList("list-cautions", []);

  document.title = "野鳥図鑑";
}

// 渲染：顶部区域
function renderTop(b) {
  if (nameJaEl) nameJaEl.textContent = b.nameJa || "";

  if (imgEl) {
    imgEl.src = b.image || "";
    imgEl.alt = b.nameJa || "bird";
  }

  document.title = `${b.nameJa || "野鳥"} | 野鳥図鑑`;
}

// 交互：滚动 / 复制
function bindActions() {
  if (btnScrollBasic) {
    btnScrollBasic.addEventListener("click", () => {
      const basicBlock = document.getElementById("bird-basic-info");
      if (!basicBlock) return;

      const top =
        basicBlock.getBoundingClientRect().top +
        window.scrollY -
        SCROLL_OFFSET;

      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener("click", async () => {
      const text = buildCopyText();
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        btnCopy.textContent = "コピー済み";
        setTimeout(() => (btnCopy.textContent = "コピー"), 1200);
      } catch (e) {
        alert("コピーに失敗しました。HTTPS または権限を確認してください。");
      }
    });
  }
}

// 填充：基本情報
function fillBasicInfo(basic) {
  setText("basic-waName", basic?.waName);
  setText("basic-gakuName", basic?.gakuName);
  setText("basic-eiName", basic?.eiName);
  setText("basic-classification", basic?.classification);
  setText("basic-bodyLength", basic?.bodyLength);
  setText("basic-wingspan", basic?.wingspan);
  setText("basic-season", basic?.season);
  setText("basic-habitat", basic?.habitat);
}

// 填充：生態情報
function fillEcology(eco) {
  setText("eco-lifespan", eco?.lifespan);
  setText("eco-diet", eco?.diet);
  setText("eco-breeding", eco?.breeding);
  setText("eco-pair", eco?.pair);
  setText("eco-status", eco?.status);
}

// 填充：列表（外観/行動/注意）
function fillList(ulId, items) {
  const ul = document.getElementById(ulId);
  if (!ul) return;

  ul.innerHTML = "";
  if (!Array.isArray(items) || items.length === 0) return;

  items.filter(Boolean).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = String(text);
    ul.appendChild(li);
  });
}

// 小工具
function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value ? String(value) : "";
}

function buildCopyText() {
  const parts = [];
  const ja = nameJaEl?.textContent || "";
  if (ja) parts.push(`【和名】${ja}`);
  return parts.join("\n").trim();
}
