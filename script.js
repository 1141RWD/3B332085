let currentType = 'all';
let currentDiff = 'all';

// 過濾系統
function filterType(type, btn) {
    currentType = type;
    document.querySelectorAll('.btn-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

function filterDiff(diff, btn) {
    currentDiff = diff;
    document.querySelectorAll('[class*="btn-diff"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

function applyFilters() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const catMatch = currentType === 'all' || card.dataset.cat === currentType;
        const diffMatch = currentDiff === 'all' || card.dataset.diff === currentDiff;
        card.style.display = (catMatch && diffMatch) ? 'block' : 'none';
    });
}

// 輪播系統
let slideIndex = 0;
function showSlides() {
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');

    setTimeout(showSlides, 5000);
}
function addComment(btn, listId) {
    const cardInfo = btn.closest('.card-info');
    const input = cardInfo.querySelector('.user-comment');
    const starSelect = cardInfo.querySelector('.star-select');
    const list = document.getElementById(listId);
    
    if (input.value.trim() === "") return;

    // 取得玩家選的星星數量並轉換成星星圖案
    const starCount = parseInt(starSelect.value);
    const starsHtml = "⭐".repeat(starCount);

    const div = document.createElement('div');
    div.className = 'player-review';
    // 留言出現的小動畫
    div.style.animation = 'fadeIn 0.5s ease forwards'; 
    div.innerHTML = `
        <div class="stars" style="color:#f1c40f; font-size:12px;">${starsHtml}</div>
        <p class="review-quote" style="font-size:13px; margin:5px 0; color:#ddd;">"${input.value}"</p>
    `;

    // 插入到列表最上方
    list.insertBefore(div, list.firstChild);
    
    // 清空輸入框
    input.value = "";
    
    // 成功回饋：讓卡片閃一下藍光
    const cardInner = btn.closest('.card-inner');
    cardInner.style.boxShadow = "0 0 30px var(--neon-cyan)";
    setTimeout(() => {
        cardInner.style.boxShadow = "";
    }, 500);
}
// 評論功能

window.onload = function() {
    const starMenus = document.querySelectorAll('.star-select');
    const starOptions = `
        <option value="5">⭐⭐⭐⭐⭐</option>
        <option value="4">⭐⭐⭐⭐</option>
        <option value="3">⭐⭐⭐</option>
        <option value="2">⭐⭐</option>
        <option value="1">⭐</option>
    `;

    starMenus.forEach(menu => {
        // 如果該選單只有一個選項（或是空的），就自動補齊
        if (menu.options.length <= 1) {
            menu.innerHTML = starOptions;
        }
    });
};
// 初始化
document.addEventListener('DOMContentLoaded', () => {
    showSlides();
    console.log("NEON ARCADE: RESPONSIVE SYSTEM ONLINE");
});
