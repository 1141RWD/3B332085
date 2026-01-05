/**
 * 霓虹遊戲大廳 - 核心邏輯整合版 (修正平移動畫)
 */
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
            return { level: 1, exp: 0, favs: [], playCounts: {}, reviews: {} };
        }
        return this.allData[this.currentUser];
    },

    init() {
        ui.loadTheme();
        ui.updateStatus();
        this.render();
        carousel.init();
    },

    render() {
        const grid = document.getElementById('game-grid');
        const searchInput = document.getElementById('game-search');
        const search = searchInput ? searchInput.value.toLowerCase() : "";
        const userData = this.user;
        const isGuest = this.currentUser === "訪客";

        const filtered = GAMES.filter(g => {
            const matchSearch = g.name.toLowerCase().includes(search);
            const matchCat = (this.currentCat === 'all') || 
                             (this.currentCat === 'fav' ? userData.favs.includes(g.id) : g.cat === this.currentCat);
            return matchSearch && matchCat;
        });

        // 加上 index 來計算 animation-delay
        grid.innerHTML = filtered.map((g, index) => {
            const plays = userData.playCounts[g.id] || 0;
            const isFav = userData.favs.includes(g.id);

            let allReviews = [];
            Object.keys(this.allData).forEach(userName => {
                const userReviews = this.allData[userName].reviews?.[g.id] || [];
                allReviews = allReviews.concat(userReviews);
            });
            allReviews.sort((a, b) => b.time - a.time);

            // 這裡加入了 fade-in-up 類別與動態延遲，實現慢慢平移出現
            return `
            <div class="card fade-in-up" style="animation-delay: ${index * 0.04}s">
                <span onclick="app.toggleFav(${g.id})" style="position:absolute; top:10px; right:10px; cursor:pointer; color:${isFav?'var(--pink)':'#444'}; font-size:1.5rem; z-index:10">${isFav?'★':'☆'}</span>
                <div class="card-img" style="background:linear-gradient(135deg, ${g.col}, #000)" onclick="app.playGame(${g.id}, '${g.url}')">${g.icon}</div>
                <div class="card-body">
                    <h3 style="margin:0">${g.name}</h3>
                    <div style="font-size:0.75rem; color:var(--neon); margin:5px 0">總遊玩次數: ${plays}</div>
                    
                    <div class="review-area" style="max-height:80px; overflow-y:auto; background:rgba(0,0,0,0.3); padding:8px; border-radius:5px; margin-bottom:10px; border:1px solid rgba(255,255,255,0.05)">
                        ${allReviews.length > 0 ? allReviews.map(rev => `
                            <div style="font-size:0.7rem; margin-bottom:5px; border-bottom:1px solid #222; padding-bottom:2px;">
                                <b style="color:var(--pink)">@${rev.user}</b>: <span style="color:#ccc">${rev.text}</span>
                            </div>
                        `).join('') : '<div style="color:#555; font-size:0.7rem;">暫無回報...</div>'}
                    </div>

                    <div style="display:flex; gap:5px">
                        ${isGuest ? 
                            `<div style="font-size:0.7rem; color:#666; text-align:center; width:100%">登入後即可參與評論</div>` :
                            `<input type="text" id="in-${g.id}" placeholder="回報戰況..." style="flex:1; background:#000; border:1px solid #333; color:#fff; font-size:0.7rem; padding:5px;">
                             <button class="btn-cyber" style="padding:2px 8px" onclick="app.addReview(${g.id})">送出</button>`
                        }
                    </div>
                </div>
            </div>`;
        }).join('');

        // 觸發重繪確保動畫每次分類切換都會跑
        grid.style.display = 'none';
        grid.offsetHeight; 
        grid.style.display = 'grid';
    },

    save(updatedData) {
        if (this.currentUser && this.currentUser !== "訪客") {
            this.allData[this.currentUser] = { ...updatedData, name: this.currentUser };
            localStorage.setItem('neon_multi_user_save', JSON.stringify(this.allData));
        }
    },

    playGame(id, url) {
        if (!this.currentUser) return ui.toggleAuthModal(true);
        let d = this.user;
        d.playCounts[id] = (d.playCounts[id] || 0) + 1;
        if (this.currentUser !== "訪客") {
            d.exp += 50; 
            if (d.exp >= d.level * 200) d.level++;
            this.save(d);
        }
        ui.updateStatus();
        this.render();
        setTimeout(() => window.location.href = url, 300);
    },

    toggleFav(id) {
        if (!this.currentUser) return ui.toggleAuthModal(true);
        let d = this.user;
        if (!d.favs) d.favs = [];
        const idx = d.favs.indexOf(id);
        idx > -1 ? d.favs.splice(idx, 1) : d.favs.push(id);
        this.save(d);
        this.render();
    },

    addReview(id) {
        if (!this.currentUser || this.currentUser === "訪客") return;
        const input = document.getElementById(`in-${id}`);
        const text = input.value.trim();
        if (!text) return;
        let d = this.user;
        if (!d.reviews[id]) d.reviews[id] = [];
        d.reviews[id].unshift({ user: this.currentUser, text: text, time: Date.now() });
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
            const isGuest = app.currentUser === "訪客";
            section.innerHTML = themeBtn + `<span style="margin-right:10px; color:${isGuest?'#aaa':'var(--neon)'}">${app.currentUser}</span><button class="btn-cyber" onclick="account.logout()">EXIT</button>`;
            document.getElementById('player-status-bar').style.display = 'flex';
            const d = app.user;
            document.getElementById('p-level').innerText = isGuest ? "--" : d.level;
            document.getElementById('p-exp-fill').style.width = isGuest ? "0%" : `${(d.exp % (d.level * 200)) / (d.level * 2)}%`;
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
    register() {
        const name = document.getElementById('auth-user').value.trim();
        if (!name || name === "訪客") return alert("代號無效");
        if (app.allData[name]) return alert("此帳號已存在");
        app.allData[name] = { level: 1, exp: 0, favs: [], playCounts: {}, reviews: {} };
        app.currentUser = name;
        localStorage.setItem('neon_last_user', name);
        app.save(app.allData[name]);
        ui.toggleAuthModal(false);
        ui.updateStatus();
        app.render();
    },
    login() {
        const name = document.getElementById('auth-user').value.trim();
        if (!app.allData[name]) return alert("帳號不存在");
        app.currentUser = name;
        localStorage.setItem('neon_last_user', name);
        ui.toggleAuthModal(false);
        ui.updateStatus();
        app.render();
    },
    guestMode() {
        app.currentUser = "訪客";
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
        if (!track) return;
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
