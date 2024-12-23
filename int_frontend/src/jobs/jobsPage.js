import React, { useState, useEffect } from "react";
import "./jobsPage.css";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailedForm, setIsDetailedForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // Detect click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".job-menu") && !event.target.closest(".menu-button")) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const openModal = (job = null, detailed = false) => {
    setIsModalOpen(!detailed);
    setIsDetailedForm(detailed);

    if (job) {
      setEditingJob(job);
      setJobTitle(job.title);
      setJobDescription(job.description || "");
      setHourlyRate(job.hourlyRate || "");
    } else {
      setJobTitle("");
      setJobDescription("");
      setHourlyRate("");
      setEditingJob(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailedForm(false);
    setJobTitle("");
    setJobDescription("");
    setHourlyRate("");
    setEditingJob(null);
  };

  const saveJob = () => {
    if (jobTitle.trim() !== "") {
      if (editingJob) {
        const updatedJobs = jobs.map((job) =>
          job.id === editingJob.id
            ? { ...job, title: jobTitle, description: jobDescription, hourlyRate }
            : job
        );
        setJobs(updatedJobs);
      } else {
        const newJob = {
          id: jobs.length + 1,
          title: jobTitle,
          description: jobDescription,
          hourlyRate,
          updated: "Just now",
          applicants: 0,
        };
        setJobs([...jobs, newJob]);
      }
      closeModal();
    }
  };

  const deleteJob = (id) => {
    const updatedJobs = jobs.filter((job) => job.id !== id);
    setJobs(updatedJobs);
    setActiveMenu(null);
  };

  return (
    <div className="company-content">
      <div className="jobs-header">
        <div className="jobs-header-left">
          <h1>工作</h1>
          <p>你可以在这里创建工作，并且和候选者共享</p>
        </div>
        <button
          className="create-job-button"
          onClick={() => openModal(null, true)}
        >
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          创建工作
        </button>
      </div>

    

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <p className="no-jobs">当前还未发布工作</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <button
                  className="menu-button"
                  onClick={() =>
                    setActiveMenu(activeMenu === job.id ? null : job.id)
                  }
                >
                  ⋮
                </button>
              </div>
              <p>更新时间： {job.updated}</p>
              <p>{job.applicants} 申请人数</p>

              {activeMenu === job.id && (
                <div className="job-menu">
                  <button
                    className="menu-item"
                    onClick={() => {
                      openModal(job, true);
                      setActiveMenu(null);
                    }}
                  >
                    编辑
                  </button>
                  <button
                    className="menu-item"
                    onClick={() => {
                      deleteJob(job.id);
                      setActiveMenu(null);
                    }}
                  >
                    删除
                  </button>
                  <button
                    className="menu-item"
                    onClick={() => {
                      alert(`Sharing job: ${job.title}`);
                      setActiveMenu(null);
                    }}
                  >
                    分享
                  </button>
                  <button
                    className="menu-item"
                    onClick={() => {
                      alert(`Viewing details for job: ${job.title}`);
                      setActiveMenu(null);
                    }}
                  >
                    查看申请
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {(isModalOpen || isDetailedForm) && (
        <div className="modal">
          <div className="modal-content">
            {isDetailedForm ? (
              <>
                <h2>{editingJob ? "Edit Job" : "Create Job"}</h2>
                <div className="form-group">
                  <label>工作标题</label>
                  <input
                    type="text"
                    placeholder="请输入工作标题"
                    className="job-input"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>工作描述</label>
                  <textarea
                    placeholder="请输入工作描述"
                    className="job-input"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>小时薪资</label>
                  <input
                    type="number"
                    placeholder="请输入小时薪资"
                    className="job-input"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
                <div className="modal-actions">
                  <button className="cancel-button" onClick={closeModal}>
                    取消
                  </button>
                  <button className="save-button" onClick={saveJob}>
                    保存
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
