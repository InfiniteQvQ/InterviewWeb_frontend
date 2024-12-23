import React, { useState } from "react";
import "./SettingPage.css";

const SettingPage = () => {
  const [activeTab, setActiveTab] = useState("userPermissions");

  const renderContent = () => {
    switch (activeTab) {
      case "userPermissions":
        return (
          <div>
            <h2>用户权限</h2>
            <p>编辑您公司的用户角色权限</p>

            {/* Table */}
            <table className="user-table">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>邮箱</th>
                  <th>角色</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Jialiang Yuan</td>
                  <td>florentjialiang@gmail.com</td>
                  <td className="user-role">你 (所有者)</td>
                </tr>
              </tbody>
            </table>

            {/* Add User Button */}
            <button className="add-user-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="add-user-icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              添加用户
            </button>
          </div>
        );
      case "personalInformation":
        return (
          <div>
            <h2>个人信息</h2>
            <p>请输入您的姓名，联系信息，以及个人照片</p>

            {/* Avatar and Inputs */}
            <div className="avatar-section">
              <div className="avatar-placeholder">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="avatar-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 0c-2.485 0-4.5 2.015-4.5 4.5v1.5h9v-1.5c0-2.485-2.015-4.5-4.5-4.5z"
                  />
                </svg>
              </div>
              <button className="change-avatar-button">改变图标</button>
              <span className="avatar-info">JPG, GIF 或 PNG 支持1MB以内的文件</span>
            </div>

            <div className="input-fields">
              <div className="input-group">
                <label htmlFor="first-name">名字</label>
                <input id="first-name" type="text" defaultValue="Jialiang" />
              </div>
              <div className="input-group">
                <label htmlFor="last-name">姓氏</label>
                <input id="last-name" type="text" defaultValue="Yuan" />
              </div>
              <div className="input-group">
                <label htmlFor="phone">手机</label>
                <div className="phone-input">
                  <span className="country-flag">🇨🇳</span>
                  <input id="phone" type="text" defaultValue="+86" />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="email">邮件地址</label>
                <input
                  id="email"
                  type="email"
                  defaultValue="florentjialiang@gmail.com"
                />
              </div>
            </div>
          </div>
        );
      case "companyInformation":
        return (
            <div>
              <h2>公司信息</h2>
              <p>在这里编辑您的公司信息</p>
              <div className="company-info-fields">
                <div className="input-group">
                  <label htmlFor="company-name">公司名称</label>
                  <input
                    id="company-name"
                    type="text"
                    defaultValue="florentjialiang的公司"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="company-website">公司官网</label>
                  <input id="company-website" type="text" defaultValue="公司官网页面" />
                </div>
                <div className="input-group full-width">
                  <label htmlFor="scheduling-instructions">预约指示</label>
                  <textarea
                    id="scheduling-instructions"
                    defaultValue="以下任何时间您有空做一个面试吗？"
                  ></textarea>
                </div>
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      {/* Tabs */}
      <div className="settings-tabs">
        <button
          className={`tab ${activeTab === "userPermissions" ? "active" : ""}`}
          onClick={() => setActiveTab("userPermissions")}
        >
          用户权限
        </button>
        <button
          className={`tab ${activeTab === "personalInformation" ? "active" : ""}`}
          onClick={() => setActiveTab("personalInformation")}
        >
          个人信息
        </button>
        <button
          className={`tab ${activeTab === "companyInformation" ? "active" : ""}`}
          onClick={() => setActiveTab("companyInformation")}
        >
          公司信息
        </button>
      </div>

      {/* Content */}
      <div className="settings-content">{renderContent()}</div>
    </div>
  );
};

export default SettingPage;
