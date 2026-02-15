// Функция показа понятного сообщения об ошибке скина
function showSkinError(message) {
    const modal = document.getElementById('skinErrorModal') || createSkinErrorModal();
    const messageEl = modal.querySelector('.error-message');
    if (messageEl) {
        messageEl.innerHTML = message.replace(/\n/g, '<br>');
    }
    modal.style.display = 'flex';
}

// Создание модального окна ошибки скина
function createSkinErrorModal() {
    const modal = document.createElement('div');
    modal.id = 'skinErrorModal';
    modal.className = 'modal';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-content error-modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.style.display='none'">&times;</button>
            <h2 class="modal-title">Ошибка загрузки скина</h2>
            <p class="error-message"></p>
            <button class="security-btn" onclick="document.getElementById('skinErrorModal').style.display='none'">Понятно</button>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    return modal;
}

document.addEventListener("DOMContentLoaded", function() {

    const API_URL = "http://de1.the-ae.ovh:25697";
    const token = localStorage.getItem("token");
    const urlNick = new URLSearchParams(window.location.search).get("u");
    if (!token && !urlNick) {
        location.href = "login.html";
        return;
    }

    const usernameEl = document.getElementById("usernameDisplay");
    const createdAtEl = document.getElementById("createdAtDisplay");
    const logoutBtn = document.getElementById("logoutBtn");
    const profileNickTitle = document.getElementById("profileNickTitle");
    const lastSeenText = document.getElementById("lastSeenText");
    const passBadge = document.getElementById("passBadge");
    const aboutDisplay = document.getElementById("aboutDisplay");
    const aboutEditBtn = document.getElementById("aboutEditBtn");
    const aboutEditBlock = document.getElementById("aboutEditBlock");
    const aboutTextarea = document.getElementById("aboutTextarea");
    const aboutCount = document.getElementById("aboutCount");
    const aboutSaveBtn = document.getElementById("aboutSaveBtn");
    const aboutCancelBtn = document.getElementById("aboutCancelBtn");
    const subStatus = document.getElementById("subStatus");
    const buySubLink = document.getElementById("buySubLink");

    // ===== ЗАГРУЗКА ПРОФИЛЯ =====
    fetch(urlNick ? (API_URL + "/api/user/" + encodeURIComponent(urlNick)) : (API_URL + "/api/profile"), {
        headers: urlNick ? {} : { "Authorization": "Bearer " + token }
    })
    .then(function(res) {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
    })
    .then(function(data) {
        if (usernameEl) usernameEl.textContent = data.username;
        if (profileNickTitle) profileNickTitle.textContent = data.username || '—';

        // дата регистрации
        if (createdAtEl && data.createdAt) {
            const date = new Date(data.createdAt);
            createdAtEl.textContent = date.toLocaleString("ru-RU");
        }

        // баланс
        const balanceEl = document.getElementById('balanceDisplay');
        if (balanceEl && data.balance !== undefined) {
            balanceEl.textContent = data.balance.toLocaleString() + ' ар';
        }

        initSkin3D();
        if (data.username) loadSkin3DByNick(data.username);

        // ===== БАЛАНС В ШАПКЕ =====
        const headerBalanceEl = document.getElementById('headerBalance');
        if (headerBalanceEl && data.balance !== undefined) {
            headerBalanceEl.textContent = data.balance.toLocaleString() + ' ар';
        }

        // ===== СТАТУС ПРОХОДКИ =====
        if (passBadge) {
            passBadge.className = 'role-badge no-pass';
            passBadge.innerHTML = '<span class=\"dot\"></span>Нет проходки';
        }

        if (lastSeenText) {
            lastSeenText.textContent = 'Был на сервере СКОРО часа назад';
        }

        if (subStatus) subStatus.textContent = 'Не куплен';
        if (buySubLink) buySubLink.href = '#';
        try {
            localStorage.setItem('profileBio', (data.bio || '').trim());
        } catch (e) {}
        if (urlNick) {
            if (aboutEditBtn) aboutEditBtn.style.display = 'none';
            if (aboutEditBlock) aboutEditBlock.style.display = 'none';
        }
    })
    .catch(function() {
        if (!urlNick) {
            localStorage.removeItem("token");
            location.href = "login.html";
        }
    });

    // ===== 3D СКИН ПО НИКУ (Minotar / NameMC) =====
    let skinViewer3d = null;
    let skin3dFallbackImg = null;

    function initSkin3D() {
        const container = document.querySelector(".skin-container-3d");
        const canvas = document.getElementById("skinCanvas3d");
        if (!container || !canvas) return;
        if (typeof skinview3d !== "undefined") {
            try {
                skinViewer3d = new skinview3d.SkinViewer({
                    canvas: canvas,
                    width: 320,
                    height: 480
                });
                if (skinViewer3d.controls) {
                    skinViewer3d.controls.enableRotate = true;
                    skinViewer3d.controls.enablePan = false;
                    skinViewer3d.controls.enableZoom = true;
                }
            } catch (e) {
                console.warn("SkinViewer3D init:", e);
                use3DFallback(container, canvas);
            }
        } else {
            use3DFallback(container, canvas);
        }
    }

    function use3DFallback(container, canvas) {
        canvas.style.display = "none";
        skin3dFallbackImg = document.createElement("img");
        skin3dFallbackImg.alt = "3D скин";
        skin3dFallbackImg.style.maxWidth = "320px";
        skin3dFallbackImg.style.borderRadius = "8px";
        container.appendChild(skin3dFallbackImg);
    }

    function loadSkin3DByNick(nick) {
        const n = (nick || "").trim();
        if (!n) return;
        const skinUrl = "https://minotar.net/skin/" + encodeURIComponent(n);
        if (skinViewer3d) {
            skinViewer3d.loadSkin(skinUrl);
        }
        if (skin3dFallbackImg) {
            skin3dFallbackImg.src = "https://visage.surgeplay.com/full/256/" + encodeURIComponent(n);
        }
    }

    // ===== About block with pencil =====
    const bioKey = 'profileBio';
    function updateAboutDisplay() {
        const saved = localStorage.getItem(bioKey) || '';
        if (aboutDisplay) {
            aboutDisplay.textContent = saved ? saved : 'Нажмите на карандаш, чтобы добавить описание';
        }
        if (aboutTextarea && aboutCount) {
            aboutTextarea.value = saved;
            aboutCount.textContent = String((saved || '').length);
        }
    }
    updateAboutDisplay();
    if (aboutEditBtn && aboutEditBlock) {
        aboutEditBtn.addEventListener('click', function() {
            aboutEditBlock.style.display = 'block';
            aboutTextarea?.focus();
        });
    }
    if (aboutCancelBtn && aboutEditBlock) {
        aboutCancelBtn.addEventListener('click', function() {
            aboutEditBlock.style.display = 'none';
            updateAboutDisplay();
        });
    }
    if (aboutTextarea && aboutCount) {
        aboutTextarea.addEventListener('input', function() {
            const v = this.value.slice(0, 300);
            if (v !== this.value) this.value = v;
            aboutCount.textContent = String(v.length);
        });
    }
    if (aboutSaveBtn) {
        aboutSaveBtn.addEventListener('click', function() {
            const v = (aboutTextarea?.value || '').trim();
            fetch(API_URL + "/api/user/bio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + (localStorage.getItem("token") || "")
                },
                body: JSON.stringify({ bio: v })
            }).then(function(r) {
                if (r.ok) {
                    try { localStorage.setItem(bioKey, v); } catch (e) {}
                    updateAboutDisplay();
                    if (aboutEditBlock) aboutEditBlock.style.display = 'none';
                }
            });
        });
    }

    // ===== Stats grid (placeholder) =====
    const statsGrid = document.getElementById('statsGrid');
    function formatDate(d) {
        return d.toLocaleDateString('ru-RU');
    }
    function addCells(days) {
        const cells = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const hours = 0;
            const level = 0;
            const title = `${formatDate(d)} — ${hours} ч`;
            cells.push(`<div class="stat-cell ${level ? 'level-' + level : ''}" title="${title}"></div>`);
        }
        return cells.join('');
    }
    if (statsGrid) {
        statsGrid.innerHTML = addCells(140);
    }

    // ===== ВЫХОД =====
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.removeItem("token");
            location.href = "login.html";
        });
    }

});
