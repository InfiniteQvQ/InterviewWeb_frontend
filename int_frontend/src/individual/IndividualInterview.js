import React from "react";
import "./IndividualInterview.css";

const IndividualInterview = () => {


  return (
    <div className="interview-dashboard-container">
      <h1 className="interview-welcome-text">模拟面试</h1>

      <section className="interview-important-tasks">
        <h2 className="interview-section-title">面试列表</h2>
        <div className="interview-task-cards">
            <div className="interview-task-card">
                
                <div className="interview-card-logo-wrapper">
                    <div className="interview-card-logo">
                        <img src="/Fc.jpg" alt="McKinsey Logo" className="interview-logo-icon" />
                    </div>
                </div>
                
                <div className="interview-card-body">
                    <h3 className="interview-card-title">META软件工程</h3>
                    <p className="interview-card-description">
                        应届毕业E3: 技术面试#1
                    </p>
                </div>
                <div className="interview-card-footer">
                    <span className="interview-card-time">
                        <img src="/clock.png" alt="Time Icon" className="time-icon" />
                        20m
                    </span>
                    <span className="interview-card-difficulty">Medium</span>
                </div>
            </div>

            <div className="interview-task-card">
                
                <div className="interview-card-logo-wrapper">
                    <div className="interview-card-logo">
                        <img src="/Fc.jpg" alt="McKinsey Logo" className="interview-logo-icon" />
                    </div>
                </div>
                
                <div className="interview-card-body">
                    <h3 className="interview-card-title">SQL 和 数据库讨论</h3>
                    <p className="interview-card-description">
                        讨论SQL的索引以及优化
                    </p>
                </div>
                <div className="interview-card-footer">
                    <span className="interview-card-time">
                        <img src="/clock.png" alt="Time Icon" className="time-icon" />
                        20m
                    </span>
                    <span className="interview-card-difficulty">Medium</span>
                </div>
            </div>
        </div>
      </section>
      

      <section className="my-jobs-dash">
        <div className="jobs-header">
          <h2 className="dash-section-title">我的面试</h2>
          <a href="/dashboard" className="work-preferences">
            ⚙ 更多面试
          </a>
        </div>
        <hr className="section-divider" />
        <div className="no-jobs">
          <p>您现在没有任何模拟面试</p>
          <p>您可以在所有面试中添加新的面试</p>
        </div>
      </section>
    </div>
  );
};

export default IndividualInterview;
