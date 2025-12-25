document.addEventListener('DOMContentLoaded', () => {
    // 1. 輪播控制器
    let slideIndex = 0;
    const inner = document.getElementById('carousel-inner');
    const totalSlides = 3; 

    function moveSlide() {
        slideIndex = (slideIndex + 1) % totalSlides;
        // 每次位移 100/3 = 33.333%
        inner.style.transform = `translateX(-${slideIndex * (100 / totalSlides)}%)`;
    }

    let carouselTimer = setInterval(moveSlide, 5000);

    // 2. 過濾功能
    const catBtns = document.querySelectorAll('.btn-cat');
    const diffBtns = document.querySelectorAll('.btn-diff');
    const cards = document.querySelectorAll('.card');
    
    let activeCat = 'all';
    let activeDiff = 'all';

    function filter() {
        cards.forEach(card => {
            const matchesCat = activeCat === 'all' || card.dataset.cat === activeCat;
            const matchesDiff = activeDiff === 'all' || card.dataset.diff === activeDiff;
            card.style.display = (matchesCat && matchesDiff) ? 'block' : 'none';
        });
    }

    catBtns.forEach(btn => btn.addEventListener('click', (e) => {
        catBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeCat = e.currentTarget.dataset.type;
        filter();
    }));

    diffBtns.forEach(btn => btn.addEventListener('click', (e) => {
        diffBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeDiff = e.currentTarget.dataset.diff;
        filter();
    }));
});
