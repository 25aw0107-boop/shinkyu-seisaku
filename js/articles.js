/* ======================
    最下方的記事列表 + 分页功能
   ====================== */

// 一页显示几条
const ARTICLES_PER_PAGE = 4;

// 这里写所有記事数据（可以 10 个 / 22 个 / 100 个）
const allArticles = [
  {
    title: '野鳥の言葉をわかるように',
    excerpt: '面白くて読みやすいたちまち10万部!',
    img: 'images/article01.jpg',
    date: '2025-12-22',
    url: 'https://www.amazon.co.jp/-/zh/dp/4093891842/ref=sr_1_185?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&crid=O4DPHTYRHXYN&dib=eyJ2IjoiMSJ9.L3tsJn0ADXStqTyNdDm-v1Vfz3Qfir4kg6PhM2DzLG3sjYZBUqKN49ngLa5KR_gjPFFE0f4BeWFbp2WBxZE97CpNsqvaOx8jjekEwLTOTKay7H_XiNRaYE4d5kC94QaSEG9SunxLMdoQDMmrxtDU0uFIoxOZihICxnhYB1nLzdP8hTibFjW4Wp2KZYewNF12rvRsRXRmDq0v8CHKrhPGWlaLS5oVc7yN4r7DDCRLqly9ZiAKX-sMCisT8frCUwLiiLcgRFkBXC36vIQRpApq3OHlAFr8WReGeo0DJOsEpKU.708ioN-WAE4CyNHKzH0bAIAIR8ocs8094Lz9UlSPw24&dib_tag=se&keywords=%E9%87%8E%E9%B3%A5&qid=1765979835&sprefix=%E9%87%8E%E9%B3%A5%2Caps%2C311&sr=8-185&xpid=oezKMbhrgDlbL', // 跳转链接（先空着，之后填入）
  },
  {
    title: '鳥類について体系的に学べる',
    excerpt: '子どもも大人も驚きの鳥たちのまる秘クイズ51問!',
    img: 'images/article02.jpg',
    date: '2025-11-12',
    url: 'https://www.amazon.co.jp/-/zh/dp/4140818077/ref=pd_ybh_a_d_sccl_120/355-5907022-4438645?pd_rd_w=oHkRc&content-id=amzn1.sym.1f33a0e5-a414-499c-9548-6d784880c121&pf_rd_p=1f33a0e5-a414-499c-9548-6d784880c121&pf_rd_r=36D15SW2YPSFRJ5XFEP6&pd_rd_wg=2w7IU&pd_rd_r=85ff320b-27e9-42f0-b061-e1327d1200ea&pd_rd_i=4140818077&psc=1',
  },
  {
    title: '日常行動が鳥への影響',
    excerpt: 'ゴアジラ講演会で「身近な行動が引き起こす野鳥への影響」',
    img: 'images/article03.jpg',
    date: '2025-11-02',
    url: 'https://www.amazon.co.jp/-/zh/dp/4829972602/ref=pd_ybh_a_d_sccl_121/355-5907022-4438645?pd_rd_w=oHkRc&content-id=amzn1.sym.1f33a0e5-a414-499c-9548-6d784880c121&pf_rd_p=1f33a0e5-a414-499c-9548-6d784880c121&pf_rd_r=36D15SW2YPSFRJ5XFEP6&pd_rd_wg=2w7IU&pd_rd_r=85ff320b-27e9-42f0-b061-e1327d1200ea&pd_rd_i=4829972602&psc=1',
  },
  {
    title: '今年の夏も「野鳥まつり」開催します！！',
    excerpt: '今年の夏も「野鳥まつり」開催します！！',
    img: 'images/article04.jpg',
    date: '2025-10-28',
    url: 'https://www.youtube.com/watch?v=UTOWp04jTkw',
  },
  {
    title: 'ただ見わけるだけじゃない！',
    excerpt: '観察を楽しむためのポイントも満載！！',
    img: 'images/article05.jpg',
    date: '2025-10-15',
    url: 'https://www.amazon.co.jp/-/zh/dp/4815625190/ref=sr_1_16?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&crid=Q85KZGA39B6T&dib=eyJ2IjoiMSJ9.O2IrX5qKNBnSlNkDbqz2W-MAWfceOdzvZiTyaA9eS_Y9uStK6ad5hWuxVA13xANNhg8mICOCGSV5G382Lsrv5DL9m43Pdi7jgQqR4csfhHh8keIJQ1PoA_12HmhKNutJG8SVTt5w45JAAMJZ29WyzSK0xVKkFS3bHNBdGQsORXAx3FF5Lp9FbCxbSZC61Jlpc1V1omgNjelpdz-Go4dt4cKzVcM_fhHozYIEyu6Qlbc7514dsvXfvQWNQoIllrTZBIWCCLzZmmq6eZCGuZtgmplonTindlZQU_Dw3U7UJW8.syRSPDbrv2NXiXuhhfrQCzn4foj8IRrxuCNkS3oZGW8&dib_tag=se&keywords=%E9%87%8E%E9%B8%9F&qid=1765979600&sprefix=%E9%87%8E%E9%B8%9F%E7%9A%84%2Caps%2C272&sr=8-16',
  },
  {
    title: '鳥撮カメラ使いこなし術',
    excerpt: 'あなたに合う撮影スタイルは？',
    img: 'images/article06.jpg',
    date: '2025-10-13',
    url: 'https://www.amazon.co.jp/-/zh/dp/B0G1X5HFXH/ref=sr_1_8?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&crid=Q85KZGA39B6T&dib=eyJ2IjoiMSJ9.O2IrX5qKNBnSlNkDbqz2W-MAWfceOdzvZiTyaA9eS_Y9uStK6ad5hWuxVA13xANNhg8mICOCGSV5G382Lsrv5DL9m43Pdi7jgQqR4csfhHh8keIJQ1PoA_12HmhKNutJG8SVTt5w45JAAMJZ29WyzSK0xVKkFS3bHNBdGQsORXAx3FF5Lp9FbCxbSZC61Jlpc1V1omgNjelpdz-Go4dt4cKzVcM_fhHozYIEyu6Qlbc7514dsvXfvQWNQoIllrTZBIWCCLzZmmq6eZCGuZtgmplonTindlZQU_Dw3U7UJW8.syRSPDbrv2NXiXuhhfrQCzn4foj8IRrxuCNkS3oZGW8&dib_tag=se&keywords=%E9%87%8E%E9%B8%9F&qid=1765979600&sprefix=%E9%87%8E%E9%B8%9F%E7%9A%84%2Caps%2C272&sr=8-8',
  },
  {
    title: 'かわいい、美声、わりと地味？',
    excerpt: 'それだけじゃない！ 鳥たちの素顔！',
    img: 'images/article07.jpg',
    date: '2025-10-11',
    url: 'https://www.amazon.co.jp/-/zh/dp/4816376658/ref=sr_1_3?__mk_zh_CN=%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BD%91%E7%AB%99&crid=Q85KZGA39B6T&dib=eyJ2IjoiMSJ9.O2IrX5qKNBnSlNkDbqz2W-MAWfceOdzvZiTyaA9eS_Y9uStK6ad5hWuxVA13xANNhg8mICOCGSV5G382Lsrv5DL9m43Pdi7jgQqR4csfhHh8keIJQ1PoA_12HmhKNutJG8SVTt5w45JAAMJZ29WyzSK0xVKkFS3bHNBdGQsORXAx3FF5Lp9FbCxbSZC61Jlpc1V1omgNjelpdz-Go4dt4cKzVcM_fhHozYIEyu6Qlbc7514dsvXfvQWNQoIllrTZBIWCCLzZmmq6eZCGuZtgmplonTindlZQU_Dw3U7UJW8.syRSPDbrv2NXiXuhhfrQCzn4foj8IRrxuCNkS3oZGW8&dib_tag=se&keywords=%E9%87%8E%E9%B8%9F&qid=1765979600&sprefix=%E9%87%8E%E9%B8%9F%E7%9A%84%2Caps%2C272&sr=8-3',
  },
];

