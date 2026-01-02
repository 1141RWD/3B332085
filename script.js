const GAMES = [
    { id: 1, name: "Horror Farm", cat: "街機", icon: "👨‍🌾", url: "farmer.html", col: "#FF512F" },
    { id: 2, name: "2048 Neon", cat: "益智", icon: "🧩", url: "2048.html", col: "#1FA2FF" },
    { id: 3, name: "心臟病", cat: "多人", icon: "🃏", url: "card.html", col: "#8E2DE2" },
    { id: 4, name: "極限避障", cat: "街機", icon: "🚧", url: "escape.html", col: "#F09819" },
    { id: 5, name: "霓虹掃雷", cat: "益智", icon: "💣", url: "mines.html", col: "#00FF87" },
    { id: 6, name: "五子棋", cat: "多人", icon: "⚫", url: "gomoku.html", col: "#7928CA" },
    { id: 7, name: "技術流飛鏢", cat: "街機", icon: "🎯", url: "darts.html", col: "#e52d27" },
    { id: 8, name: "猜數字 100", cat: "益智", icon: "❓", url: "guess100.html", col: "#2193b0" },
    { id: 9, name: "記憶對對碰", cat: "多人", icon: "🧠", url: "pair.html", col: "#6A11CB" },
    { id: 10, name: "經典貪食蛇", cat: "街機", icon: "🐍", url: "snake.html", col: "#FF8C00" },
    { id: 11, name: "幾A幾B", cat: "益智", icon: "🔢", url: "ab.html", col: "#00dbde" },
    { id: 12, name: "打磚塊", cat: "街機", icon: "🧱", url: "breakout.html", col: "#3a7bd5" },
    { id: 13, name: "極速穿梭", cat: "街機", icon: "🚀", url: "flappy.html", col: "#DD2476" },
    { id: 14, name: "快手搶牌", cat: "益智", icon: "👻", url: "ghost.html", col: "#FF0080" }
];

