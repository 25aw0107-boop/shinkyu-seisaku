/* ======================
   主页英雄区，鸟和树木之类的进入动画
   ====================== */

window.addEventListener("DOMContentLoaded", () => {
    // 选中整个 hero 区块
    const hero = document.querySelector(".scope-hero");

    if (!hero) return;
    // 下一帧再加 class，确保 CSS 初始状态先生效，再触发过渡
    requestAnimationFrame(() => {
        hero.classList.add("is-in");
    });
});