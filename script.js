let currentType = 'all';
let currentDiff = 'all';

function filterType(type, btn) {
    currentType = type;
    updateActiveButton('.btn-cat', btn);
    applyFilters();
}

function filterDiff(diff, btn) {
    currentDiff = diff;
    updateActiveButton('[class*="btn-diff"]', btn);
    applyFilters();
}

function updateActiveButton(groupSelector, activeBtn) {
    document.querySelectorAll(groupSelector).forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
}

function applyFilters() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const catMatch = currentType === 'all' || card.dataset.cat === currentType;
        const diffMatch = currentDiff === 'all' || card.dataset.diff === currentDiff;
        
        if (catMatch && diffMatch) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

const style = document.createElement('style');
style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);

console.log("NEON ARCADE: 14 GAMES READY.");
// --- 輪播邏輯 ---
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');

function showSlides() {
    // 移除所有 active 狀態
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }

    // 顯示當前 slide
    slides[slideIndex - 1].classList.add('active');
    dots[slideIndex - 1].classList.add('active');

    // 每 5 秒切換一次
    setTimeout(showSlides, 5000);
}

// 啟動輪播
window.onload = () => {
    showSlides();
    console.log("NEON ARCADE: ALL SYSTEMS GO.");
};