const app = {
    currentCat: 'all',
    currentUser: localStorage.getItem('neon_last_user') || null,
    allData: JSON.parse(localStorage.getItem('neon_multi_user_save')) || {},

    get user() {
        if (!this.currentUser || !this.allData[this.currentUser]) {
            return { isLoggedIn: false, name: '', level: 1, exp: 0, favs: [], playCounts: {}, reviews: {} };
        }
        return this.allData[this.currentUser];
    },

    init() {
        ui.loadTheme();
        ui.updateStatus();
        this.render();
        carousel.init();
    },

  // 修改 render 函數中的留言顯示部分
render() {
    const grid = document.getElementById('game-grid');
    const search = document.getElementById('game-search').value.toLowerCase();
    const userData = this.user;

    const filtered = GAMES.filter(g => {
        const matchSearch = g.name.toLowerCase().includes(search);
        const matchCat = (this.currentCat === 'all') || 
                         (this.currentCat === 'fav' ? userData.favs.includes(g.id) : g.cat === this.currentCat);
        return matchSearch && matchCat;
    });

    grid.innerHTML = filtered.map(g => {
        const plays = userData.playCounts[g.id] || 0;
        const isFav = userData.favs.includes(g.id);

        // 核心改動：從 allData 裡抓取「所有帳號」對這款遊戲的留言
        let allReviews = [];
        Object.keys(this.allData).forEach(userName => {
            const userReviews = this.allData[userName].reviews?.[g.id] || [];
            allReviews = allReviews.concat(userReviews);
        });
        
        // 按照留言內容排序（最新的在上面）
        allReviews.sort((a, b) => b.timestamp - a.timestamp);

        return `
        <div class="card">
            <span onclick="app.toggleFav(${g.id})" style="position:absolute; top:10px; right:10px; cursor:pointer; color:${isFav?'var(--pink)':'#444'}; font-size:1.5rem; z-index:10">${isFav?'★':'☆'}</span>
            <div class="card-img" style="background:linear-gradient(135deg, ${g.col}, #000)" onclick="app.playGame(${g.id}, '${g.url}')">${g.icon}</div>
            <div class="card-body">
                <h3 style="margin:0">${g.name}</h3>
                <div style="font-size:0.75rem; color:var(--neon); margin:5px 0">總遊玩次數: ${plays}</div>
                
                <div class="review-area" style="border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2);">
                    ${allReviews.length > 0 ? allReviews.map(rev => `
                        <div class="msg" style="margin-bottom:5px; border-bottom:1px dashed #333; padding-bottom:2px;">
                            <b style="color:var(--pink)">@${rev.user}</b>: <span style="color:#ccc">${rev.text}</span>
                        </div>
                    `).join('') : '<div style="color:#666; font-size:0.7rem;">尚無特工回報...</div>'}
                </div>

                <div style="display:flex; gap:5px">
                    <input type="text" id="in-${g.id}" placeholder="回報戰況..." style="flex:1; background:#000; border:1px solid #333; color:#fff; font-size:0.7rem; padding:5px;">
                    <button class="btn-cyber" style="padding:2px 8px; font-size:0.7rem;" onclick="app.addReview(${g.id})">發送</button>
                </div>
            </div>
        </div>`;
    }).join('');
},

// 修改 addReview 函數，存入更多資訊
addReview(id) {
    if (!this.currentUser) return ui.toggleAuthModal(true);
    const input = document.getElementById(`in-${id}`);
    const text = input.value.trim();
    if (!text) return;

    let d = this.user;
    if (!d.reviews[id]) d.reviews[id] = [];
    
    // 存入物件：包含發送者名字、內容、時間戳記
    d.reviews[id].unshift({
        user: this.currentUser,
        text: text,
        timestamp: Date.now()
    });

    input.value = '';
    this.save(d);
    this.render(); // 立即重新渲染看到留言
}

        grid.innerHTML = filtered.map(g => {
            const plays = userData.playCounts[g.id] || 0;
            const isFav = userData.favs.includes(g.id);

            return `
            <div class="card">
                <span onclick="app.toggleFav(${g.id})" style="position:absolute; top:10px; right:10px; cursor:pointer; color:${isFav?'var(--pink)':'#444'}; font-size:1.5rem; z-index:10">${isFav?'★':'☆'}</span>
                <div class="card-img" style="background:linear-gradient(135deg, ${g.col}, #000)" onclick="app.playGame(${g.id}, '${g.url}')">${g.icon}</div>
                <div class="card-body">
                    <h3 style="margin:0">${g.name}</h3>
                    <div style="font-size:0.75rem; color:var(--neon); margin:5px 0">總遊玩次數: ${plays}</div>
                    <div class="review-area">${(userData.reviews[g.id] || []).map(m => `<div class="msg">${m}</div>`).join('')}</div>
                    <div style="display:flex; gap:5px">
                        <input type="text" id="in-${g.id}" placeholder="留下你的評論..." style="flex:1; background:#000; border:1px solid #333; color:#fff; font-size:0.7rem; padding:5px;">
                        <button class="btn-cyber" style="padding:2px 8px" onclick="app.addReview(${g.id})">送出</button>
                    </div>
                </div>
            </div>`;
        }).join('');
    },

    save(updatedData) {
        if (this.currentUser) {
            this.allData[this.currentUser] = { ...updatedData, isLoggedIn: true, name: this.currentUser };
            localStorage.setItem('neon_multi_user_save', JSON.stringify(this.allData));
        }
    },

    playGame(id, url) {
        if (!this.currentUser) return ui.toggleAuthModal(true);
        let d = this.user;
        d.playCounts[id] = (d.playCounts[id] || 0) + 1;
        d.exp += 50; 
        if (d.exp >= d.level * 200) d.level++;
        this.save(d);
        ui.updateStatus();
        this.render();
        setTimeout(() => window.location.href = url, 300);
    },

    toggleFav(id) {
        if (!this.currentUser) return ui.toggleAuthModal(true);
        let d = this.user;
        if(!d.favs) d.favs = [];
        const idx = d.favs.indexOf(id);
        idx > -1 ? d.favs.splice(idx, 1) : d.favs.push(id);
        this.save(d);
        this.render();
    },

    addReview(id) {
        if (!this.currentUser) return ui.toggleAuthModal(true);
        const input = document.getElementById(`in-${id}`);
        if (!input.value.trim()) return;
        let d = this.user;
        if (!d.reviews[id]) d.reviews[id] = [];
        d.reviews[id].unshift(`${this.currentUser}: ${input.value}`);
        input.value = '';
        this.save(d);
        this.render();
    },

    setCategory(cat, btn) {
        this.currentCat = cat;
        document.querySelectorAll('.btn-cyber').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.render();
    }
};

