import React, { useState } from "react";
import "./CompanySearch.css";
import CandidateList from "./CandidateList";
const CompanySearch = () => {
  const [showFilters, setShowFilters] = useState(false); // 控制过滤器弹窗的显示

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="company-page">
      <div className="company-content">
        {/* 搜索栏和过滤器按钮 */}
        <div className="search-header">
          <div className="search-header-top">
            <img
              src="/SearchPerson.jpg" 
              alt="Logo"
              className="search-logo"
            />
            <input
              type="text"
              placeholder="Try searching 'Python developer with 4 years experience'"
              className="search-input"
            />
          </div>
          <div className="search-header-bottom">
            <span className="filter-label">Can work:</span>
            <button className="filter-button">Full-time or Part-time</button>
            <button className="edit-filters" onClick={toggleFilters}>
              编辑过滤内容
            </button>
          </div>
        </div>

        {/* 过滤器弹窗 */}
        {showFilters && (
          <div className="filter-modal">
            <div className="filter-modal-content">
              <div className="filter-header">
                <h2>过滤候选人</h2>
                <button className="close-modal" onClick={toggleFilters}>
                  ✕
                </button>
              </div>
              <div className="filter-body">
                {/* 过滤器表单 */}
                <div className="filter-group">
                  <label>能力关键字</label>
                  <input type="text" placeholder="Python, Kubernetes, Django" />
                </div>
                <div className="filter-group">
                  <label>公司</label>
                  <input type="text" placeholder="Google, Amazon, Microsoft" />
                </div>
                <div className="filter-group">
                  <label>工作岗位</label>
                  <input type="text" placeholder="Software Engineer, Lawyer, Consultant" />
                </div>
                <div className="filter-group">
                  <label>从业领域</label>
                  <input type="text" placeholder="Computer Science, Chemistry, Literature" />
                </div>
                <div className="filter-group">
                  <label>学位要求</label>
                  <input type="text" placeholder="Bachelors, Masters, Doctorate" />
                </div>
                <div className="filter-group">
                  <label>大学要求</label>
                  <input type="text" placeholder="Harvard, IIT, Top 50 program" />
                </div>
                <div className="filter-group">
                  <label>工作性质</label>
                  <select>
                    <option>Full-time or Part-time</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>开始时间</label>
                  <input type="date" />
                </div>
                <div className="filter-group">
                  <label>最低月薪</label>
                  <input type="number" placeholder="0" />
                </div>
                <div className="filter-group">
                  <label>最高月薪</label>
                  <input type="number" placeholder="50000" />
                </div>
              </div>
              <div className="filter-footer">
                <button className="clear-filters">清空</button>
                <button className="save-filters">保存</button>
              </div>
            </div>
          </div>
        )}
        <CandidateList />
      </div>
    </div>
  );
};

export default CompanySearch;
