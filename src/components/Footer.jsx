import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-v2">
      <div className="footer_container">
        <div className="footer_grid">
          <div className="footer_brand">
            <div className="footer_logo">
              <img src="/img/favicon.svg" alt="Dexile Logo" />
            </div>
            <div className="footer_brand_text">
              <div className="footer_brand_title">DEXILE</div>
              <div className="footer_brand_sub">Ванильный сервер</div>
              <p className="footer_brand_desc">
                Сервер, где каждый найдет себе людей по интересу и занятие по душе.
                Всё ограничено только вашим воображением.
              </p>
            </div>
          </div>

          <div className="footer_col">
            <div className="footer_title">Навигация</div>
            <a href="index.html">Главная</a>
            <a href="rules.html">Статистика</a>
            <a href="the_passage.html">Города</a>
            <a href="index.html#map">Карта мира</a>
          </div>

          <div className="footer_col">
            <div className="footer_title">Информация</div>
            <a href="index.html#wiki">Википедия</a>
            <a href="rules.html">Правила</a>
            <a href="index.html#commands">Команды</a>
            <a href="https://discord.com" target="_blank" rel="noreferrer">Discord</a>
          </div>

          <div className="footer_col">
            <div className="footer_title">Документы</div>
            <a href="index.html#privacy">Конфиденциальность</a>
            <a href="index.html#offer">Оферта</a>
            <a href="index.html#contacts">Контакты</a>
          </div>

          <div className="footer_col footer_dev">
            <div className="footer_title">Разработано</div>
            <div className="footer_dev_name">Morohaku</div>
          </div>
        </div>

        <div className="footer_bottom">
          <div className="footer_bottom_left">© 2025-2026 Dexile. Все права защищены.</div>
          <div className="footer_bottom_right">Not affiliated with Mojang Studios.</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