// 总页数
const TOTAL_PAGES = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);

// 当前页
let currentPage = 1;

// 这两个先声明成全局变量，稍后再赋值
let articleListEl;
let paginationEl;

// 渲染某一页的記事列表
function renderArticles(page) {
  articleListEl.innerHTML = '';

  const startIndex = (page - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const pageArticles = allArticles.slice(startIndex, endIndex);

  pageArticles.forEach((article) => {
    const articleEl = document.createElement('article');
    articleEl.className = 'article-card';

    // ✅ 改成「可跳转 + 新页面打开」
    // url 为空时就回退到 #，避免跳去空地址
    const safeUrl = article.url && article.url.trim() !== '' ? article.url : '#';

    articleEl.innerHTML = `
      <a
        href="${safeUrl}"
        class="article-card__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <!-- 左侧：图片 + 标题 -->
        <div class="article-card__left">
          <div class="article-card__thumb">
            <img src="${article.img}" alt="${article.title}">
          </div>
          <div class="article-card__title-wrap">
            <h3 class="article-card__title">
              ${article.title}
            </h3>
          </div>
        </div>

        <!-- 右侧：上 摘要 / 下 日期 -->
        <div class="article-card__right">
          <p class="article-card__excerpt">
            ${article.excerpt}
          </p>
          <div class="article-card__meta">
            <time class="article-card__date" datetime="${article.date}">
              ―${article.date.replace(/-/g, '.')}
            </time>
          </div>
        </div>
      </a>
    `;

    // url为空时，阻止#导致页面跳到顶部
    if (safeUrl === '#') {
      articleEl.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
      });
    }

    articleListEl.appendChild(articleEl);
  });
}

