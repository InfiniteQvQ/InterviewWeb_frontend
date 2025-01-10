import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import axios from 'axios';
import API_BASE_URL from "../config/apiConfig";

const Navbar = ({ isLoggedIn, username, handleLogout }) => {
  const navigate = useNavigate();

  const handleCandidatesClick = async (e) => {
    e.preventDefault(); // 阻止默认的导航行为

    if (!isLoggedIn) {
      // 如果用户未登录，直接导航到登录页面
      navigate('/login');
      return;
    }

    if (!username) {
      // 如果用户名不可用，显示错误消息
      alert('无法获取用户名，请重新登录。');
      return;
    }

    try {
      // 发送 POST 请求到后端，传递 username 检查是否有存储的简历数据
      const payload = {
        username: username
      };

      const response = await axios.post(`${API_BASE_URL}/resume/check`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        if (response.data.hasData) {
          navigate('/dashboard'); // 用户有数据，导航到新页面
        } else {
          navigate('/candidates'); // 用户没有数据，导航到默认页面
        }
      } else {
        // 处理后端返回的错误消息
        alert(response.data.message || "无法检查简历数据。");
        navigate('/candidates'); // 也可以选择导航到默认页面
      }
    } catch (error) {
      console.error('Error checking resume data:', error);
      // 如果请求失败，导航到默认页面或显示错误消息
      alert('无法验证简历数据，请稍后再试。');
      navigate('/candidates');
    }
  };


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
          {/* 使用 <a> 标签并绑定点击事件处理函数 */}
          <a href="/candidates" onClick={handleCandidatesClick} className="navbar-link">
            候选人
          </a>
        </li>
        <li>
          <Link to="/companies" className="navbar-link">公司</Link>
        </li>
        <li>
          <Link to="/global-talent-network" className="navbar-link">人才网络</Link>
        </li>
      </ul>

      <div className="navbar-auth">
        <div className="navbar-welcome">
          {isLoggedIn ? (
            <div>
              <span>欢迎, {username}</span>
              <button onClick={handleLogout} className="navbar-button">退出</button>
            </div>
          ) : (
            <Link to="/login" className="navbar-button">登录/注册</Link>
          )}
        </div>
      </div>
      <div className="navbar-underline"></div>
    </nav>
  );
};

export default Navbar;
