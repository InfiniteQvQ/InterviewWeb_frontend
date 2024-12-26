import React, { useState, useEffect } from "react";
import "./jobsPage.css";
import API_BASE_URL from '../config/apiConfig';

const JobsPage = () => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailedForm, setIsDetailedForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);
  const [jdInput, setJdInput] = useState("");
  const [jdHourlyRate, setJdHourlyRate] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);
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

  const openJDModal = () => {
    setIsJDModalOpen(true);
    setJdInput("");
    setJdHourlyRate("");
  };
  const closeJDModal = () => {
    setIsJDModalOpen(false);
  };

  const generateJD = async () => {
    if (jdInput.trim() === "" || jdHourlyRate.trim() === "") {
      alert("请输入完整的JD内容和小时薪资!");
      return;
    }
    closeJDModal();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/job/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          description: jdInput,
          hourlyRate: parseFloat(jdHourlyRate),
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("JD 生成成功！");
        fetchJobs(); 
      } else {
        alert(data.message || "生成JD失败！");
      }
    } catch (error) {
      console.error("Error generating JD:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/job/list`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setJobs(
          data.jobs.map((job) => {
            const correctedTime = new Date(new Date(job.createdAt).getTime() + 8 * 60 * 60 * 1000);
            const c2 =  new Date(new Date(job.updatedAt).getTime() + 8 * 60 * 60 * 1000);
            return {
              ...job,
              createdAt: correctedTime.toLocaleString("zh-CN"), 
              updatedAt: c2.toLocaleString("zh-CN"),
              applicantsCount: job.applicantsCount || 0,
            };
          })
        );
      } else {
        alert(data.message || "Failed to fetch jobs.");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
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

  const saveJob = async () => {
    if (jobTitle.trim() === "" ||  String(hourlyRate).trim() === "") {
      alert("工作标题和小时薪资不能为空");
      return;
    }

    const jobData = {
      title: jobTitle,
      description: jobDescription,
      hourlyRate: parseFloat(hourlyRate),
      id: editingJob?.id,
    };
    closeModal();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/job/${editingJob ? "update" : "add"}`, {
        method: editingJob ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        fetchJobs();
      } else {
        alert(data.message || "Failed to save job.");
      }
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const createdTime = new Date(createdAt);
    const diffInSeconds = Math.floor((now - createdTime) / 1000);
  
    if (diffInSeconds < 60) {
      return "刚刚";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} 分钟前`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} 小时前`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} 天前`;
    }
  };

  const deleteJob = async (id) => {
    setLoading(true);
    setActiveMenu(null);
    try {
      const response = await fetch(`${API_BASE_URL}/job/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        fetchJobs();
      } else {
        alert(data.message || "Failed to delete job.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-content">
     
      <div className="jobs-header">
        <div className="jobs-header-left">
          <h1>工作</h1>
          <p>你可以在这里创建工作，并且和候选者共享</p>
        </div>
        <div className="button-group">
        <button className="create-job-button1" onClick={openJDModal}>
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
            生成JD</button>
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
        

      </div>

    
      {loading ? (
      <div className="loading-overlay">
        <div className="loading">
          <div className="spinner"></div>
          正在加载工作数据，请稍候...
        </div>
      </div>
    ) : (
      <>

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
                <p>发布于 {getTimeAgo(job.createdAt)}</p>
                <p>更新于 {getTimeAgo(job.updatedAt)}</p>
                <p>{job.applicantsCount} 申请人数</p>
                

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
                  <h2>{editingJob ? "编辑工作" : "创建工作"}</h2>
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

        {isJDModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <h2>生成JD</h2>
                    <div className="form-group">
                      <label>自然语言JD内容</label>
                      <textarea
                        placeholder="请输入描述内容"
                        className="job-input"
                        value={jdInput}
                        onChange={(e) => setJdInput(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>小时薪资</label>
                      <input
                        type="number"
                        placeholder="请输入小时薪资"
                        className="job-input"
                        value={jdHourlyRate}
                        onChange={(e) => setJdHourlyRate(e.target.value)}
                      />
                    </div>
                    <div className="modal-actions">
                      <button className="cancel-button" onClick={closeJDModal}>
                        取消
                      </button>
                      <button className="save-button" onClick={generateJD}>
                        生成
                      </button>
                    </div>
                  </div>
                </div>
              )}
      </>
    )}
    </div>
  );
};

export default JobsPage;
