import React, { useState, useEffect } from 'react';
import './Header.css';

const API_URL = "http://de1.the-ae.ovh:25697";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      fetch(API_URL + '/api/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
      })
        .then(res => res.json())
        .then(data => {
          setBalance(data.balance || 0);
        })
        .catch(console.error);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  };

  return (
    <header className={`header-v2 ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header_container">
        <nav className="header_nav">
          <a href="index.html" className="logo-container">
            <img src="/img/favicon.svg" alt="Dexile Logo" className="logo" />
            <span className="logo-text">Dexile</span>
          </a>
          <ul className="header__list">
            <li><a className="header__list-link active" href="index.html">Главная</a></li>
            <li><a className="header__list-link" href="rules.html">Правила</a></li>
            <li><a className="header__list-link" href="the_passage.html">Проходка</a></li>
          </ul>
          <div className="header__buttons">
            {!isLoggedIn ? (
              <>
                <a href="login.html" className="btn btn-login">Войти</a>
                <a href="register.html" className="btn btn-play">Начать играть!</a>
              </>
            ) : (
              <a href="profile.html" className="btn btn-profile">
                <img src="/img/profile.png" alt="Profile" />
                <span>{balance.toLocaleString()} ар</span>
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
