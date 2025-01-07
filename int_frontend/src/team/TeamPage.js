import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TeamPage.css";

const CompanyTeam = () => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const handleHireClick = () => {
    navigate("/search"); 
  };
  // 点击页面其他地方时关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = () => closeDropdown();
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDropdownClick = (e) => {
    e.stopPropagation(); // 阻止事件冒泡，避免关闭菜单
  };

  return (
    <div className="team-page">
      {/* 搜索框 */}
      <div className="search-container">
        <div className="search-content">
          <label className="search-label">在您的团队中搜索</label>
          <input
            type="text"
            placeholder="通过姓名或邮箱搜索"
            className="team-search-input"
          />
        </div>

        <button className="team-search-button">
          <svg
            xmlns="https://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          搜索
        </button>
      </div>

      {/* 筛选按钮 */}
      <div className="team-filters">
        {/* Project 下拉菜单 */}
        <div className="dropdown" onClick={handleDropdownClick}>
          <button
            className="dropdown-button"
            onClick={() => toggleDropdown("project")}
          >
            <span role="img" aria-label="project-icon"></span> Project
            <svg xmlns="https://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dropdown-icon">
                <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {activeDropdown === "project" && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <span>软件开发计划</span>
              </div>
              <div className="dropdown-item">
                <button className="create-project-button">创建新项目 +</button>
              </div>
            </div>
          )}
        </div>
        
        
        {/* Status 下拉菜单 */}
        <div className="dropdown" onClick={handleDropdownClick}>
          <button
            className="dropdown-button"
            onClick={() => toggleDropdown("status")}
          >
            Status
            <svg xmlns="https://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dropdown-icon">
                <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {activeDropdown === "status" && (
            <div className="dropdown-menu">
              <div className="dropdown-item">Active</div>
              <div className="dropdown-item">Inactive</div>
            </div>
          )}
        </div>

        {/* Tags 下拉菜单 */}
        <div className="dropdown" onClick={handleDropdownClick}>
          <button
            className="dropdown-button"
            onClick={() => toggleDropdown("tags")}
          >
            Tags

            <svg xmlns="https://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dropdown-icon">
                <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {activeDropdown === "tags" && (
            <div className="dropdown-menu">
              <div className="dropdown-item">前端工程师</div>
              <div className="dropdown-item">后端工程师</div>
              <div className="dropdown-item">设计师</div>
            </div>
          )}
        </div>
      </div>
        
      <div className="team-filters-line"></div>

      {/* 内容占位 */}
      <div className="team-content">
        <div className="team-placeholder">  
          <p>您的团队在这个项目当中还没有成员</p>
          <span>使用搜索页面招募您的团队成员</span>
          <button className="hire-team-button" onClick={handleHireClick}>招募您的成员 +</button>
        </div>
      </div>
    </div>
  );
};

export default CompanyTeam;
