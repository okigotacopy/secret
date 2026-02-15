import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

const API_URL = "http://de1.the-ae.ovh:25697";

const features = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF7143" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Ванильный геймплей',
    desc: 'Чистый Minecraft без лишних модов и плагинов. Только классика, которая затягивает надолго.'
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF7143" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Дружелюбное сообщество',
    desc: 'Активные игроки, отзывчивая администрация и никакого токсичного поведения.'
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF7143" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Голосовой чат',
    desc: 'PlasmoVoice позволит общаться с другими игроками в реальном времени прямо в игре.'
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF7143" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    title: 'Эмоции Emotecraft',
    desc: 'Более 50 крутых эмоций и анимаций для самовыражения в игровом мире.'
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF7143" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Строительство городов',
    desc: 'Создавай свои постройки, объединяйся с другими и стройте величественные города вместе.'
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF7143" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Ролевые истории',
    desc: 'Погружайся в уникальные сюжетные линии и создавай свою историю на сервере.'
  }
];

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [online, setOnline] = useState(0);
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const featuresRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Fetch online count
    fetch(API_URL + '/api/online')
      .then(res => res.json())
      .then(data => {
        if (data.online !== undefined) {
          setOnline(data.online);
        }
      })
      .catch(() => setOnline(0));

    // Interval update
    const interval = setInterval(() => {
      fetch(API_URL + '/api/online')
        .then(res => res.json())
        .then(data => {
          if (data.online !== undefined) {
            setOnline(data.online);
          }
        });
    }, 30000);

    // Intersection Observer for features animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const indexAttr = entry.target.dataset.index;
            if (indexAttr !== undefined) {
              const index = parseInt(indexAttr);
              setVisibleFeatures(prev => [...new Set([...prev, index])]);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll, .feature-card').forEach(el => {
      observer.observe(el);
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-v2">
        <div className="hero_container">
          <div className="hero_content">
            <h1>
              Ванильный Minecraft <span className="gradient-text">с душой</span>
            </h1>
            <p>
              Добро пожаловать на Dexile — сервер, где ролевая игра встречается с 
              классическим выживанием. Чистый геймплей без лишних модов, дружелюбное 
              сообщество и атмосфера, в которую хочется возвращаться снова и снова.
            </p>
            <div className="hero_buttons">
              <a href="register.html" className="btn-play-big">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Начать играть
              </a>
              <a href="#features" className="btn-features">
                Узнать больше
              </a>
            </div>
          </div>
          <div className="hero_image">
            <div className="floating-character">
              <img src="/img/man.png" alt="Minecraft Player" />
            </div>
            <div className="hero-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Листай вниз</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-v2">
        <div className="stats_container">
          <div className="stat-card animate-on-scroll">
            <div className="stat_number">{online}</div>
            <div className="stat_label">Онлайн</div>
          </div>
          <div className="stat-card animate-on-scroll">
            <div className="stat_number">24/7</div>
            <div className="stat_label">Аптайм</div>
          </div>
          <div className="stat-card animate-on-scroll">
            <div className="stat_number">100+</div>
            <div className="stat_label">Игроков</div>
          </div>
          <div className="stat-card animate-on-scroll">
            <div className="stat_number">2024</div>
            <div className="stat_label">Запуск</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-v2" id="features" ref={featuresRef}>
        <div className="features_container">
          <div className="features_header animate-on-scroll">
            <h2>Почему именно Dexile?</h2>
            <p>Мы создали идеальное пространство для любителей чистого Minecraft</p>
          </div>
          <div className="features_grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card ${visibleFeatures.includes(index) ? 'visible' : ''}`}
                data-index={index}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="feature_icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-v2">
        <div className="cta_container">
          <div className="cta_content animate-on-scroll">
            <h2>Готов начать приключение?</h2>
            <p>Присоединяйся к нашему сообществу прямо сейчас и стань частью чего-то большого!</p>
            <a href="register.html" className="btn-play-big">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Регистрация
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
