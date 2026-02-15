// Bank functionality for Dexile server
const API_URL = "http://de1.the-ae.ovh:25697";

const STORAGE_ACCOUNT_NAME = "bankAccountName";

let allTransactions = [];

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    bindModals();
    bindHistorySearch();
    loadCardState();
});

async function loadCardState() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_URL + '/api/bank/card', {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!response.ok) {
            showOpenCardBlock();
            return;
        }

        const data = await response.json();

        if (data.hasCard && data.cardNumber) {
            showCardBlock(data.cardNumber);
            const nameEl = document.getElementById('cardAccountName');
            if (nameEl) nameEl.textContent = localStorage.getItem(STORAGE_ACCOUNT_NAME) || 'Мой счёт';
            await loadBalance();
            await loadHistory();
        } else {
            showOpenCardBlock();
        }
    } catch (error) {
        console.error('Ошибка загрузки карты:', error);
        showOpenCardBlock();
    }
}

function showOpenCardBlock() {
    const openBlock = document.getElementById('bankOpenCardBlock');
    const cardBlock = document.getElementById('bankCardBlock');
    const emptyBlock = document.getElementById('bankEmpty');
    const layout = document.querySelector('.bank-layout');
    if (emptyBlock) emptyBlock.classList.remove('hidden');
    if (layout) layout.style.display = 'none';
    if (openBlock) openBlock.classList.add('hidden');
    if (cardBlock) cardBlock.classList.add('hidden');
}

function showCardBlock(cardNumber) {
    const openBlock = document.getElementById('bankOpenCardBlock');
    const cardBlock = document.getElementById('bankCardBlock');
    const emptyBlock = document.getElementById('bankEmpty');
    const layout = document.querySelector('.bank-layout');
    if (emptyBlock) emptyBlock.classList.add('hidden');
    if (layout) layout.style.display = '';
    if (openBlock) openBlock.classList.add('hidden');
    if (cardBlock) cardBlock.classList.remove('hidden');
    const cardNumberEl = document.getElementById('cardNumber');
    if (cardNumberEl) cardNumberEl.textContent = cardNumber;
}

async function loadBalance() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_URL + '/api/bank/balance', {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.ok) {
            const data = await response.json();
            const balanceElement = document.getElementById('balanceAmount');
            if (balanceElement) {
                balanceElement.textContent = (data.balance != null ? data.balance : 0).toLocaleString();
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки баланса:', error);
    }
}

async function loadHistory() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(API_URL + '/api/bank/transactions', {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (response.ok) {
            const transactions = await response.json();
            allTransactions = Array.isArray(transactions) ? transactions : [];
            renderHistory(allTransactions);
        } else {
            allTransactions = [];
            renderHistory([]);
        }
    } catch (error) {
        console.error('Ошибка загрузки истории:', error);
        allTransactions = [];
        renderHistory([]);
    }
}

function filterHistoryBySearch(transactions, query) {
    if (!query || !query.trim()) return transactions;
    const q = query.trim().toLowerCase();
    return transactions.filter(tx => {
        const typeLabel = (getTransactionLabel(tx.type) || '').toLowerCase();
        const target = (tx.targetNick || '').toLowerCase();
        const dateStr = new Date(tx.timestamp).toLocaleString('ru-RU').toLowerCase();
        const amountStr = String(tx.amount || '').toLowerCase();
        return typeLabel.includes(q) || target.includes(q) || dateStr.includes(q) || amountStr.includes(q);
    });
}

function escapeAttr(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function bindHistorySearch() {
    const searchInput = document.getElementById('historySearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const filtered = filterHistoryBySearch(allTransactions, this.value);
            renderHistory(filtered);
        });
    }
}

