import React from 'react';
// import './Navbar.css';

export default function Navbar(): React.JSX.Element {
  return (
    <header className="navbar">
      <div className="navbar-logo">Логотип</div>
      <nav className="navbar-center">
        <a href="main" className="navbar-link">
          Главная
        </a>
        <a href="news" className="navbar-link">
          Новости
        </a>
        <a href="franchise" className="navbar-link">
          Франшиза
        </a>
        <a href="contacts" className="navbar-link">
          Контакты
        </a>
      </nav>
      <div className="navbar-right">
        <button className="navbar-button">Вход</button>
        <button className="navbar-button">Регистрация</button>
      </div>
    </header>
  );
}
