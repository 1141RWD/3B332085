// --- 1. 全域變數 ---
let currentType = 'all';
let currentDiff = 'all';
let currentSlide = 0;
let autoPlayInterval;

const slides = document.querySelectorAll('.carousel-item');
const dots = document.querySelectorAll('.dot');

// --- 2. 過濾系統 ---
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

// --- 3. 輪播系統 ---
function showSlide(n) {
    if (slides.length === 0) return;
    
    // 移除舊的 active 狀態
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    // 計算正確的索引
    currentSlide = (n + slides.length) % slides.length;
    
    // 加入新的 active 狀態
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function startAutoPlay() {
    stopAutoPlay(); 
    autoPlayInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 3000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// --- 4. 評論功能 ---
function addComment(btn, listId) {
    const cardInfo = btn.closest('.card-info');
    const input = cardInfo.querySelector('.user-comment');
    const starSelect = cardInfo.querySelector('.star-select');
    const list = document.getElementById(listId);
    
    if (input.value.trim() === "") return;

    const starCount = parseInt(starSelect.value);
    const starsHtml = "⭐".repeat(starCount);

    const div = document.createElement('div');
    div.className = 'player-review';
    div.style.animation = 'fadeIn 0.5s ease forwards'; 
    div.innerHTML = `
        <div class="stars" style="color:#f1c40f; font-size:12px;">${starsHtml}</div>
        <p class="review-quote" style="font-size:13px; margin:5px 0; color:#ddd;">"${input.value}"</p>
    `;

    list.insertBefore(div, list.firstChild);
    input.value = "";
    
    const cardInner = btn.closest('.card-inner');
    cardInner.style.boxShadow = "0 0 30px #00f2fe";
    setTimeout(() => { cardInner.style.boxShadow = ""; }, 500);
}

// --- 5. 初始化區塊 (合併後的 DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    // 初始化輪播
    showSlide(0);
    startAutoPlay();
    
    // 綁定點點切換
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止觸發圖片點擊連結
            showSlide(index);
            startAutoPlay(); 
        });
    });

    // 滑鼠懸停暫停輪播
    const carousel = document.getElementById('hero-carousel');
    if(carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }

    // 初始化星星選單
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

    console.log("NEON ARCADE: SYSTEM ONLINE");
});
let searchQuery = "";

function searchGames() {
    // 取得輸入框的值並轉為小寫（不區分大小寫）
    searchQuery = document.getElementById('game-search').value.toLowerCase();
    applyFilters();
}

// 修改原有的 applyFilters，讓它支援搜尋
function applyFilters() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const gameName = card.querySelector('h3').innerText.toLowerCase();
        const cardCat = card.dataset.cat;
        
        // 判斷分類是否符合
        const catMatch = (currentType === 'all' || cardCat === currentType);
        // 判斷搜尋文字是否符合
        const searchMatch = gameName.includes(searchQuery);
        
        // 兩者皆符合才顯示
        if (catMatch && searchMatch) {
            card.style.display = 'block';
            // 可以加一點小動畫
            card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });

    // 如果搜尋不到任何結果，顯示提示文字 (可選)
    checkNoResults();
}

function checkNoResults() {
    let visibleCards = document.querySelectorAll('.card[style="display: block;"]').length;
    let container = document.getElementById('game-list');
    let noMsg = document.getElementById('no-results-msg');

    if (visibleCards === 0) {
        if (!noMsg) {
            noMsg = document.createElement('div');
            noMsg.id = 'no-results-msg';
            noMsg.style.cssText = "grid-column: 1/-1; text-align: center; padding: 50px; color: #666; font-family: Orbitron;";
            noMsg.innerHTML = "SYSTEM ERROR: NO GAMES FOUND";
            container.appendChild(noMsg);
        }
    } else if (noMsg) {
        noMsg.remove();
    }
}


