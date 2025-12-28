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

    // 每 4 秒切換一次
    setTimeout(showSlides, 4000);
}

// 啟動輪播
window.onload = () => {
    showSlides();
    console.log("NEON ARCADE: ALL SYSTEMS GO.");

};
function addComment(btn, listId) {
    const input = btn.previousElementSibling;
    const list = document.getElementById(listId);
    
    if (input.value.trim() === "") {
        alert("請輸入評論內容！");
        return;
    }

    // 建立新評論
    const newReview = document.createElement('div');
    newReview.className = 'player-review';
    newReview.style.animation = 'fadeIn 0.5s ease forwards';
    newReview.innerHTML = `
        <div class="stars">⭐⭐⭐⭐⭐</div>
        <p class="review-quote">"${input.value}"</p>
        <p class="reviewer">- Guest Player</p>
    `;

    // 插入到列表最前方
    list.insertBefore(newReview, list.firstChild);
    
    // 自動滾動到頂部
    list.scrollTop = 0;

    // 清空輸入
    input.value = "";
}

// 動態動畫
const style = document.createElement('style');
style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }`;
document.head.appendChild(style);

console.log("NEON ARCADE: INTERACTIVE SYSTEM ONLINE.");

