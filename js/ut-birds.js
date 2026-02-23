/* ======================
  ウトナイ湖エリアの野鳥リスト初期化
  ====================== */

import { initAreaBirdList } from "./area-birds.js";
initAreaBirdList({
  area: "utonai",
  listId: "ut-bird-list",
  paginationId: "ut-pagination",
  totalCountId: "ut-total-count",
  listSectionSelector: ".kr-list",
});
