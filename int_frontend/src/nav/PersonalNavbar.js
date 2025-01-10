import React from "react";
import { Link } from "react-router-dom";
import './PersonalNavbar.css';

const PersonalNavbar = () => {
  return (
    <nav className="personal-navbar">
      <div className="personal-navbar-logo">
         <Link to="/">
            <img
                src="/Fc.jpg" 
                alt="Logo"
                className="navbar-logo-image"
                style={{ width: '45px', height: '45px' }}
            />
        </Link>
      </div>
      <ul className="personal-navbar-links">
        <li>
          <Link to="/dashboard">
            <img src="/home.jpg" alt="Home" className="navbar-icon" />
            <span>主页</span>
          </Link>
        </li>
        <li>
          <Link to="/personalprofile">
            <img src="/profile.jpg" alt="About" className="navbar-icon" />
            <span>个人信息</span>
          </Link>
        </li>
        <li>
          <Link to="/personalresume">
            <img src="/Jobs.jpg" alt="Projects" className="navbar-icon" />
            <span>简历</span>
          </Link>
        </li>
        <li>
          <Link to="/blog">
            <img src="/interview.jpg" alt="Blog" className="navbar-icon" />
            <span>面试</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default PersonalNavbar;
