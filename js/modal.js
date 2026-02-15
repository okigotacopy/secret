
const modal = document.getElementById('purchaseModal');
const buyButton = document.getElementById('buyButton');
const closeButton = document.getElementById('closeModal');

function closeModal() {
    modal.classList.add('closing');
    setTimeout(() => {
        modal.classList.remove('active');
        modal.classList.remove('closing');
    }, 300);
}

buyButton.addEventListener('click', function(e) {
    e.preventDefault();
    modal.classList.add('active');
});

closeButton.addEventListener('click', function() {
    closeModal();
});

window.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

function selectPayment(method) {
    alert('Вы выбрали способ оплаты: ' + method);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});