// 渲染分页按钮（不变）
function renderPagination() {
  paginationEl.innerHTML = '';
  if (TOTAL_PAGES <= 1) return;

  const prevLi = document.createElement('li');
  prevLi.className = 'pagination__item pagination__item--prev';
  prevLi.innerHTML = `
    <a href="#" class="pagination__link" aria-label="前のページ">‹</a>
  `;
  if (currentPage === 1) {
    prevLi.querySelector('a').classList.add('is-disabled');
  } else {
    prevLi.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      goToPage(currentPage - 1);
    });
  }
  paginationEl.appendChild(prevLi);

  for (let i = 1; i <= TOTAL_PAGES; i++) {
    const li = document.createElement('li');
    li.className = 'pagination__item';

    if (i === currentPage) {
      li.classList.add('pagination__item--current');
      li.innerHTML = `
        <span class="pagination__link pagination__link--current">${i}</span>
      `;
    } else {
      li.innerHTML = `
        <a href="#" class="pagination__link">${i}</a>
      `;
      li.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(i);
      });
    }

    paginationEl.appendChild(li);
  }

  const nextLi = document.createElement('li');
  nextLi.className = 'pagination__item pagination__item--next';
  nextLi.innerHTML = `
    <a href="#" class="pagination__link" aria-label="次のページ">›</a>
  `;
  if (currentPage === TOTAL_PAGES) {
    nextLi.querySelector('a').classList.add('is-disabled');
  } else {
    nextLi.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      goToPage(currentPage + 1);
    });
  }
  paginationEl.appendChild(nextLi);
}

function goToPage(page) {
  if (page < 1 || page > TOTAL_PAGES) return;
  currentPage = page;
  renderArticles(currentPage);
  renderPagination();
}

// 等DOM全部加载完，再去拿元素&初始化
document.addEventListener('DOMContentLoaded', () => {
  articleListEl = document.getElementById('article-list');
  paginationEl = document.getElementById('pagination');

  if (!articleListEl || !paginationEl) return;
  goToPage(1);
});
