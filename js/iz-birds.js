/* ======================
   伊豆沼・内沼エリアの野鳥リスト初期化
   ====================== */

import { initAreaBirdList } from "./area-birds.js";

initAreaBirdList({
  area: "izunuma",
  listId: "iz-bird-list",
  paginationId: "iz-pagination",
  totalCountId: "iz-total-count",
  listSectionSelector: ".kr-list",
});
