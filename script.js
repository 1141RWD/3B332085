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

// --- 修正後的輪播控制 ---
let autoPlayInterval;

function startAutoPlay() {
    stopAutoPlay(); // 先清除舊的，避免疊加速度變快
    autoPlayInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// 點擊點點切換 (修正誤觸問題)
dots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
        e.stopPropagation(); // 重要：防止點點擊時同時觸發圖片的跳轉遊戲
        showSlide(index);
        startAutoPlay(); // 重置計時器
    });
});

// --- 初始化區塊 ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. 確保初始顯示第一張
    showSlide(0);
    
    // 2. 啟動自動輪播
    startAutoPlay();
    
    // 3. 修正：如果滑鼠停在輪播圖上，暫停自動播放
    const carousel = document.getElementById('hero-carousel');
    if(carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }

    console.log("NEON ARCADE: SYSTEM ONLINE");
});

// 保留你原本的 window.onload 星星補齊功能
const originalOnload = window.onload;
window.onload = function() {
    if (originalOnload) originalOnload();
    const starMenus = document.querySelectorAll('.star-select');
    const starOptions = `
        <option value="5">⭐⭐⭐⭐⭐</option>
        <option value="4">⭐⭐⭐⭐</option>
        <option value="3">⭐⭐⭐</option>
        <option value="2">⭐⭐</option>
        <option value="1">⭐</option>
    `;
    starMenus.forEach(menu => {
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