function renderHistory(transactions) {
    const historyList = document.getElementById('historyList');

    if (!historyList) return;

    if (!transactions || transactions.length === 0) {
        historyList.innerHTML = '<div class="history-empty">История транзакций пуста</div>';
        return;
    }

    historyList.innerHTML = transactions.map(tx => `
        <div class="history-item ${tx.type}">
            <div class="history-icon">
                ${tx.type === 'deposit' ? '⬇️' : tx.type === 'withdraw' ? '⬆️' : tx.type === 'transfer_out' ? '📤' : '📥'}
            </div>
            <div class="history-info">
                <div class="history-type">${getTransactionLabel(tx.type)}</div>
                <div class="history-date">${new Date(tx.timestamp).toLocaleString('ru-RU')}</div>
                ${tx.targetNick ? `<div class="history-target">${tx.type === 'transfer_out' ? 'Кому:' : 'От:'} ${tx.targetNick}</div>` : ''}
                ${tx.comment ? `<button class="history-comment-btn" data-comment="${escapeAttr(tx.comment)}">Комментарий</button>` : ''}
            </div>
            <div class="history-amount ${tx.type === 'withdraw' || tx.type === 'transfer_out' ? 'negative' : 'positive'}">
                ${tx.type === 'withdraw' || tx.type === 'transfer_out' ? '-' : '+'}${(tx.amount || 0).toLocaleString()} ар
            </div>
        </div>
    `).join('');
}

function getTransactionLabel(type) {
    const labels = {
        'deposit': 'Пополнение',
        'withdraw': 'Вывод',
        'transfer_in': 'Перевод получен',
        'transfer_out': 'Перевод отправлен'
    };
    return labels[type] || type;
}

