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

        grid.innerHTML = filtered.map((g, index) => {
            const plays = userData.playCounts[g.id] || 0;
            const isFav = userData.favs.includes(g.id);

            let reviews = [];
            Object.values(this.allData).forEach(u => {
                if(u.reviews && u.reviews[g.id]) reviews = reviews.concat(u.reviews[g.id]);
            });
            reviews.sort((a,b) => b.time - a.time);

            return `
            <div class="card fade-in-up" style="animation-delay: ${index * 0.05}s">
                <span onclick="app.toggleFav(${g.id})" style="position:absolute; top:10px; right:10px; cursor:pointer; color:${isFav?'var(--pink)':'#444'}; font-size:1.5rem; z-index:10">${isFav?'★':'☆'}</span>
                <div class="card-img" style="background:linear-gradient(135deg, ${g.col}, #000)" onclick="app.playGame(${g.id}, '${g.url}')">${g.icon}</div>
                <div class="card-body">
                    <h3 style="margin:0">${g.name}</h3>
                    <p style="font-size:0.7rem; color:var(--neon); margin:5px 0">PLAYED: ${plays}</p>
                    <div class="review-area">
                        ${reviews.length > 0 ? reviews.map(r => `<div class="msg"><b style="color:var(--pink)">@${r.user}</b>: ${r.text}</div>`).join('') : '<div style="color:#444">尚無回報</div>'}
                    </div>
                    <div style="display:flex; gap:5px">
                        ${isGuest ? `<small style="color:#666; width:100%; text-align:center">登入後即可留言</small>` : 
                        `<input type="text" id="in-${g.id}" placeholder="回報內容..." style="flex:1; background:#000; border:1px solid #333; color:#fff; font-size:0.7rem;">
                         <button class="btn-cyber" style="padding:2px 8px" onclick="app.addReview(${id})">GO</button>`}
                    </div>
                </div>
            </div>`;
        }).join('');
    },

    save(data) {
        if (this.currentUser && this.currentUser !== "訪客") {
            this.allData[this.currentUser] = { ...data, name: this.currentUser };
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
        d.favs = d.favs || [];
        const i = d.favs.indexOf(id);
        i > -1 ? d.favs.splice(i, 1) : d.favs.push(id);
        this.save(d);
        this.render();
    },

    addReview(id) {
        const txt = document.getElementById(`in-${id}`).value.trim();
        if (!txt) return;
        let d = this.user;
        d.reviews[id] = d.reviews[id] || [];
        d.reviews[id].unshift({ user: this.currentUser, text: txt, time: Date.now() });
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
    toggleAuthModal(s) { document.getElementById('auth-modal').style.display = s ? 'flex' : 'none'; },
    updateStatus() {
        const sec = document.getElementById('user-section');
        const isL = document.body.classList.contains('light-mode');
        const themeBtn = `<button class="btn-cyber" style="margin-right:10px" onclick="ui.toggleTheme()">${isL?'🌙':'☀️'}</button>`;
        
        if (app.currentUser) {
            const isG = app.currentUser === "訪客";
            sec.innerHTML = themeBtn + `<span style="margin-right:10px; color:${isG?'#777':'var(--neon)'}">${app.currentUser}</span><button class="btn-cyber" onclick="account.logout()">EXIT</button>`;
            document.getElementById('player-status-bar').style.display = 'flex';
            const d = app.user;
            document.getElementById('p-level').innerText = isG ? "--" : d.level;
            document.getElementById('p-exp-fill').style.width = isG ? "0%" : `${(d.exp % (d.level * 200)) / (d.level * 2)}%`;
        } else {
            sec.innerHTML = themeBtn + `<button class="btn-cyber" onclick="ui.toggleAuthModal(true)">LOGIN</button>`;
            document.getElementById('player-status-bar').style.display = 'none';
        }
    },
    toggleTheme() {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('neon_theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        this.updateStatus();
    },
    loadTheme() {
        if (localStorage.getItem('neon_theme') === 'light') document.body.classList.add('light-mode');
    }
};

const account = {
    register() {
        const n = document.getElementById('auth-user').value.trim();
        if(!n || n === "訪客" || app.allData[n]) return alert("名稱無效或已存在");
        app.allData[n] = { level: 1, exp: 0, favs: [], playCounts: {}, reviews: {} };
        this.success(n);
    },
    login() {
        const n = document.getElementById('auth-user').value.trim();
        if(!app.allData[n]) return alert("帳號不存在");
        this.success(n);
    },
    guestMode() {
        app.currentUser = "訪客";
        ui.toggleAuthModal(false);
        ui.updateStatus();
        app.render();
    },
    success(n) {
        app.currentUser = n;
        localStorage.setItem('neon_last_user', n);
        app.save(app.user);
        ui.toggleAuthModal(false);
        ui.updateStatus();
        app.render();
    },
    logout() {
        localStorage.removeItem('neon_last_user');
        location.reload();
    }
};

window.onload = () => app.init();
