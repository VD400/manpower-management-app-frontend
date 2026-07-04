import React from 'react';
import './navbar.css';
import { useState } from 'react';

const Navbar = ({ toggleSidebar }) => {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/employees';
  }
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle-btn" onClick={toggleSidebar}>
          ☰
        </button>
        Hello
      </div> 
      <div className="navbar-right">
        <div className="auth-profile-wrapper">
          <div className="user-profile">
            <div className="avatar">A</div>
            <span className="username">Admin Manager</span>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
        <span className="icon">🔔</span>
        <span className="notification-badge"></span> 
      </div>
    </header>
  )
}

export default Navbar
