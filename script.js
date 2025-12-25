document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const totalSlides = 4;
    const inner = document.getElementById('carousel-inner');
    
    // 1. 自動輪播邏輯
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        inner.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
    }, 4000);

    // 2. 篩選邏輯
    let activeCat = 'all';
    let activeDiff = 'all';

    const catBtns = document.querySelectorAll('.btn-cat');
    const diffBtns = document.querySelectorAll('.btn-diff');
    const cards = document.querySelectorAll('.card');

    // 類別篩選按鈕點擊
    catBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            activeCat = e.target.getAttribute('data-type');
            updateUI(catBtns, e.target);
            applyFilters();
        });
    });

    // 難度篩選按鈕點擊
    diffBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            activeDiff = e.target.getAttribute('data-diff');
            updateUI(diffBtns, e.target);
            applyFilters();
        });
    });

    function updateUI(group, target) {
        group.forEach(b => b.classList.remove('active'));
        target.classList.add('active');
    }

    function applyFilters() {
        cards.forEach(card => {
            const cat = card.dataset.cat;
            const diff = card.dataset.diff;
            const catMatch = activeCat === 'all' || cat.includes(activeCat);
            const diffMatch = activeDiff === 'all' || diff === activeDiff;
            card.style.display = (catMatch && diffMatch) ? 'block' : 'none';
        });
    }
});
