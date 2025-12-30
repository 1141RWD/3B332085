let currentType = 'all';
let searchQuery = "";
let currentSlide = 0;
let autoPlayInterval;

const slides = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');

// 分類過濾
function filterType(type, btn) {
    currentType = type;
    document.querySelectorAll('.btn-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
}

// 搜尋過濾
function searchGames() {
    searchQuery = document.getElementById('game-search').value.toLowerCase();
    applyFilters();
}

// 核心過濾邏輯：必須同時符合「分類」與「搜尋字」
function applyFilters() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const gameName = card.querySelector('h3').innerText.toLowerCase();
        const cardCat = card.dataset.cat;

        const catMatch = (currentType === 'all' || cardCat === currentType);
        const searchMatch = gameName.includes(searchQuery);

        // 如果兩個條件都滿足才顯示
        if (catMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 輪播系統
function showSlide(n) {
    if (slides.length === 0) return;
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => { showSlide(currentSlide + 1); }, 3000);
}

function stopAutoPlay() { clearInterval(autoPlayInterval); }

// 評論功能
function addComment(btn, listId) {
    const cardInfo = btn.closest('.card-info');
    const input = cardInfo.querySelector('.user-comment');
    const starSelect = cardInfo.querySelector('.star-select');
    const list = document.getElementById(listId);
    if (input.value.trim() === "") return;

    const starsHtml = "⭐".repeat(parseInt(starSelect.value));
    const div = document.createElement('div');
    div.className = 'player-review';
    div.innerHTML = `<div class="stars" style="color:#f1c40f; font-size:12px;">${starsHtml}</div><p style="font-size:13px; margin:5px 0; color:#ddd;">"${input.value}"</p>`;
    list.insertBefore(div, list.firstChild);
    input.value = "";
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    startAutoPlay();
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(index);
            startAutoPlay();
        });
    });

    // 自動補齊星星選單內容
    const starOptions = `<option value="5">⭐⭐⭐⭐⭐</option><option value="4">⭐⭐⭐⭐</option><option value="3">⭐⭐⭐</option><option value="2">⭐⭐</option><option value="1">⭐</option>`;
    document.querySelectorAll('.star-select').forEach(menu => { menu.innerHTML = starOptions; });
});
