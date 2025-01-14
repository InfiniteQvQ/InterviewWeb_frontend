import React from "react";
import { NavLink } from "react-router-dom";
import "./GlobalNavbar.css";

const GlobalNavbar = () => {
  return (
    <nav className="global-navbar">
      {/* 顶部 Logo */}
      <div className="global-navbar-section">
        <NavLink to="/" className="global-navbar-logo">
          <img
            src="/Fc.jpg"
            alt="Logo"
            className="global-navbar-logo-image"
          />
        </NavLink>

        <hr className="logo-separator" />
      </div>

      {/* 导航链接 */}
      <div className="global-navbar-section">
        <h3 className="global-navbar-section-title">Menu</h3>
        <ul className="global-navbar-links">
          <li className="global-navbar-link">
            <NavLink
              to="/global-talent-network"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <img src="/home.png" alt="Home" className="global-navbar-icon" />
              <span>主页</span>
            </NavLink>
          </li>
          
          <li className="global-navbar-link">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <img src="/fire.png" alt="Popular" className="global-navbar-icon" />
              <span>热门</span>
            </NavLink>
          </li>
          <li className="global-navbar-link">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <img src="/loupe.png" alt="Explore" className="global-navbar-icon" />
              <span>探索</span>
            </NavLink>
          </li>
          <li className="global-navbar-link">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <img src="/user-interface.png" alt="All" className="global-navbar-icon" />
              <span>全部</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* 最近访问 */}
      <div className="global-navbar-section">
        <h3 className="global-navbar-section-title">最近观看</h3>
        <ul className="global-navbar-links">
          <li className="global-navbar-link">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <img
                src="/recent.png"
                alt="AbstractArt"
                className="global-navbar-icon"
              />
              <span>r/AbstractArt</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* 社区 */}
      <div className="global-navbar-section">
        <h3 className="global-navbar-section-title">社区</h3>
        <ul className="global-navbar-links">
          <li className="global-navbar-link">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <img
                src="/plus.png"
                alt="Create Community"
                className="global-navbar-icon"
              />
              <span>创建社区</span>
            </NavLink>
          </li>
          <li className="global-navbar-link">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <img
                src="/value.png"
                alt="AskReddit"
                className="global-navbar-icon"
              />
              <span>r/AskReddit</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default GlobalNavbar;
