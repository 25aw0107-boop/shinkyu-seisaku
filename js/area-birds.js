/* ======================
   所有数据的公共入口
   ====================== */

import { getBirdsByArea } from "./birds-data.js";

export async function initAreaBirdList(options) {
    const {
        area, // "kushiro" | "utonai" | "izunuma"
        listId,
        paginationId,
        totalCountId,
        listSectionSelector = ".kr-list",
        itemsPerPage = 10,
        scrollOffset = 80,
    } = options;

    const listEl = document.getElementById(listId);
    const paginationEl = document.getElementById(paginationId);
    const totalCountEl = document.getElementById(totalCountId);

    if (!listEl || !paginationEl || !totalCountEl) {
        console.error(
            `[area-birds] Missing elements: #${listId} / #${paginationId} / #${totalCountId}`
        );
        return;
    }

    let birdData = [];
    let currentPage = 1;

    try {
        birdData = await getBirdsByArea(area);
    } catch (e) {
        console.error("[area-birds] Failed to load birds:", e);
        totalCountEl.textContent = "0";
        return;
    }

    totalCountEl.textContent = String(birdData.length);

    const pageFromUrl = getPageFromUrl();
    if (pageFromUrl) currentPage = pageFromUrl;

    renderPage(currentPage);


    // 渲染整页
    function renderPage(page) {
        clear(listEl);
        clear(paginationEl);

        const totalPages = Math.max(1, Math.ceil(birdData.length / itemsPerPage));
        const safePage = clamp(page, 1, totalPages);
        currentPage = safePage;

        const start = (safePage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = birdData.slice(start, end);

        pageItems.forEach((bird) => {
            listEl.appendChild(createBirdCard(bird, area));
        });

        paginationEl.appendChild(createPagination(totalPages, safePage));
        setPageToUrl(safePage);
    }


    // 卡片生成函数
    function createBirdCard(bird, area) {
        const li = document.createElement("li");
        li.className = "kr-card";

        const id = sanitize(bird.id);
        const nameJa = sanitize(bird.nameJa);
        const nameEn = sanitize(bird.nameEn);
        const spot = sanitize(bird.spot);
        const image = sanitize(bird.image);

        const detailUrl = `../zukan/index.html?area=${encodeURIComponent(
            area
        )}&id=${encodeURIComponent(id)}`;

        li.innerHTML = `
      <a href="${detailUrl}" class="kr-card__link">
        <div class="kr-card__thumb">
          <img src="${image}" alt="${nameJa}">
        </div>
        <div class="kr-card__body">
          <p class="kr-card__name-ja">${nameJa}</p>
          <p class="kr-card__name-en">${nameEn}</p>
          <p class="kr-card__spot">${spot}</p>
        </div>
      </a>
    `;
        return li;
    }


    //   分页生成函数
    function createPagination(totalPages, currentPage) {
        const frag = document.createDocumentFragment();

        frag.appendChild(
            createPageButton("‹", currentPage > 1 ? currentPage - 1 : 1, currentPage === 1)
        );

        const items = buildPageItems(totalPages, currentPage);

        items.forEach((item) => {
            if (item === "...") {
                frag.appendChild(createEllipsis());
                return;
            }
            frag.appendChild(createPageNumber(item, currentPage));
        });

        frag.appendChild(
            createPageButton(
                "›",
                currentPage < totalPages ? currentPage + 1 : totalPages,
                currentPage === totalPages
            )
        );

        return frag;
    }

    function buildPageItems(totalPages, currentPage) {
        if (totalPages <= 6) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];
        const last = totalPages;

        if (currentPage <= 2) {
            pages.push(1, 2, 3);
            if (currentPage === 2) pages.push(4);
            pages.push("...", last);
            return pages;
        }

        if (currentPage >= last - 1) {
            pages.push(1, "...");
            if (currentPage === last - 1) pages.push(last - 3);
            pages.push(last - 2, last - 1, last);
            return pages;
        }

        pages.push(
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            last
        );

        return pages;
    }

    function createEllipsis() {
        const li = document.createElement("li");
        li.className = "pagination__item pagination__item--ellipsis";
        li.textContent = "...";
        return li;
    }

    function createPageNumber(page, currentPage) {
        const li = document.createElement("li");
        li.className = "pagination__item";

        const a = document.createElement("a");
        a.href = "#";
        a.className = "pagination__link";
        a.textContent = String(page);

        if (page === currentPage) {
            a.classList.add("pagination__link--current");
        }

        a.addEventListener("click", (e) => {
            e.preventDefault();
            renderPage(page);
            scrollToListTop();
        });

        li.appendChild(a);
        return li;
    }

    function createPageButton(label, targetPage, disabled) {
        const li = document.createElement("li");
        li.className =
            label === "‹"
                ? "pagination__item pagination__item--prev"
                : "pagination__item pagination__item--next";

        const a = document.createElement("a");
        a.href = "#";
        a.className = "pagination__link";
        a.textContent = label;

        if (disabled) {
            a.setAttribute("aria-disabled", "true");
            a.addEventListener("click", (e) => e.preventDefault());
        } else {
            a.addEventListener("click", (e) => {
                e.preventDefault();
                renderPage(targetPage);
                scrollToListTop();
            });
        }

        li.appendChild(a);
        return li;
    }

    
    // 工具函数
    function scrollToListTop() {
        const section = document.querySelector(listSectionSelector);
        if (!section) return;

        const top = section.getBoundingClientRect().top + window.scrollY - scrollOffset;
        window.scrollTo({ top, behavior: "smooth" });
    }

    function getPageFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const page = Number(params.get("page"));
        if (!Number.isInteger(page) || page < 1) return null;
        return page;
    }

    function setPageToUrl(page) {
        const params = new URLSearchParams(window.location.search);
        params.set("page", String(page));
        history.replaceState({}, "", `${location.pathname}?${params.toString()}`);
    }

    function clear(el) {
        while (el.firstChild) el.removeChild(el.firstChild);
    }

    function clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }

    function sanitize(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }
}
