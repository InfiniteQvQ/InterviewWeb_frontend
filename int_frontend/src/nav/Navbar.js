import React from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ isLoggedIn, username, handleLogout }) => {
  return (
    <nav className="navbar">
    
      <div className="navbar-logo">
        <Link to="/">
          <img
            src="/Fc.jpg" 
            alt="Logo"
            className="navbar-logo-image"
            style={{ width: '45px', height: '45px' }}
          />
        </Link>
      </div>

      
      <ul className="navbar-links">
        <li>
          <Link to="/Interview">智能面试</Link>
        </li>
        <li>
          <Link to="/candidates">候选人</Link>
        </li>
        <li>
          <Link to="/companies">公司</Link>
        </li>
        <li>
          <Link to="/global-talent-network">人才网络</Link>
        </li>
      </ul>

   
      <div className="navbar-auth">
        {isLoggedIn ? (
          <div>
            <span>欢迎, {username}</span>
            <button onClick={handleLogout} className="navbar-button">退出</button>
          </div>
        ) : (
          <Link to="/login" className="navbar-button">登录/注册</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
