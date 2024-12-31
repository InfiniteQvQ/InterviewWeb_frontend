import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./JDPage.css";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../config/apiConfig';

const JDPage = () => {
    const navigate = useNavigate();
  // 模拟岗位 JD 数据
  const location = useLocation();

  const fieldMapping = {
    title: "岗位标题",
    description: "岗位概述",
    requirement: "任职要求",
    hourlyRate: "小时薪资",
  };

  const mockJDData = location.state?.jdData || {
    title: "前端开发工程师",
    description: "负责公司前端应用的开发和维护，优化用户体验。",
    requirement: "熟练掌握 React，具备 HTML/CSS/JavaScript 的深厚知识，有团队合作精神。",
    hourlyRate: 50,
  };

  const [jdData, setJDData] = useState(mockJDData);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "请先选择您要调整的内容，选择后请描述需要修改的部分。如果满意，请点击最下方的生成岗位按钮。" },
  ]); 
  const [selectedField, setSelectedField] = useState(""); 
  const chatHistoryRef = useRef(null); 

  // 每次对话更新时滚动到底部
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const adjustJobField = async (field, originalContent, improvementPoints) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.username) {
      alert("用户未登录，请先登录！");
      return null;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/job/adjust?username=${user.username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field,
          originalContent,
          improvementPoints,
        }),
      });
      const data = await response.json();
      if (data.success) {
        return data.adjustedContent;
      } else {
        alert(data.message || "调整失败！");
        return null;
      }
    } catch (error) {
      console.error("Error adjusting job field:", error);
      alert("调整时发生错误！");
      return null;
    }
  };
  // 处理对话提交
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (chatInput.trim() === "") {
      alert("请输入对话内容");
      return;
    }

    const newChat = { role: "user", content: chatInput };
    setChatHistory([...chatHistory, newChat]);
    setChatInput("");
    console.log(jdData);
    let updatedJD = { ...jdData };
    let assistantResponse = "已根据您的需求完成修改：";

    if (selectedField === "description" || selectedField === "requirement") {
    // 调用后端接口调整字段
        const originalContent = selectedField === "description" ? jdData.description : jdData.requirement;
        const adjustedContent = await adjustJobField(selectedField, originalContent, chatInput);

        if (adjustedContent) {
            updatedJD[selectedField] = adjustedContent;
            assistantResponse += `${selectedField} 修改为 "${adjustedContent}"。`;
        } else {
            assistantResponse = "调整失败，请重试！";
        }
    } else if (selectedField === "title") {
        updatedJD.title = chatInput;
        assistantResponse += `岗位标题修改为 "${chatInput}"。`;
    } else if (selectedField === "hourlyRate") {
        const hourlyRate = parseFloat(chatInput);
        if (!isNaN(hourlyRate)) {
        updatedJD.hourlyRate = hourlyRate;
        assistantResponse += `小时薪资修改为 "${hourlyRate}"。`;
        } else {
        assistantResponse = "输入的小时薪资无效，请输入数字。";
        }
    } else {
        assistantResponse = "请选择要修改的字段，并输入修改内容。";
    }

    // 更新状态
    setJDData(updatedJD);
    setChatHistory([
        ...chatHistory,
        newChat,
        { role: "assistant", content: assistantResponse },
    ]);
  };

  // 渲染字段选择按钮
  const renderFieldButton = (field, label, value) => (
    
        <div
        className={`field-container ${
            selectedField === field ? "selected" : ""
        }`}
        onClick={() => setSelectedField(field)}
        >
        <h4 className="field-label">{label}</h4>
        <p className="field-value">{value}</p>
        </div>

   
    
  );
  

  const handleGenerateJob = () => {
    console.log("called")
    const jobData = {
      title: jdData.title,
      description: jdData.description,
      requirement: jdData.requirement,
      hourlyRate: jdData.hourlyRate,
    };
    setJDData(null);

    navigate("/jobs", { state: { jobData } }); 
  };
  

  return (
    <div className="jd-page-container">
      {/* 左侧 JD 信息 */}
      <div className="jd-main-content">
        <div className="jd-content">
            
                {renderFieldButton("title", "岗位标题", jdData.title)}
                {renderFieldButton("description", "岗位概述", jdData.description)}
                {renderFieldButton("requirement", "任职要求", jdData.requirement)}
                {renderFieldButton(
                "hourlyRate",
                "小时薪资",
                `$${jdData.hourlyRate}/小时`
                )}
            
        </div>

        {/* 右侧 AI 对话框 */}
        <div className="chat-box-job">
            <h3>调整岗位 JD</h3>
            <div className="chat-history-job" ref={chatHistoryRef}>
            {chatHistory.map((chat, index) => (
                <div key={index} className={`chat-message-job ${chat.role}`}>
                <p>{chat.content}</p>
                </div>
            ))}
            </div>
            <form onSubmit={handleChatSubmit}>
            <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`请输入对"${fieldMapping[selectedField] || "字段"}"的调整内容...`}
            />
            <button type="submit" disabled={!selectedField}>
                发送
            </button>
            </form>
        </div>
      </div>

      <div className="generate-job-container">
        <button className="generate-job-button" onClick={handleGenerateJob}>生成岗位</button>
      </div>
    </div>
  );
};

export default JDPage;
