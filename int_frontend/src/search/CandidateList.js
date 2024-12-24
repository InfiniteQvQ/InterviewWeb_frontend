import React, { useState, useEffect } from "react";
import "./CandidateList.css";
import axios from "axios";
import API_BASE_URL from '../config/apiConfig';

const CandidateList = () => {
  const candidatesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [candidates, setCandidates] = useState([]);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/search/list`);
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }finally {
        setLoading(false); 
      }
    };

    fetchCandidates();
  }, []);

 
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = candidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const DEFAULT_IMAGE_URL = "http://18.117.97.107:8080/images/emp.jpg";
 
  const totalPages = Math.ceil(candidates.length / candidatesPerPage);

  // 点击“Hire”
  const handleHireCandidate = () => {
    if (!selectedCandidate) return;
    alert(`You have chosen to hire ${selectedCandidate.name}.`);
  };

  // 分页相关
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading || loadingDetails) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        正在加载候选人数据，请稍候...
      </div>
    );
  }
  
  const handleViewDetails = async (candidate) => {
    setSelectedCandidate(candidate); 
    setLoadingDetails(true); 
    setCandidateDetails(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/search/${candidate.id}`);
      const candidateData = response.data;
      setCandidateDetails(candidateData); 
    } catch (error) {
      console.error("Error fetching candidate details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };
  

  // ======= 新增：滚动到对应区块的函数 =======
  const handleScrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ===================================================
  // 如果已经选中了某个候选人，就渲染「单个详情模式」
  // ===================================================
  if (selectedCandidate && candidateDetails) {

    return (
      <div className="single-detail-container">
        <div className="candidate-detail-card">
          {/* 返回按钮 */}
          <button className="candidate-detail-back" onClick={() => {
            setSelectedCandidate(null);
            setCandidateDetails(null);
            }}>
            返回
          </button>

          {/* Hire按钮 */}
          <button
            className="candidate-detail-hire"
            onClick={handleHireCandidate}
          >
            雇用
          </button>

          {/* 头像 + 名字 + 年限 */}
          <div className="candidate-detail-header">
            <img src={candidateDetails.profile.imageUrl} alt="Candidate" className="detail-photo"
                onError={(e) => {
                    e.target.onerror = null;   
                    e.target.src = DEFAULT_IMAGE_URL;
                }}/>
            <div className="detail-header-text">
              <h3>
              {candidateDetails.profile.user.username} | 经验: {candidateDetails.exp} 年
              </h3>
              <p className="detail-description">
              {candidateDetails.profile.description}
              </p>
            </div>
          </div>

          {/* 技能 / Commitments */}
          <div className="detail-info-row">
            <div>
              <h4>擅长技能</h4>
              <div className="detail-skills-row">
                {candidateDetails.skills.map(skill => (
                    <span key={skill.id} className="detail-skill-tag">{skill.skillName}</span>))}
              </div>
            </div>
            <div className="commitment-block">
              <h4>职位类型</h4>
              <div className="commitment-buttons-row">
                <button className="commitment-button">Full-time</button>
                <button className="commitment-button">Part-time</button>
              </div>
            </div>
          </div>

          {/* 薪资、AI Interview之类的更多信息 */}
          <div className="detail-commitment-info">
            <p>
              <strong>Full-time at ¥ {Math.round(candidateDetails.profile.expectedSalary / 12)} / 月</strong> (Starts in 4 weeks)
            </p>
            <p>
              <strong>Part-time at ¥ {Math.round(candidateDetails.profile.expectedSalary / 24)} / 月</strong> (Starts immediately)
            </p>
          </div>

          {/* ========== 按钮点击滚动到对应区块 ========== */}
          <div className="detail-tabs">
            <button onClick={() => handleScrollTo("aiInterview")}>面试记录</button>
            <button onClick={() => handleScrollTo("workExperience")}>工作经历</button>
            <button onClick={() => handleScrollTo("educationSection")}>教育经历</button>
          </div>

          {/* AI Interview */}
          <div id="aiInterview" className="ai-interview-section">
            <h4>面试结果</h4>
            <div className="video-placeholder">
              <p>Video or some embedded content</p>
            </div>
          </div>

          {/* Work Experience */}
          <div id="workExperience" className="work-experience-section">
            <h4>工作经历</h4>
            {candidateDetails.workExperience?.map((job, idx) => (
              <div key={idx} className="experience-item">
                <div className="experience-title-row">
                  <h5>{job.position}</h5>
                </div>
                <div className="experience-company-time">
                  <strong>{job.companyName}</strong>
                  <span className="experience-timeline">{`${new Date(job.startDate).toLocaleDateString(undefined, { year: 'numeric' })} - ${new Date(job.endDate).toLocaleDateString(undefined, { year: 'numeric' })}`}</span>
                </div>
                <p className="experience-description">{job.description}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div id="educationSection" className="education-section">
            <h4>教育经历</h4>
            {candidateDetails.education?.map((edu, idx) => (
              <div key={idx} className="education-item">
                <div className="education-header">

                    <h5>{edu.major}     |     {edu.degree}</h5>
                </div>
                <div className="education-footer">
                    <strong>{edu.schoolName}</strong>
                    <span className="education-timeline">{`${new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric' })} - ${new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric' })}`}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ===================================================
  // 否则，渲染「原先的两列网格列表」
  // ===================================================
  return (
    <div>
      <div className="candidate-list">
        {currentCandidates.map((candidate) => (
          <div className="candidate-card" key={candidate.id}>
            {/* 第一行：图片｜姓名 | View Profile */}
            <div className="candidate-photo">
                <img src={candidate.imageUrl} alt="Candidate" className="photo"
                onError={(e) => {
                    e.target.onerror = null;   
                    e.target.src = DEFAULT_IMAGE_URL;
                }}/>
            </div>
            <div className="candidate-name">
              <h3>
                {candidate.name} | 经验: {candidate.experience} 年
              </h3>
            </div>
            {/* 点击 => 进入详情模式 */}
            <button
              className="view-profile"
              onClick={() => handleViewDetails(candidate)}
            > 查看详情</button>

            {/* 第二行：职业描述 */}
            <div className="candidate-description">
              <p>{candidate.description}</p>
            </div>

            {/* 第三行：Expert in 和 Commitment */}
            <div className="skills-commitment-row">
              <div>
                <span>擅长技能</span>
              </div>
              <div className="commitment">
                <span>职位类型</span>
              </div>
            </div>

            {/* 第四行：技能 和 Full-time / Part-time */}
            <div className="skills-row">
              <div className="skills-tags">
                {candidate.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
              <div className="commitment-buttons-row">
                {candidate.isFullTime ? (
                    <>
                        <button className="commitment-button">Full-time</button>
                        <button className="commitment-button">Part-time</button>
                    </>
                ) : (
                    <button className="commitment-button">Part-time</button>
                )}
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 分页导航 */}
      <div className="pagination">
        <div className="page-info">Page {currentPage} of {totalPages}</div>
        <div className="pagination-buttons">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            前一页
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
