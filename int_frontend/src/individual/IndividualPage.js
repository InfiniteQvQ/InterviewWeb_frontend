import React, { useEffect, useState } from "react";
import axios from "axios";
import "./IndividualPage.css";
import API_BASE_URL from "../config/apiConfig";

const IndividualPage = ({ onBack }) => {
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const DEFAULT_IMAGE_URL = `${API_BASE_URL}/images/emp.jpg`;

  // 从 localStorage 获取用户名
  const username = JSON.parse(localStorage.getItem("username")) || "User";

  useEffect(() => {
    if (!username) {
      console.error("用户名未找到");
      setLoading(false);
      return;
    }

    // 页面加载时发送请求获取候选人详情
    const fetchCandidateDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/search/finduser?username=${username}`);
        setCandidateDetails(response.data);
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateDetails();
  }, [username]);

  if (loading) {
    return (
      <div className="loading-new">
        <div className="spinner"></div>
        正在加载候选人数据，请稍候...
      </div>
    );
  }


  const getEvalClass = (evalValue) => {
    switch (evalValue) {
      case '杰出':
        return 'outstanding';
      case '优秀':
        return 'excellent';
      case '良好':
        return 'good';
      default:
        return '';
    }
  };
  const handleScrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="individual-page">
      {/* 返回按钮 */}
      <div className="candidate-detail-card-new">
            {/* 头像 + 名字 + 年限 */}
        <div className="candidate-detail-header">
            <img src={candidateDetails.profile.imageUrl || DEFAULT_IMAGE_URL} className="detail-photo" alt="candidate"
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

        {/* 技能 */}
        <div className="detail-info-row">
            <div>
              <h4>擅长技能</h4>
              <div className="detail-skills-row">
                {candidateDetails.skills.map(skill => (
                    <span key={skill.id} className="detail-skill-tag-new">{skill.skillName}</span>))}
              </div>
            </div>
            <div className="commitment-block">
              <h4>职位类型</h4>
              <div className="commitment-buttons-row">
                {candidateDetails.profile.isFullTime ? (
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

          <div className="detail-commitment-info">
            <p>
              <strong>Full-time at ¥ {Math.round(candidateDetails.profile.expectedSalary )} / 月</strong> (在四周内开始工作)
            </p>
            <p>
              <strong>Part-time at ¥ {Math.round(candidateDetails.profile.expectedSalary / 2)} / 月</strong> (即刻开始工作)
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
            <div className="video-placeholder-new">
              <p>Video or some embedded content</p>
            </div>
          </div>

          {/* Work Experience */}
          <div id="workExperience" className="work-experience-section">
            <h4>工作经历</h4>
            {candidateDetails.workExperience?.map((job, idx) => (
              <div key={idx} className="experience-item">
                <div className="experience-title-row">
                  <h5>{job.position}</h5>{job.eval && (<span className={`experience-badge ${getEvalClass(job.eval)}`}>{job.eval}</span>)}
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
                    {edu.eval && (<span className={`edu-badge ${getEvalClass(edu.eval)}`}>{edu.eval}</span>)}
                    <span className="education-timeline">{`${new Date(edu.startDate).toLocaleDateString(undefined, { year: 'numeric' })} - ${new Date(edu.endDate).toLocaleDateString(undefined, { year: 'numeric' })}`}</span>
                </div>
              </div>
            ))}
          </div>
      </div>

      
    </div>
  );
};

export default IndividualPage;
