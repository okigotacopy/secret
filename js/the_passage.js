// The passage page functionality for Dexile server
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('loginBtn');
    const playBtn = document.getElementById('playBtn');
    const profileBtn = document.getElementById('profileBtn');
    const headerBalance = document.getElementById('headerBalance');
    const buyButton = document.getElementById('buyButton');
    const paymentMethods = document.getElementById('paymentMethods');
    const bankLink = document.getElementById('bankLink');

    // Handle auth buttons
    if (token) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (playBtn) playBtn.style.display = 'none';
        if (profileBtn) profileBtn.style.display = 'flex';
        if (bankLink) bankLink.style.display = 'block';

        // Fetch user balance
        fetch('http://de1.the-ae.ovh:25697/api/profile', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(res => res.json())
        .then(data => {
            if (headerBalance) {
                headerBalance.textContent = (data.balance || 0).toLocaleString() + ' ар';
            }
        })
        .catch(console.error);
    } else {
        if (loginBtn) loginBtn.style.display = 'flex';
        if (playBtn) playBtn.style.display = 'flex';
        if (profileBtn) profileBtn.style.display = 'none';
        if (bankLink) bankLink.style.display = 'none';
    }

    // Handle buy button
    if (buyButton && paymentMethods) {
        buyButton.addEventListener('click', function() {
            paymentMethods.style.display = 'grid';
            buyButton.innerHTML = 'Выберите способ оплаты';
            buyButton.style.background = 'var(--dark)';
        });
    }
});

// Payment selection function
function selectPayment(method) {
    const methodNames = {
        'yoomoney': 'ЮMoney',
        'spb': 'СПБ',
        'sberbank': 'Сбербанк',
        'tinkoff': 'Тинькофф'
    };
    
    alert('Вы выбрали: ' + methodNames[method] + '\n\nВ данный момент оплата недоступна. Свяжитесь с администрацией для покупки проходки.');
    
    // Reset button
    const buyButton = document.getElementById('buyButton');
    const paymentMethods = document.getElementById('paymentMethods');
    if (buyButton && paymentMethods) {
        paymentMethods.style.display = 'none';
        buyButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>Купить проходку';
        buyButton.style.background = 'var(--orange)';
    }
}
