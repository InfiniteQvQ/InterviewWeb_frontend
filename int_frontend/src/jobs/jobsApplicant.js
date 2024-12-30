import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./jobsApplicant.css";

const JobsApplicant = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const jobTitle = location.state?.title || "Job Details";

    const jobStats = {
        total: 0,
        shortlisted: 0,
        invited: 0,
        applying: 0,
        applied: 0,
      };

  // Mock applicants data
  const applicants = [];
  
  
  return (
    <div className="applicants-page-container">
      <div className="applicants-header">
        <div className="applicants-header-left">
          <h1>工作 &gt; {jobTitle}</h1>
          <p>您可以在这里创建工作，并且和候选者分享</p>
        </div>
        <div className="applicants-header-buttons">
          <button className="edit-job-button">Edit Job</button>
          <button className="share-job-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true" 
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 13.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8.59 7.11l6.83 3.38m0 2.06l-6.83 3.38"
            />
            </svg>
            分享工作</button>
        </div>
      </div>

      {/* Job Stats Grid */}
      <div className="job-stats-grid">
        <div className="stat-card">
          <p>总共</p>
          <h2>{jobStats.total}</h2>
        </div>
        <div className="stat-card">
          <p>入围</p>
          <h2>{jobStats.shortlisted}</h2>
        </div>
        <div className="stat-card">
          <p>邀请</p>
          <h2>{jobStats.invited}</h2>
        </div>
        <div className="stat-card">
          <p>应聘中</p>
          <h2>{jobStats.applying}</h2>
        </div>
        <div className="stat-card">
          <p>已应聘</p>
          <h2>{jobStats.applied}</h2>
        </div>
      </div>

      <div className="applicants-shortlist">
        <h3>入围名单</h3>
        <p>您可以利用这个页面安排面试，招募候选人，以及更多！</p>
        {applicants.length === 0 ? (
          <div className="no-applicants">
            <p>您还没有让候选人入围</p>
            <p>使用搜索界面来招募更多候选人！</p>
            <button className="hire-team-button"
            onClick={() => navigate("/search")}
            >+ 招募团队</button>
          </div>
        ) : (
          <div className="applicants-list">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="applicant-card">
                <h3>{applicant.name}</h3>
                <p>Email: {applicant.email}</p>
                <p>Phone: {applicant.phone}</p>
                <p>Submitted At: {new Date(applicant.submittedAt).toLocaleString()}</p>
                {applicant.resumeUrl && (
                  <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                )}
                {applicant.imageUrl && (
                  <div className="image-container">
                    <img src={applicant.imageUrl} alt={`${applicant.name}'s Submission`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsApplicant;
