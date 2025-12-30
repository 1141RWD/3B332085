// --- 1. 全域變數 ---
let currentType = 'all';
let currentDiff = 'all'; // 難度過濾
let searchQuery = "";    // 搜尋過濾
let currentSlide = 0;
let autoPlayInterval;

const slides = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');

// --- 2. 過濾與搜尋系統 (核心邏輯) ---
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

function searchGames() {
    searchQuery = document.getElementById('game-search').value.toLowerCase();
    applyFilters();
}

// 統整所有過濾條件
function applyFilters() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const gameName = card.querySelector('h3').innerText.toLowerCase();
        const cardCat = card.dataset.cat;
        const cardDiff = card.dataset.diff; // 取得卡片難度資料
        
        // 判斷所有條件是否同時成立
        const catMatch = (currentType === 'all' || cardCat === currentType);
        const diffMatch = (currentDiff === 'all' || cardDiff === currentDiff);
        const searchMatch = gameName.includes(searchQuery);
        
        if (catMatch && diffMatch && searchMatch) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });

    checkNoResults();
}

function checkNoResults() {
    const visibleCards = Array.from(document.querySelectorAll('.card')).filter(c => c.style.display === 'block').length;
    const container = document.getElementById('game-list');
    let noMsg = document.getElementById('no-results-msg');

    if (visibleCards === 0) {
        if (!noMsg) {
            noMsg = document.createElement('div');
            noMsg.id = 'no-results-msg';
            noMsg.className = 'no-results-glow'; // 加入 CSS 類名方便美化
            noMsg.style.cssText = "grid-column: 1/-1; text-align: center; padding: 50px; color: var(--neon-pink); font-family: Orbitron; letter-spacing: 2px;";
            noMsg.innerHTML = " > ERROR: NO DATA MATCHES YOUR QUERY < ";
            container.appendChild(noMsg);
        }
    } else if (noMsg) {
        noMsg.remove();
    }
}

// --- 3. 輪播系統 ---
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

// --- 4. 評論功能 ---
function addComment(btn, listId) {
    const cardInfo = btn.closest('.card-info');
    const input = cardInfo.querySelector('.user-comment');
    const starSelect = cardInfo.querySelector('.star-select');
    const list = document.getElementById(listId);
    
    if (input.value.trim() === "") return;

    const starsHtml = "⭐".repeat(parseInt(starSelect.value));
    const div = document.createElement('div');
    div.className = 'player-review';
    div.innerHTML = `
        <div class="stars" style="color:#f1c40f; font-size:12px;">${starsHtml}</div>
        <p class="review-quote" style="font-size:13px; margin:5px 0; color:#ddd;">"${input.value}"</p>
    `;

    list.insertBefore(div, list.firstChild);
    input.value = "";
    
    const cardInner = btn.closest('.card-inner');
    cardInner.style.boxShadow = "0 0 30px var(--neon-cyan)";
    setTimeout(() => { cardInner.style.boxShadow = ""; }, 500);
}

// --- 5. 初始化 ---
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

    const carousel = document.getElementById('hero-carousel');
    if(carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }

    const starMenus = document.querySelectorAll('.star-select');
    const starOptions = `
        <option value="5">⭐⭐⭐⭐⭐</option>
        <option value="4">⭐⭐⭐⭐</option>
        <option value="3">⭐⭐⭐</option>
        <option value="2">⭐⭐</option>
        <option value="1">⭐</option>
    `;
    starMenus.forEach(menu => { if (menu.options.length <= 1) menu.innerHTML = starOptions; });

    console.log("NEON ARCADE: SYSTEM ONLINE");
});
