/* ======================
   鸟类弧形队列效果
   ====================== */

document.addEventListener('DOMContentLoaded', () => {
    // 选中所有弧形卡片
    const items = document.querySelectorAll('[data-arc-item]');
    if (!items.length) return;

    // 可调参数：控制弧线形状 / 速度
    const maxX = 460;        // 左右移动范围（越大弧越宽）
    const arcHeight = 200;   // 弧线高度（越大越「圆」）
    const baseY = 10;       // 整体往下移动一点
    const maxAngle = 40;    // 卡片左右最大倾斜角度（度数）
    const baseScale = 0.9;  // 最小缩小比例
    const scaleBoost = 0; // 中央放大的程度
    const baseX = -60;       // 新增：整体水平偏移（负数=向左，正数=向右）

    let offset = 1;         // 整体偏移（用来让队列往左跑）
    const speed = 0.3;     // 速度：越小越慢

    let lastTime = performance.now();

    function update(now) {
        const dt = (now - lastTime) / 1000; // 秒
        lastTime = now;

        // 累加偏移量并循环
        offset = (offset + speed * dt) % items.length;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const card = item.querySelector('.bird-arc__card');

            // 逻辑位置：当前卡片在队伍中的「连队索引」
            const logicalIndex = i + offset;

            // 映射到 [0,1)
            let s = (logicalIndex / items.length) % 1;
            // 再映射到 [-1,1]，中心为 0
            s = (s - 0.5) * 2;

            // 弧形轨道：左右位移
            const x = baseX + s * maxX;


            // 上下位移：
            // 中央最高（Y 最小），两侧越往外越往下
            const y = baseY + (s * s) * arcHeight;

            // 左右倾斜角度：
            // 左边向左倾、右边向右倾（和你原来 CSS 一样）
            const angle = s * maxAngle;

            // 缩放：中心最大，两侧逐渐变小
            const scale = baseScale + (1 - Math.abs(s)) * scaleBoost;

            // 应用到 item（整体位置：左右 + 上下）
            item.style.transform = `translateX(${x}px) translateY(${y}px)`;

            // 应用到 card（角度 + 缩放）
            card.style.transform = `rotate(${angle}deg) scale(${scale})`;

            // z-index：让中心那张盖在最上面
            const z = 100 + Math.round((1 - Math.abs(s)) * 20);
            item.style.zIndex = String(z);
        }

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
});