function bindModals() {
    const transferBtn = document.getElementById('transferBtn');
    const transferModal = document.getElementById('transferModal');
    const transferCancelBtn = document.getElementById('transferCancelBtn');
    const transferSubmitBtn = document.getElementById('transferSubmitBtn');
    const transferNickInput = document.getElementById('transferNick');
    const transferCommentInput = document.getElementById('transferComment');
    const commentModal = document.getElementById('commentModal');
    const commentCloseBtn = document.getElementById('commentCloseBtn');
    const historyListEl = document.getElementById('historyList');

    if (transferBtn) transferBtn.addEventListener('click', () => openModal('transferModal'));
    if (transferCancelBtn) transferCancelBtn.addEventListener('click', () => closeModal('transferModal'));
    if (transferModal) transferModal.addEventListener('click', (e) => { if (e.target === transferModal) closeModal('transferModal'); });
    if (commentModal) commentModal.addEventListener('click', (e) => { if (e.target === commentModal) closeModal('commentModal'); });
    if (commentCloseBtn) commentCloseBtn.addEventListener('click', () => closeModal('commentModal'));
    if (historyListEl) {
        historyListEl.addEventListener('click', function(e) {
            const btn = e.target.closest('.history-comment-btn');
            if (!btn) return;
            const text = btn.dataset.comment || '';
            const contentEl = document.getElementById('commentContent');
            if (contentEl) contentEl.textContent = text;
            openModal('commentModal');
        });
    }

    // Populate sender info when opening modal
    if (transferBtn) transferBtn.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            const [cardRes, profileRes, balanceRes] = await Promise.all([
                fetch(API_URL + '/api/bank/card', { headers: { 'Authorization': 'Bearer ' + token } }),
                fetch(API_URL + '/api/profile', { headers: { 'Authorization': 'Bearer ' + token } }),
                fetch(API_URL + '/api/bank/balance', { headers: { 'Authorization': 'Bearer ' + token } }),
            ]);
            if (cardRes.ok) {
                const cardData = await cardRes.json();
                document.getElementById('senderCardNumber').textContent = cardData.cardNumber || '—';
                document.getElementById('senderCardSub').textContent = (cardData.cardNumber ? cardData.cardNumber : '—') + ' — Счёт';
            }
            if (profileRes.ok) {
                const profile = await profileRes.json();
                document.getElementById('senderNick').textContent = profile.username || '—';
                const avatarEl = document.querySelector('.sender-avatar');
                if (avatarEl && profile.skinUrl) avatarEl.src = profile.skinUrl;
            }
            if (balanceRes.ok) {
                const bal = await balanceRes.json();
                document.getElementById('senderBalance').textContent = (bal.balance || 0).toLocaleString();
            }
        } catch (e) {
            console.error('Ошибка получения данных отправителя:', e);
        }
    });

    // Live lookup receiver card
    if (transferNickInput) {
        let lookupTimer = null;
        transferNickInput.addEventListener('input', function() {
            const nick = this.value.trim();
            clearTimeout(lookupTimer);
            lookupTimer = setTimeout(() => lookupReceiver(nick), 300);
        });
    }

    function renderReceiverPreview(state) {
        const cont = document.getElementById('receiverCardPreview');
        if (!cont) return;
        if (!state || !state.exists) {
            cont.innerHTML = '<div class="receiver-empty">Пользователь не найден</div>';
            return;
        }
        if (!state.hasCard) {
            cont.innerHTML = '<div class="receiver-empty">У этого человека нет карты</div>';
            return;
        }
        cont.innerHTML = `
            <div class="card-brand">Д-Банк</div>
            <div class="card-number">${state.cardNumber}</div>
            <div class="card-type">Счёт</div>
            <div class="card-balance">${(state.balance || 0).toLocaleString()} <span class="currency">АР</span></div>
        `;
    }

    async function lookupReceiver(nick) {
        const cont = document.getElementById('receiverCardPreview');
        if (!cont) return;
        if (!nick) {
            cont.innerHTML = '<div class="receiver-empty">Карта не выбрана</div>';
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(API_URL + '/api/bank/user-card?nick=' + encodeURIComponent(nick), {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (!res.ok) {
                renderReceiverPreview({ exists: false });
                return;
            }
            const data = await res.json();
            renderReceiverPreview(data);
        } catch (e) {
            console.error('Ошибка проверки карты получателя:', e);
            renderReceiverPreview({ exists: false });
        }
    }

    // Comment counter
    if (transferCommentInput) {
        const countEl = document.getElementById('commentCount');
        transferCommentInput.addEventListener('input', function() {
            if (countEl) countEl.textContent = String(this.value.length);
        });
    }

    if (transferSubmitBtn) {
        transferSubmitBtn.addEventListener('click', async function() {
            const targetNick = document.getElementById('transferNick').value.trim();
            const amount = parseInt(document.getElementById('transferAmount').value, 10);
            const comment = (document.getElementById('transferComment')?.value || '').trim();

            if (!targetNick) {
                alert('Введите ник игрока');
                return;
            }
            if (!amount || amount < 1) {
                alert('Введите корректную сумму');
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(API_URL + '/api/bank/transfer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ nick: targetNick, amount, comment })
                });

                const data = await response.json();

                if (response.ok) {
                    document.getElementById('transferNick').value = '';
                    document.getElementById('transferAmount').value = '';
                    if (document.getElementById('transferComment')) document.getElementById('transferComment').value = '';
                    lookupReceiver('');
                    closeModal('transferModal');
                    loadBalance();
                    loadHistory();
                    alert('Перевод успешен!');
                } else {
                    alert(data.message || 'Ошибка при переводе');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка');
            }
        });
    }

    const editNameBtn = document.getElementById('editNameBtn');
    const editNameModal = document.getElementById('editNameModal');
    const editNameCancelBtn = document.getElementById('editNameCancelBtn');
    const editNameSubmitBtn = document.getElementById('editNameSubmitBtn');
    const accountNameInput = document.getElementById('accountNameInput');

    if (editNameBtn) {
        editNameBtn.addEventListener('click', function() {
            if (accountNameInput) accountNameInput.value = localStorage.getItem(STORAGE_ACCOUNT_NAME) || 'Мой счёт';
            openModal('editNameModal');
        });
    }
    if (editNameCancelBtn) editNameCancelBtn.addEventListener('click', () => closeModal('editNameModal'));
    if (editNameModal) editNameModal.addEventListener('click', (e) => { if (e.target === editNameModal) closeModal('editNameModal'); });

    if (editNameSubmitBtn) {
        editNameSubmitBtn.addEventListener('click', function() {
            const name = (accountNameInput && accountNameInput.value.trim()) || 'Мой счёт';
            localStorage.setItem(STORAGE_ACCOUNT_NAME, name);
            const cardNameEl = document.getElementById('cardAccountName');
            if (cardNameEl) cardNameEl.textContent = name;
            closeModal('editNameModal');
        });
    }

    const finesBtn = document.getElementById('finesBtn');
    const finesModal = document.getElementById('finesModal');
    const finesCloseBtn = document.getElementById('finesCloseBtn');

    if (finesBtn) finesBtn.addEventListener('click', () => openModal('finesModal'));
    if (finesCloseBtn) finesCloseBtn.addEventListener('click', () => closeModal('finesModal'));
    if (finesModal) finesModal.addEventListener('click', (e) => { if (e.target === finesModal) closeModal('finesModal'); });
}

function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
}