const ui = {
    toggleAuthModal(show) { document.getElementById('auth-modal').style.display = show ? 'flex' : 'none'; },
    updateStatus() {
        const section = document.getElementById('user-section');
        const isLight = document.body.classList.contains('light-mode');
        const themeBtn = `<button class="btn-cyber" style="margin-right:10px" onclick="ui.toggleTheme()">${isLight?'🌙':'☀️'}</button>`;
        if (app.currentUser) {
            section.innerHTML = themeBtn + `<span style="margin-right:10px; color:var(--neon)">${app.currentUser}</span><button class="btn-cyber" onclick="account.logout()">EXIT</button>`;
            document.getElementById('player-status-bar').style.display = 'flex';
            document.getElementById('p-level').innerText = app.user.level;
            document.getElementById('p-score').innerText = "ONLINE"; // 原本顯示總分的地方改顯示狀態
            document.getElementById('p-exp-fill').style.width = `${(app.user.exp % (app.user.level * 200)) / (app.user.level * 2)}%`;
        } else {
            section.innerHTML = themeBtn + `<button class="btn-cyber" onclick="ui.toggleAuthModal(true)">LOGIN</button>`;
            document.getElementById('player-status-bar').style.display = 'none';
        }
    },
    toggleTheme() {
        const isLight = document.body.classList.toggle('light-mode');
        localStorage.setItem('neon_theme', isLight ? 'light' : 'dark');
        this.updateStatus();
    },
    loadTheme() {
        if (localStorage.getItem('neon_theme') === 'light') document.body.classList.add('light-mode');
    }
};

const account = {
    login() {
        const name = document.getElementById('auth-user').value.trim();
        if (!name) return;
        app.currentUser = name;
        localStorage.setItem('neon_last_user', name);
        if (!app.allData[name]) {
            app.allData[name] = { level: 1, exp: 0, favs: [], playCounts: {}, reviews: {} };
        }
        app.save(app.allData[name]);
        ui.toggleAuthModal(false);
        ui.updateStatus();
        app.render();
    },
    logout() {
        localStorage.removeItem('neon_last_user');
        location.reload();
    }
};

const carousel = {
    idx: 0,
    init() {
        const track = document.getElementById('carousel-track');
        const items = [GAMES[0], GAMES[1], GAMES[2]];
        track.innerHTML = items.map(g => `
            <div class="carousel-slide" style="background-image: linear-gradient(90deg, rgba(0,0,0,0.8), transparent), url('https://picsum.photos/1200/400?sig=${g.id}')">
                <div class="slide-box">
                    <h2 style="font-family:Orbitron; margin:0">${g.name}</h2>
                    <button class="btn-cyber" onclick="app.playGame(${g.id}, '${g.url}')">PLAY NOW</button>
                </div>
            </div>
        `).join('');
        setInterval(() => {
            this.idx = (this.idx + 1) % 3;
            track.style.transform = `translateX(-${this.idx * 100}%)`;
        }, 5000);
    }
};

window.onload = () => app.init();

