import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ isLoggedIn, username, handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/Mercor.jpg" alt="Interview Logo" className="navbar-logo-image"  style={{ width: '45px', height: '45px' }} />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/interviews">智能面试</Link>
        </li>
        <li>
          <Link to="/candidates">候选窗口</Link>
        </li>
        <li>
          <Link to="/companies">公司管理</Link>
        </li>
        <li>
          <Link to="/career-advisor">行业咨询</Link>
        </li>
        <li>
          <Link to="/global-talent-network">人才网络</Link>
        </li>
      </ul>
      <div className="navbar-auth">
        {isLoggedIn ? (
          <div>
            <span>欢迎, {username}</span>
            <button onClick={handleLogoutClick}>退出登录</button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="navbar-button">登陆/注册</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
