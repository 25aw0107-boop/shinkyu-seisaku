/* ======================
   目录页英雄区背景格子动画（无重复版）
   ====================== */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('[data-bg-grid]');
    if (!grid) return;

    // 图片池
    const IMAGE_POOL = [
        'images/catalog-hero__bg/bird01.jpg',
        'images/catalog-hero__bg/bird02.jpg',
        'images/catalog-hero__bg/bird03.jpg',
        'images/catalog-hero__bg/bird04.jpg',
        'images/catalog-hero__bg/bird05.jpg',
        'images/catalog-hero__bg/bird06.jpg',
        'images/catalog-hero__bg/bird07.jpg',
        'images/catalog-hero__bg/bird08.jpg',
        'images/catalog-hero__bg/bird09.jpg',
        'images/catalog-hero__bg/bird10.jpg',
        'images/catalog-hero__bg/bird11.jpg',
        'images/catalog-hero__bg/bird12.jpg',
        'images/catalog-hero__bg/bird13.jpg',
        'images/catalog-hero__bg/bird14.jpg',
        'images/catalog-hero__bg/bird15.jpg',
        'images/catalog-hero__bg/bird16.jpg',
        'images/catalog-hero__bg/bird17.jpg',
        'images/catalog-hero__bg/bird18.jpg',
        'images/catalog-hero__bg/bird19.jpg',
        'images/catalog-hero__bg/bird20.jpg',
        'images/catalog-hero__bg/bird21.jpg',
        'images/catalog-hero__bg/bird22.jpg',
        'images/catalog-hero__bg/bird23.jpg',
        'images/catalog-hero__bg/bird24.jpg',
        'images/catalog-hero__bg/bird25.jpg',
        'images/catalog-hero__bg/bird26.jpg',
        'images/catalog-hero__bg/bird27.jpg',
        'images/catalog-hero__bg/bird28.jpg',
        'images/catalog-hero__bg/bird29.jpg',
        'images/catalog-hero__bg/bird30.jpg',
        'images/catalog-hero__bg/bird31.jpg',
        'images/catalog-hero__bg/bird32.jpg',
        'images/catalog-hero__bg/bird33.jpg',
        'images/catalog-hero__bg/bird34.jpg',
    ];

    const mqPc = window.matchMedia('(min-width: 1024px)');

    const CONFIG = {
        sp: { cols: 3, rows: 3, interval: 2500, changePerTick: 3 }, // SP稍微改小一点变动数，避免眼花
        pc: { cols: 4, rows: 5, interval: 2200, changePerTick: 10 },
    };

    let slots = [];
    let timerId = null;

    // --- 工具函数：洗牌算法 (Fisher-Yates) ---
    // 用于打乱数组顺序，保证初始化时不重复
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // --- 核心修改：获取一个屏幕上不存在的随机索引 ---
    // excludedIndices: 当前屏幕上已经占用的索引 Set
    function getUniqueRandomIndex(excludedIndices) {
        // 找出所有“未被使用”的图片索引
        const candidates = [];
        for (let i = 0; i < IMAGE_POOL.length; i++) {
            if (!excludedIndices.has(i)) {
                candidates.push(i);
            }
        }

        // 如果所有图都在屏幕上了（理论上不应发生，除非格子比图多），就退化为随机选一张
        if (candidates.length === 0) {
            return Math.floor(Math.random() * IMAGE_POOL.length);
        }

        // 从可用候选中随机挑一个
        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
    }

    // --- 修改：接收指定的 nextIndex ---
    // 不再自己在函数内部计算 index，而是由 tick 函数分配，确保唯一性
    function crossfadeSlot(slot, nextIndex) {
        const imgActive = slot.querySelector('img.is-active');
        const imgBack = slot.querySelector('img.is-back');
        if (!imgActive || !imgBack) return;

        // 设置新图
        imgBack.src = IMAGE_POOL[nextIndex];

        // 切换 Class
        imgActive.classList.remove('is-active');
        imgActive.classList.add('is-back');

        imgBack.classList.remove('is-back');
        imgBack.classList.add('is-active');

        // 更新 DOM 上的索引记录
        slot.dataset.bgIndex = String(nextIndex);
    }

    // --- 修改：每轮 tick ---
    function tick(changePerTick) {
        // 1. 收集当前屏幕上所有的图片索引 (防止重复)
        const currentIndicesOnScreen = new Set();
        slots.forEach(slot => {
            const idx = Number(slot.dataset.bgIndex);
            if (!isNaN(idx)) currentIndicesOnScreen.add(idx);
        });

        // 2. 随机挑选 N 个要变化的格子
        const count = Math.min(changePerTick, slots.length);
        const slotsToChangeIndices = new Set();
        while (slotsToChangeIndices.size < count) {
            slotsToChangeIndices.add(Math.floor(Math.random() * slots.length));
        }

        // 3. 对选中的格子，逐个分配“未上榜”的新图
        slotsToChangeIndices.forEach((slotIdx) => {
            const slot = slots[slotIdx];

            // 获取一个当前屏幕上绝对没有的新索引
            const newImgIndex = getUniqueRandomIndex(currentIndicesOnScreen);

            // 执行切换
            crossfadeSlot(slot, newImgIndex);

            // 【关键】将新选的图加入“已占用”集合
            // 这样循环中的下一个格子就不会再次选中这张图了
            currentIndicesOnScreen.add(newImgIndex);

            // 可选：将该格子原来的旧图索引从 Set 中移除（让其他格子有机会选它）
            // 但为了视觉稳定性，通常建议直接从“剩余池”里选，不急着复用刚消失的图
        });
    }

    function buildGrid() {
        const isPc = mqPc.matches;
        const cfg = isPc ? CONFIG.pc : CONFIG.sp;
        const cellCount = cfg.cols * cfg.rows;

        // 如果图片总数少于格子数，无法做到不重复，给予警告
        if (IMAGE_POOL.length < cellCount) {
            console.warn('Hero Grid: 图片数量少于格子数量，必然会出现重复图片。');
        }

        grid.innerHTML = '';
        slots = [];

        // --- 初始化修改：创建一个乱序的索引列表 ---
        // 例如 [0, 1, ... 33] -> [5, 12, 0, 33 ...]
        const allIndices = Array.from({ length: IMAGE_POOL.length }, (_, k) => k);
        const shuffledIndices = shuffleArray(allIndices);

        for (let i = 0; i < cellCount; i++) {
            const li = document.createElement('li');
            li.className = 'catalog-hero__bg-item';

            // 从洗牌后的数组里取，保证初始满屏不重复
            // 如果格子比图片多，用 % 循环取（虽然会重复，但这是没办法的兜底）
            const imgIndex = shuffledIndices[i % shuffledIndices.length];

            const imgFront = document.createElement('img');
            imgFront.src = IMAGE_POOL[imgIndex];
            imgFront.alt = '';
            imgFront.classList.add('is-active');

            const imgBack = document.createElement('img');
            imgBack.src = IMAGE_POOL[imgIndex]; // 初始状态背面和正面一致
            imgBack.alt = '';
            imgBack.classList.add('is-back');

            li.dataset.bgIndex = String(imgIndex);

            li.appendChild(imgFront);
            li.appendChild(imgBack);
            grid.appendChild(li);
        }

        slots = Array.from(grid.querySelectorAll('.catalog-hero__bg-item'));

        if (timerId) window.clearInterval(timerId);
        timerId = window.setInterval(() => tick(cfg.changePerTick), cfg.interval);

        grid.setAttribute('data-grid-mode', isPc ? 'pc' : 'sp');
    }

    buildGrid();

    if (mqPc.addEventListener) {
        mqPc.addEventListener('change', buildGrid);
    } else {
        mqPc.addListener(buildGrid);
    }
});