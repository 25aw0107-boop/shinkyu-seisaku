/* ======================
   釧路エリアの野鳥リスト初期化
   ====================== */

import { initAreaBirdList } from "./area-birds.js";
initAreaBirdList({
  area: "kushiro",
  listId: "kr-bird-list",
  paginationId: "kr-pagination",
  totalCountId: "kr-total-count",
  listSectionSelector: ".kr-list",
});
