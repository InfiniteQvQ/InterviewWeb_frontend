import React, { useState } from "react";
import "./CompanySearch.css";
import CandidateList from "./CandidateList";
import axios from "axios";
import API_BASE_URL from '../config/apiConfig';

const CompanySearch = () => {
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false); 
  const [loading2, setLoading2] = useState(false);
  const [filters, setFilters] = useState({
    skills: "",
    company: "",
    position: "",
    field: "",
    degree: "",
    university: "",
    workType: "",
    startDate: "",
    minSalary: "",
    maxSalary: "",
  });
  const [filteredCandidates, setFilteredCandidates] = useState([]); 

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      skills: "",
      company: "",
      position: "",
      field: "",
      degree: "",
      university: "",
      workType: "",
      startDate: "",
      minSalary: "",
      maxSalary: "",
    });
    setFilteredCandidates([]);
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      alert("请输入搜索内容！");
      return;
    }

    setLoading2(true); 
    try {
      const response = await axios.post(`${API_BASE_URL}/search/searchai?includeDescription=true`, { query: searchInput });
      setFilteredCandidates(response.data);
    } catch (error) {
      console.error("Error during search:", error);
      alert("搜索过程中出现错误，请稍后重试！");
    } finally {
      setLoading2(false); 
    }
  };
  const handleInputChangeSearch = (e) => {
    setSearchInput(e.target.value);
  };

  
  const applyFilters = async () => {
    setLoading2(true);
    try {
      const filtersToSend = {
        skills: filters.skills || null,
        company: filters.company || null,
        position: filters.position || null,
        field: filters.field || null,
        degree: filters.degree || null,
        university: filters.university || null,
        workType: filters.workType || "不限",
        startDate: filters.startDate || null,
        minSalary: filters.minSalary ? parseInt(filters.minSalary, 10) : 0,
        maxSalary: filters.maxSalary ? parseInt(filters.maxSalary, 10) : 2147483647,
      };
      console.log("Filters being sent:", filtersToSend);
      const response = await axios.post(`${API_BASE_URL}/search/filter`, filtersToSend);
      setFilteredCandidates(response.data);
    } catch (error) {
      console.error("Error fetching filtered candidates:", error);
    } finally {
      setLoading2(false);
      setShowFilters(false); 
    }
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
              placeholder="Try searching '会python的本科生'"
              className="search-input"
              value={searchInput}
              onChange={handleInputChangeSearch}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
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
                  <input name="skills" type="text" value={filters.skills} onChange={handleInputChange} placeholder="Python, Kubernetes, Django" />
                </div>
                <div className="filter-group">
                  <label>公司</label>
                  <input name="company" type="text" value={filters.company} onChange={handleInputChange} placeholder="Google, Amazon, Microsoft" />
                </div>
                <div className="filter-group">
                  <label>工作岗位</label>
                  <input name="position" type="text" value={filters.position} onChange={handleInputChange} placeholder="Software Engineer, Lawyer, Consultant" />
                </div>
                <div className="filter-group">
                  <label>从业领域</label>
                  <input name="field" type="text" onChange={handleInputChange} value={filters.field} placeholder="Computer Science, Chemistry, Literature" />
                </div>
                <div className="filter-group">
                  <label>学位要求</label>
                  <select name="degree" value={filters.degree} onChange={handleInputChange}>
                    <option value="">不限</option>
                    <option value="学士">学士 (Bachelors)</option>
                    <option value="硕士">硕士 (Masters)</option>
                    <option value="博士">博士 (Doctorate)</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>大学要求</label>
                  <input name="university" type="text" value={filters.university} onChange={handleInputChange} placeholder="Harvard, IIT, Top 50 program" />
                </div>
                <div className="filter-group">
                  <label>工作性质</label>
                  <select name="workType" value={filters.workType} onChange={handleInputChange}>
                    <option>不限</option>
                    <option>Full-time or Part-time</option>
                    <option>Part-time Only</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>开始时间</label>
                  <input type="date" name="startDate" value={filters.startDate} onChange={handleInputChange}/>
                </div>
                <div className="filter-group">
                  <label>最低月薪</label>
                  <input type="number" placeholder="0" name="minSalary" value={filters.minSalary} onChange={handleInputChange} />
                </div>
                <div className="filter-group">
                  <label>最高月薪</label>
                  <input name="maxSalary" type="number" placeholder="50000" value={filters.maxSalary} onChange={handleInputChange}/>
                </div>
              </div>
              <div className="filter-footer">
                <button className="clear-filters" onClick={clearFilters}>清空</button>
                <button className="save-filters" onClick={applyFilters}>保存</button>
              </div>
            </div>
          </div>
        )}
        <CandidateList candidates={filteredCandidates.length > 0 ? filteredCandidates : null } loading2={loading2}/>
      </div>
    </div>
  );
};

export default CompanySearch;
