import React, { useState } from "react";
import "./CandidateList.css";

const CandidateList = () => {
  const totalCandidates = 50; // 假设总共有50个候选人
  const candidatesPerPage = 10; // 每页显示10个候选人
  const [currentPage, setCurrentPage] = useState(1);
  
  // 新增：记录“当前查看的候选人”，null 表示「列表模式」
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // 1) 这里是模拟数据：给每个候选人加上 workExperience, education 字段。
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = [...Array(totalCandidates)].map((_, i) => {
    return {
      id: i,
      name: `S. T.`,
      experience: i + 1,
      description: "Developed high-scale video transcoding services and ML pipelines at Amazon.",
      skills: ["AWS", "C++", "Docker", "JavaScript", "React"],
      workExperience: [
        {
          title: "Software Development Engineer",
          company: "Amazon Inc.",
          timeline: "2021 - Present",
          badge: "Exceptional",
          description: `Researched and created proofs-of-concepts for video processing 
            and ran bulk tests with multiple tools like FFmpeg, OpenCV, MediaConvert, 
            Elemental Transcoder to compare best fit for our internal use case...`
        },
        {
          title: "Software Engineer",
          company: "Oracle",
          timeline: "2021 - 2021",
          badge: "Prestigious",
          description: `Worked in the Forwarding Plane team in software defined wide area 
            network project using C and C++. Work revolved around algorithm to decide 
            packet forwarding based on data about various WAN paths available.`
        },
      ],
      education: [
        {
          degree: "Bachelors of Technology, Electrical Engineering",
          institution: "Delhi Technological University",
          timeline: "2017 - 2021",
        },
        {
          degree: "Class XII",
          institution: "Sarla Chopra DAV Public School",
          timeline: "2015 - 2017",
        },
        {
          degree: "Class X",
          institution: "Sarla Chopra DAV Public School",
          timeline: "2015 - 2017",
        },
      ],
    };
  }).slice(indexOfFirstCandidate, indexOfLastCandidate);

  // 计算总页数
  const totalPages = Math.ceil(totalCandidates / candidatesPerPage);

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
  if (selectedCandidate) {
    return (
      <div className="single-detail-container">
        <div className="candidate-detail-card">
          {/* 返回按钮 */}
          <button
            className="candidate-detail-back"
            onClick={() => setSelectedCandidate(null)}
          >
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
            <img src="/SearchPeople.jpg" alt="Candidate" className="detail-photo" />
            <div className="detail-header-text">
              <h3>
                {selectedCandidate.name} | Exp: {selectedCandidate.experience} years
              </h3>
              <p className="detail-description">
                {selectedCandidate.description}
              </p>
            </div>
          </div>

          {/* 技能 / Commitments */}
          <div className="detail-info-row">
            <div>
              <h4>擅长技能</h4>
              <div className="detail-skills-row">
                {selectedCandidate.skills.map((skill) => (
                  <span key={skill} className="detail-skill-tag">{skill}</span>
                ))}
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
              <strong>Full-time at $6,935 / month</strong> (Starts in 4 weeks)
            </p>
            <p>
              <strong>Part-time at $3,468 / month</strong> (Starts immediately)
            </p>
          </div>

          {/* ========== 按钮点击滚动到对应区块 ========== */}
          <div className="detail-tabs">
            <button onClick={() => handleScrollTo("aiInterview")}>Interview</button>
            <button onClick={() => handleScrollTo("workExperience")}>Experience</button>
            <button onClick={() => handleScrollTo("educationSection")}>Education</button>
            <button>奖项</button>
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
            {selectedCandidate.workExperience?.map((job, idx) => (
              <div key={idx} className="experience-item">
                <div className="experience-title-row">
                  <h5>{job.title}</h5>
                  {job.badge && (
                    <span className="experience-badge">{job.badge}</span>
                  )}
                </div>
                <div className="experience-company-time">
                  <strong>{job.company}</strong>
                  <span className="experience-timeline">{job.timeline}</span>
                </div>
                <p className="experience-description">{job.description}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div id="educationSection" className="education-section">
            <h4>教育经历</h4>
            {selectedCandidate.education?.map((edu, idx) => (
              <div key={idx} className="education-item">
                <h5>{edu.degree}</h5>
                <strong>{edu.institution}</strong>
                <span className="education-timeline">{edu.timeline}</span>
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
              <img src="/SearchPeople.jpg" alt="Candidate" className="photo" />
            </div>
            <div className="candidate-name">
              <h3>
                {candidate.name} | 经验: {candidate.experience} 年
              </h3>
            </div>
            {/* 点击 => 进入详情模式 */}
            <button
              className="view-profile"
              onClick={() => setSelectedCandidate(candidate)}
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
                <button className="commitment-button">Full-time</button>
                <button className="commitment-button">Part-time</button>
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
