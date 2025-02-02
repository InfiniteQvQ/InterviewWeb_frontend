import React, { useState, useEffect } from "react";
import "./jobsPage.css";
import API_BASE_URL from '../config/apiConfig';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useCallback } from "react";
import { useRef } from "react";

const JobsPage = () => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailedForm, setIsDetailedForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobReq, setJobReq] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);
  const [jdInput, setJdInput] = useState("");
  const [jdHourlyRate, setJdHourlyRate] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  const isProcessedRef = useRef(false);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
      alert("用户未登录，请先登录！");
      navigate('/login');
    }
  }, [navigate]);
  

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
      setJobReq(job.requirement || "");
    } else {
      setJobTitle("");
      setJobDescription("");
      setHourlyRate("");
      setEditingJob(null);
      setJobReq("");
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
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      return;
    }
    closeJDModal();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/job/generate?username=${user.username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: jdInput,
          hourlyRate: parseFloat(jdHourlyRate),
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("JD 生成成功！");
        navigate("/jd", { state: { jdData: data.job } });
      } else {
        alert(data.message || "生成JD失败！");
      }
    } catch (error) {
      console.error("Error generating JD:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      
        setLoading(false);
        return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/job/list?username=${user.username}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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
  }, []);

  
  
  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailedForm(false);
    setJobTitle("");
    setJobDescription("");
    setHourlyRate("");
    setEditingJob(null);
    setJobReq("");
  };

  const saveJob = async () => {
    if (jobTitle.trim() === "" ||  String(hourlyRate).trim() === "") {
      alert("工作标题和小时薪资不能为空");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
        return;
    }

    const jobData = {
      title: jobTitle,
      description: jobDescription,
      hourlyRate: parseFloat(hourlyRate),
      requirement: jobReq,
      id: editingJob?.id,
    };
    closeModal();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/job/${editingJob ? "update" : "add"}?username=${user.username}`, {
        method: editingJob ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
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
      navigate("/jobs", { state: null });
    }
  };

  const saveGeneratedJob = useCallback(async (jobData) => {
    console.log(jobData);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      alert("用户未登录，请先登录！");
      return;
    }

    const { title, description, requirement, hourlyRate } = jobData;
    
    if (!title || !description || !requirement || !hourlyRate) {
      alert("岗位数据不完整，无法保存！");
      return;
    }

    const requestBody = {
      title,
      description,
      requirement,
      hourlyRate: parseFloat(hourlyRate),
    };

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/job/add?username=${user.username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.success) {
        alert("岗位已成功保存到数据库！");
        fetchJobs();
      } else {
        alert(data.message || "保存岗位失败！");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("保存岗位时发生错误！");
    } finally {
      setLoading(false);
    }
  }, [fetchJobs]);


  useEffect(() => {
    const jobData = location.state?.jobData;

    if (jobData && !isProcessedRef.current) {
      isProcessedRef.current = true;
      saveGeneratedJob(jobData).then(() => {
        navigate("/jobs", { state: null });
      });
    }
  }, [location.state, navigate, saveGeneratedJob]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]); 

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
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/job/delete/${id}?username=${user.username}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
        <button className="create-job-button" onClick={openJDModal}>
          <svg
              xmlns="https://www.w3.org/2000/svg"
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
            创建工作</button>
          
          
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
                        navigate(`/applicant`, { state: { title: job.title } });
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
                    <label>岗位职责</label>
                    <textarea
                      placeholder="请输入工作描述"
                      className="job-input"
                      value={jobReq}
                      onChange={(e) => setJobReq(e.target.value)}
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
