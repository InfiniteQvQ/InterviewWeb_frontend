import React, { useEffect, useRef, useState } from "react";
import "./CandidatesPage.css";
import API_BASE_URL from "../config/apiConfig";
import { useNavigate } from "react-router-dom";

const roles = ["数据分析师", "UI设计师", "后端工程师"];

const CandidatesPage = () => {
  const navigate = useNavigate();
  const [displayedText, setDisplayedText] = useState("");
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const animationTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false); // 控制加载状态
 

  useEffect(() => {
    const role = roles[currentRoleIndex];

    if (!isDeleting && currentCharIndex < role.length) {
      animationTimeoutRef.current = setTimeout(() => {
        setDisplayedText((prev) => prev + role[currentCharIndex]);
        setCurrentCharIndex((prev) => prev + 1);
      }, 200);
    } else if (isDeleting && currentCharIndex > 0) {
      animationTimeoutRef.current = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setCurrentCharIndex((prev) => prev - 1);
      }, 100);
    } else if (!isDeleting && currentCharIndex === role.length) {
      animationTimeoutRef.current = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && currentCharIndex === 0) {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [currentCharIndex, isDeleting, currentRoleIndex]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsTyping((prev) => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      alert("仅支持上传 PDF, DOC, DOCX 格式的文件！");
      return;
    }

    setSelectedFile(file);
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleParseFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      alert("用户未登录，请先登录！");
      navigate("/login");
      return null;
    }

    setLoading(true); // 开始加载
    try {
      const response = await fetch(
        `${API_BASE_URL}/resume/process?username=${user.username}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setLoading(false); // 停止加载
        navigate(`/int`, { state: { data } }); // 跳转到目标页面并传递数据
      } else {
        setLoading(false); // 停止加载
        console.log(response);
        alert("解析失败，请重试！");
      }
    } catch (error) {
      setLoading(false); // 停止加载
      console.error("解析失败:", error);
      alert("解析失败，请检查网络连接！");
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="candidate-container">
      <div className="top-candidate">
        <div className="left-head">
          <div className="candidate-title">加入Freeca</div>
          <div className="candidate-title">
            助力成为{" "}
            <span style={{ color: "#128C7E" }}>
              {displayedText}
              {isTyping && "|"}
            </span>
          </div>
          <div className="candidate-subtitle">
            与超过30万名专业人士一起, 找到你的梦想工作
          </div>
        </div>
        <div className="right-box">
          {loading ? (
            <div className="loading-overlay-right">
              <div className="loading-spinner"></div>
              <p>解析中，请稍候...</p>
            </div>
          ) : (
            <div className="upload-box">
              {selectedFile ? (
                <div className="uploaded-content">
                  <img src="/file.jpg" alt="File Icon" />
                  <p className="candidate-upload-title">已上传文件：</p>
                  <div className="file-details">
                    <p className="file-name">{selectedFile.name}</p>
                    <button
                      className="delete-button-upload"
                      onClick={handleDeleteFile}
                    >
                      X
                    </button>
                  </div>
                  <button className="parse-button" onClick={handleParseFile}>
                    解析简历
                  </button>
                </div>
              ) : (
                <div
                  className="candidate-act-upload"
                  onClick={handleUploadClick}
                >
                  <img src="/file.jpg" alt="File Icon" />
                  <div className="btn-upload">
                    <p className="candidate-upload-title">即刻启程</p>
                    <p className="Sub-upload-title">
                      通过一个申请来获得无数个机会
                    </p>
                    <button>上传简历</button>
                  </div>
                </div>
              )}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
        </div>
      </div>
      <div className="progress-bar-container">
        {/* 第一个进度条 */}
        <div className="progress-item">
          <div className="progress-bar-wrapper">
            <div className="progress-bar-segment animate"></div>
          </div>
          <div className="progress-label active-label">
            上传简历 <br /> 2 mins
          </div>
        </div>

        {/* 第二个进度条 */}
        <div className="progress-item">
          <div className="progress-bar-wrapper">
            <div className="progress-bar-segment"></div>
          </div>
          <div className="progress-label">
            智能面试 <br /> 20 mins
          </div>
        </div>

        {/* 第三个进度条 */}
        <div className="progress-item">
          <div className="progress-bar-wrapper">
            <div className="progress-bar-segment"></div>
          </div>
          <div className="progress-label">
            完善信息 <br /> 5 mins
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default CandidatesPage;
