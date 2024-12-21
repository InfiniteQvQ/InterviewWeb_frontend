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
              Edit filters
            </button>
          </div>
        </div>

        {/* 过滤器弹窗 */}
        {showFilters && (
          <div className="filter-modal">
            <div className="filter-modal-content">
              <div className="filter-header">
                <h2>Filter your candidates</h2>
                <button className="close-modal" onClick={toggleFilters}>
                  ✕
                </button>
              </div>
              <div className="filter-body">
                {/* 过滤器表单 */}
                <div className="filter-group">
                  <label>Skills or Keywords</label>
                  <input type="text" placeholder="Python, Kubernetes, Django" />
                </div>
                <div className="filter-group">
                  <label>Companies</label>
                  <input type="text" placeholder="Google, Amazon, Microsoft" />
                </div>
                <div className="filter-group">
                  <label>Job Titles</label>
                  <input type="text" placeholder="Software Engineer, Lawyer, Consultant" />
                </div>
                <div className="filter-group">
                  <label>Field of Study</label>
                  <input type="text" placeholder="Computer Science, Chemistry, Literature" />
                </div>
                <div className="filter-group">
                  <label>Degree Requirements</label>
                  <input type="text" placeholder="Bachelors, Masters, Doctorate" />
                </div>
                <div className="filter-group">
                  <label>Universities</label>
                  <input type="text" placeholder="Harvard, IIT, Top 50 program" />
                </div>
                <div className="filter-group">
                  <label>Availability</label>
                  <select>
                    <option>Full-time or Part-time</option>
                    <option>Full-time</option>
                    <option>Part-time</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Start date</label>
                  <input type="date" />
                </div>
                <div className="filter-group">
                  <label>Min Monthly Budget</label>
                  <input type="number" placeholder="0" />
                </div>
                <div className="filter-group">
                  <label>Max Monthly Budget</label>
                  <input type="number" placeholder="50000" />
                </div>
              </div>
              <div className="filter-footer">
                <button className="clear-filters">Clear filters</button>
                <button className="save-filters">Save filters</button>
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
