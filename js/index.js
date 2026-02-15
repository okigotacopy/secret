// Main page functionality for Dexile server
const API_URL = "http://de1.the-ae.ovh:25697";

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('loginBtn');
    const playBtn = document.getElementById('playBtn');
    const profileBtn = document.getElementById('profileBtn');
    const heroPlayBtn = document.getElementById('heroPlayBtn');
    const headerBalance = document.getElementById('headerBalance');

    if (token) {
        // Пользователь авторизован
        if (loginBtn) loginBtn.style.display = 'none';
        if (playBtn) playBtn.style.display = 'none';
        if (profileBtn) profileBtn.style.display = 'flex';
        
        if (heroPlayBtn) {
            heroPlayBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> Мой профиль';
            heroPlayBtn.href = 'profile.html';
        }

        // Загружаем баланс
        fetch(API_URL + '/api/profile', {
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
        // Пользователь не авторизован
        if (loginBtn) loginBtn.style.display = 'flex';
        if (playBtn) playBtn.style.display = 'flex';
        if (profileBtn) profileBtn.style.display = 'none';
    }

    // Smooth scroll для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat_card, .feature_card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Добавляем класс visible для анимированных элементов
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
