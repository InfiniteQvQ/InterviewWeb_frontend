import React from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const PersonalDashboard = () => {
    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate("/personalresume"); 
      };
    
      const handleNavigation2 = () => {
        navigate("/blog"); 
      };
      
    const username = JSON.parse(localStorage.getItem("username")) || "User";
  return (
    <div className="dashboard-container">
      <h1 className="welcome-text">欢迎回来, {username}</h1>

      <section className="important-tasks">
        <h2 className="dash-section-title">重要事项</h2>
        <div className="task-cards">
            <div className="task-card">
                <div className="task-header">
                    <h3>模拟面试</h3>
                    <img src="/interview.jpg" alt="icon" className="task-icon" />
                </div>
                <p>通过超过150+个模拟面试来为下一次面试做好准备</p>
                <button onClick={handleNavigation2} className="action-button">即刻启程</button>
            </div>

          <div className="task-card">
            <div className="task-header">
                <h3>简历精修</h3>
                <img src="/jobs.jpg" alt="icon" className="task-icon" />
            </div>
            <p>我们针对您的简历进行了评估，并且为您留下了建议来提升您的简历</p>
            <button onClick={handleNavigation} className="action-button">即刻提升</button>
         
          </div>
        </div>
      </section>

      <section className="my-jobs-dash">
        <div className="jobs-header">
          <h2 className="dash-section-title">我的工作</h2>
          <a href="/dashboard" className="work-preferences">
            ⚙ 工作偏好
          </a>
        </div>
        <hr className="section-divider" />
        <div className="dash-job-status">
          <p className="dash-highlight">您的简历正在被我们的团队审核当中</p>
          <p>审核时间可能要经历48个小时</p>
        </div>
        <div className="no-jobs">
          <p>您现在没有任何工作</p>
          <p>当公司对您感兴趣的时候，您会收到提醒</p>
        </div>
      </section>
    </div>
  );
};

export default PersonalDashboard;
