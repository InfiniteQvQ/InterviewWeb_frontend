import React, { useState, useEffect, useRef,useCallback } from "react";
import axios from "axios";
import "./ResumePage.css";
import API_BASE_URL from "../config/apiConfig";

import grammarIcon from "../assets/grammar.png";
import brevityIcon from "../assets/value.png"
import impactIcon from "../assets/management.png"
import sectionsIcon from "../assets/user-interface.png"
import downIcon from "../assets/down.png"

const icons = {
    语法: grammarIcon,
    简明: brevityIcon,
    影响: impactIcon,
    结构: sectionsIcon,
  };

  

const ResumePage = () => {
    const circleRef = useRef(null);
  const [resumeScore, setResumeScore] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [resumeDetails, setResumeDetails] = useState({
    语法: { score: null, details: "" },
    简明: { score: null, details: "" },
    影响: { score: null, details: "" },
    结构: { score: null, details: "" },
  });

  const [overallEvaluation, setOverallEvaluation] = useState("");
  const [highlights, setHighlights] = useState([]);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    age: "",
  });

  const [errors, setErrors] = useState({
    profile: {},
    education: [],
    work: [],
    skills: [],
  });

  const [education, setEducation] = useState([]);
  const [work, setWork] = useState([]);
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态
  const [saving, setSaving] = useState(false); // 保存状态
  const [saveError, setSaveError] = useState(null); // 保存错误

  // 假设您已经获取了当前用户名，例如从登录状态或其他方式
  const username = JSON.parse(localStorage.getItem("username")) || "User";

  // 获取简历数据
  useEffect(() => {
    const fetchAndGenerate = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/search/finduser`, {
          params: { username },
        });
        const data = response.data;

        // 设置 Resume Score 和 Resume Details
        // 假设这些分数是后端计算的，如果没有，您可以根据需要进行计算
        setResumeScore(data.resumeScore || null); // 或根据 data 计算
        setResumeDetails({
            语法: data.resumeDetails?.grammar || { score: null, details: "" },
            简明: data.resumeDetails?.brevity || { score: null, details: "" },
            影响: data.resumeDetails?.impact || { score: null, details: "" },
            结构: data.resumeDetails?.sections || { score: null, details: "" },
          });

        // 设置 Profile
        setProfile({
          firstName: data.profile?.firstName || "",
          lastName: data.profile?.lastName || "",
          email: data.profile?.user?.email || "",
          phone: data.profile?.phone || "",
          location: data.profile?.location ? data.profile.location : "",
          age: data.profile?.age || "",
          summary: data.profile?.description || "",
        });

        // 设置 Skills
        setSkills(data.skills?.map((skill) => skill.skillName) || []);

        // 设置 Education
        setEducation(
          data.education?.map((edu) => ({
            id: edu.id || null, // 保留 ID 以便后端识别
            major: edu.major || "",
            school_name: edu.schoolName || "",
            start_date: edu.startDate ? edu.startDate.split("T")[0] : "",
            end_date: edu.endDate ? edu.endDate.split("T")[0] : "",
            degree: edu.degree || "",
            eval: edu.eval || "",
          })) || []
        );

        // 设置 Work Experience
        setWork(
          data.workExperience?.map((w) => ({
            id: w.id || null, // 保留 ID 以便后端识别
            position: w.position || "",
            company_name: w.companyName || "",
            start_date: w.startDate ? w.startDate.split("T")[0] : "",
            end_date: w.endDate ? w.endDate.split("T")[0] : "",
            description: w.description || "",
            eval: w.eval || "", // 如果有评价字段
          })) || []
        );
        console.log(data);
       
        setLoading(false);
      } catch (err) {
        console.error("获取简历数据失败:", err);
        setError("无法加载简历数据，请稍后重试。");
        setLoading(false);
      }
    };

    fetchAndGenerate();
  }, [username]);

    useEffect(() => {
        const circleElement = circleRef.current;

        // 设置 CSS 变量 --progress 的值为 resumeScore 的百分比
        if (circleElement) {
            circleElement.style.setProperty("--target-progress", `${resumeScore}%`);
        }
    }, [resumeScore]);

    
  // 处理基本信息变化
  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  // 处理教育经历变化
  const handleEduChange = (index, field, value) => {
    const newEdu = [...education];
    newEdu[index][field] = value;
    setEducation(newEdu);
  };

  const handleAddEdu = () => {
    setEducation([
      ...education,
      { id: null, major: "", start_date: "", end_date: "", school_name: "", degree: "", eval: ""},
    ]);
  };

  const handleDeleteEdu = (index) => {
    const newEdu = education.filter((_, i) => i !== index);
    setEducation(newEdu);
  };

  // 处理工作经历变化
  const handleWorkChange = (index, field, value) => {
    const newWork = [...work];
    newWork[index][field] = value;
    setWork(newWork);
  };

  const handleAddWork = () => {
    setWork([
      ...work,
      { id: null, position: "", start_date: "", end_date: "", company_name: "", description: "", eval: "" },
    ]);
  };

  const handleDeleteWork = (index) => {
    const newWork = work.filter((_, i) => i !== index);
    setWork(newWork);
  };


  const handleAddSkill = (skill) => {
    setSkills((prev) => [...prev, skill]);
  };

  const handleDeleteSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handleSave = async () => {
    // Initialize a new errors object
    const newErrors = {
      profile: {},
      education: [],
      work: [],
      skills: [],
    };
    
    let hasErrors = false;

    // Validate Profile Fields (excluding firstName and lastName)
    const profileFieldsToValidate = ["email", "phone", "location", "age", "summary"];
    profileFieldsToValidate.forEach((field) => {
        if (
        !profile[field] || 
        (typeof profile[field] === "string" && profile[field].trim() === "")
        ) {
        newErrors.profile[field] = true;
        hasErrors = true;
        }
    });

    // Validate Education Entries
    education.forEach((edu, index) => {
      const eduErrors = {};
      if (!edu.school_name || edu.school_name.trim() === "") {
        eduErrors.school_name = true;
        hasErrors = true;
      }
      if (!edu.major || edu.major.trim() === "") {
        eduErrors.major = true;
        hasErrors = true;
      }
      if (!edu.start_date) {
        eduErrors.start_date = true;
        hasErrors = true;
      }
      if (!edu.end_date) {
        eduErrors.end_date = true;
        hasErrors = true;
      }
      if (!edu.degree || edu.degree.trim() === "") {
        eduErrors.degree = true;
        hasErrors = true;
      }
      newErrors.education[index] = eduErrors;
    });

    // Validate Work Experience Entries
    work.forEach((w, index) => {
      const workErrors = {};
      if (!w.company_name || w.company_name.trim() === "") {
        workErrors.company_name = true;
        hasErrors = true;
      }
      if (!w.position || w.position.trim() === "") {
        workErrors.position = true;
        hasErrors = true;
      }
      if (!w.start_date) {
        workErrors.start_date = true;
        hasErrors = true;
      }
      if (!w.end_date) {
        workErrors.end_date = true;
        hasErrors = true;
      }
      if (!w.description || w.description.trim() === "") {
        workErrors.description = true;
        hasErrors = true;
      }
      newErrors.work[index] = workErrors;
    });

    // Optionally, Validate Skills (if required)
    if (skills.length === 0) {
      newErrors.skills.general = true;
      hasErrors = true;
    }

    // Update the errors state
    setErrors(newErrors);

    // If there are validation errors, do not proceed with saving
    if (hasErrors) {
      alert("请填写所有必填字段。"); // "Please fill in all required fields."
      return;
    }
    
    // Proceed with saving if no errors
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        resumeScore,
        resumeDetails,
        profile: {
          ...profile,
          location: `${profile.location}`,
        },
        education: education.map((edu) => ({
          id: edu.id,
          schoolName: edu.school_name,
          degree: edu.degree,
          major: edu.major,
          startDate: edu.start_date,
          endDate: edu.end_date,
          eval: edu.eval,
        })),
        workExperience: work.map((w) => ({
          id: w.id,
          companyName: w.company_name,
          position: w.position,
          description: w.description,
          startDate: w.start_date,
          endDate: w.end_date,
          eval: w.eval,
        })),
        skills: skills.map((skill) => ({
          skillName: skill,
        })),
      };
      console.log(payload);

      await axios.put(`${API_BASE_URL}`, payload);
      setSaving(false);
      alert("保存成功！");
    } catch (err) {
      console.error("保存简历数据失败:", err);
      setSaveError("保存失败，请稍后重试。");
      setSaving(false);
    }
  };

  const handleRegenerate = useCallback(async () => {
    setLoading(true); 
    try {
      // 构造请求数据，缺失的信息设置为 null
      const payload = {
        education: education.map((edu) => ({
          id: edu.id || null,
          schoolName: edu.school_name || null, 
          degree: edu.degree || null,
          major: edu.major || null,
          startDate: edu.start_date || null,    // 修改为 snake_case
          endDate: edu.end_date || null, 
        })),
        workExperience: work.map((w) => ({
          id: w.id || null,
          companyName: w.company_name || null,
          position: w.position || null,
          description: w.description || null,
          startDate: w.start_date || null,      // 修改为 snake_case
          endDate: w.end_date || null,  
        })),
        skills: skills.map((skill) => ({
          skillName: skill || null,
        })),
      };
      console.log(payload);
      if(payload.education == null){
        return;
      }
      // 向后端发送请求
      const response = await axios.post(`${API_BASE_URL}/resume/evaluate-resume`, payload);

      // 假设返回数据格式如下：
      // {
      //   success: true,
      //   message: "简历评分成功！",
      //   data: {
      //     resumeScore: 85,
      //     resumeDetails: { grammar: 80, brevity: 90, impact: 85, sections: 80 },
      //     highlights: [
      //       { summary: "Strong Technical Skills", details: "You demonstrated proficiency in various programming languages and frameworks." },
      //       { summary: "Excellent Project Experience", details: "Your projects showcase a deep understanding of complex concepts." },
      //       { summary: "Well-Structured Resume", details: "Your resume is easy to read and highlights your achievements clearly." }
      //     ]
      //   }
      // }

      if (response.data && response.data.success) {
        
        console.log(response.data.data);
        const responseData = response.data.data;
        const grammarScore = responseData.grammar?.score ?? 0;
        const brevityScore = responseData.brevity?.score ?? 0;
        const impactScore = responseData.impact?.score ?? 0;
        const sectionsScore = responseData.sections?.score ?? 0;
        const totalScore = grammarScore + brevityScore + impactScore + sectionsScore;
        const averageScore = Math.round(totalScore / 4);
        // 更新前端数据，确保缺失的信息设置为 null
        setResumeScore(averageScore);
    
        setResumeDetails({
            语法: responseData.grammar || { score: 0, details: "" },
            简明: responseData.brevity || { score: 0, details: "" },
            影响: responseData.impact || { score: 0, details: "" },
            结构: responseData.sections || { score: 0, details: "" },
          });
        setOverallEvaluation(responseData.overallEvaluation || "");
        setHighlights(responseData.highlights || []);
      } else {
        // 处理后端返回的失败情况
        alert(response.data.message || "简历评估失败，请稍后重试！");
      }
  
      setLoading(false); // 隐藏加载状态
    } catch (error) {
      console.error("评估简历失败:", error);
      alert("简历评估失败，请稍后重试！");
      setLoading(false); // 隐藏加载状态
    }
  }, [education, work, skills]);

  useEffect(() => {
    // 当 education/work/skills 更新后，且不为空时，执行评估
    if (education.length && work.length && skills.length) {
      handleRegenerate();
    }
  }, [education, work, skills, handleRegenerate]);

  if (loading) {
    return <div className="resume-page__loading">加载中...</div>;
  }

  if (error) {
    return <div className="resume-page__error">{error}</div>;
  }
  
  return (
    <div className="resume-page">
      {/* 左侧评分区域 */}
      <div className="resume-page__left">
        <div className="resume-header">
            <h1 className="resume-title">{username}的简历</h1>
            <button
                className="regenerate-btn"
                onClick={handleRegenerate}
                disabled={loading}
                >
                {loading ? "Loading..." : "重新生成"}
            </button>
        </div>

        {/* Score and Description */}
        <div className="resume-score-section">
            <div className="score-circle" ref={circleRef}>
                <div className="score-number">{resumeScore}</div>
            </div>
            <div className="score-description">
                <p>您的简历的得分为 <span className="highlight-score">{resumeScore} out of 100</span>.</p>
                <p>
                您的简历看起来很好! {overallEvaluation} 别担心！我们可以通过一些简单的调整来让它做得更好！
                </p>
            </div>
        </div>

        {/* Scoring Details */}
        <div className="resume-page__scores">
            {Object.entries(resumeDetails).map(([key, value]) => (
                <div className="resume-score-item" key={key}>
                    <div className="score-item-header">
                        {/* 主图标和标签文本 */}
                        <div className="score-item__label">
                            <img src={icons[key]} alt={`${key} icon`} className="score-item-icon" />
                            <span className="score-item-text">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                        </div>

                        {/* 分数和切换按钮 */}
                        <div className="score-item__value-container">
                            <div
                                className={`score-item__value ${
                                    value.score >= 80
                                        ? "score-green"
                                        : value.score >= 60
                                        ? "score-yellow"
                                        : "score-red"
                                }`}
                            >
                                {value.score}/100
                            </div>
                            <button
                                className={`toggle-btn ${expanded[key] ? 'rotated' : ''}`}
                                onClick={() =>
                                    setExpanded((prev) => ({
                                        ...prev,
                                        [key]: !prev[key],
                                      }))
                                }
                            >
                                <img
                                    src={downIcon} // 使用单一图标，通过旋转实现向上和向下效果
                                    alt={expanded[key] ? "Collapse" : "Expand"}
                                    className="toggle-icon"
                                />
                            </button>
                        </div>
                    </div>
                    {expanded[key] && (
                        <div className="score-item-details">
                            <p>{value.details}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>


        {/* Highlights */}
        <div className="resume-highlights">
        <h3>Highlights</h3>
        {highlights.map((item, idx) => (
            <div className="highlight-item" key={idx}>
            <img src="checked.png" className="highlight-icon" alt="checked" />
            <div className="highlight-content">
                <strong>{item.summary}</strong> {item.details}
            </div>
            </div>
        ))}
        </div>
      </div>

      {/* 垂直分界线 */}
      <div className="resume-page__divider"></div>

      {/* 右侧基本信息 */}
      <div className="resume-page__right">
        {/* Profile Section */}
        <div className="res-section">
          <h3>个人信息</h3>
          <div className="res-basic-info">
            {/* <div className="res-form-group-row">
                <div className="res-form-group">
                <label>姓</label>
                <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                />
                </div>

                <div className="res-form-group">
                    <label>名</label>
                    <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => handleProfileChange("lastName", e.target.value)}
                    />
                </div>
            </div> */}
            
            <div className="res-form-group-row">
                <div className="res-form-group">
                    <label>Email</label>
                    <input
                        type="text"
                        value={profile.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                        className={errors.profile.email ? "res-error" : ""}
                    />
                    </div>
                <div className="res-form-group">
                    <label>联系电话</label>
                    <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange("phone", e.target.value)}
                        className={errors.profile.phone ? "res-error" : ""}
                    />
                </div>
            </div>
            
            
            <div className="res-form-group-row">
                <div className="res-form-group">
                    <label>年龄</label>
                    <input
                        type="text"
                        value={profile.age}
                        onChange={(e) => handleProfileChange("age", e.target.value)}
                        className={errors.profile.age ? "res-error" : ""}
                    />
                </div>
                <div className="res-form-group">
                    <label>地址</label>
                    <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => handleProfileChange("location", e.target.value)}
                        className={errors.profile.location ? "res-error" : ""}
                    />
                </div>
            </div>
            <div className="res-form-group">
              <label>概述</label>
              <textarea
                value={profile.summary}
                onChange={(e) => handleProfileChange("summary", e.target.value)}
                className={errors.profile.summary ? "res-error" : ""}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="res-section">
          <h3>教育经历</h3>
          {education.map((edu, index) => (
            <div className="edu-entry" key={index}>
                <div className="res-form-group-row">
                    <div className="res-form-group">
                        <label>学校名称</label>
                        <input
                        type="text"
                        value={edu.school_name}
                        onChange={(e) => handleEduChange(index, "school_name", e.target.value)}
                        className={errors.education[index]?.school_name ? "res-error" : ""}
                        />
                    </div>
                    <div className="res-form-group">
                        <label>专业</label>
                        <input
                        type="text"
                        value={edu.major}
                        onChange={(e) => handleEduChange(index, "major", e.target.value)}
                        className={errors.education[index]?.major ? "res-error" : ""}
                        />
                    </div>
                </div>

                <div className="res-form-group-row">
                    <div className="res-form-group">
                        <label>起始日期</label>
                        <input
                        type="date"
                        value={edu.start_date}
                        onChange={(e) => handleEduChange(index, "start_date", e.target.value)}
                        className={errors.education[index]?.start_date ? "res-error" : ""}
                        />
                    </div>
                    <div className="res-form-group">
                        <label>截止日期</label>
                        <input
                        type="date"
                        value={edu.end_date}
                        onChange={(e) => handleEduChange(index, "end_date", e.target.value)}
                        className={errors.education[index]?.end_date ? "res-error" : ""}
                        />
                    </div>
                </div>
              
                <div className="res-form-group-row">
                    <div className="res-form-group">
                        <label>学位</label>
                        <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEduChange(index, "degree", e.target.value)}
                        className={errors.education[index]?.degree ? "res-error" : ""}
                        />
                    </div>

                    <button
                        type="button"
                        className="res-delete-btn"
                        onClick={() => handleDeleteEdu(index)}
                    >
                        X 删除
                    </button>
                </div>
              
            </div>
          ))}
          <button type="button" className="res-add-btn" onClick={handleAddEdu}>
            + 添加教育经历
          </button>
        </div>

        {/* Work Section */}
        <div className="res-section">
          <h3>工作经历</h3>
          {work.map((w, index) => (
            <div className="work-entry" key={index}>
              <div className="res-form-group-row">
                <div className="res-form-group">
                    <label>公司名称</label>
                    <input
                    type="text"
                    value={w.company_name}
                    onChange={(e) => handleWorkChange(index, "company_name", e.target.value)}
                    className={errors.work[index]?.company_name ? "res-error" : ""}
                    />
                </div>
                <div className="res-form-group">
                    <label>职位</label>
                    <input
                    type="text"
                    value={w.position}
                    onChange={(e) => handleWorkChange(index, "position", e.target.value)}
                    className={errors.work[index]?.position ? "res-error" : ""}
                    />
                </div>
                
              </div>
              
              <div className="res-form-group-row">
                <div className="res-form-group">
                    <label>起始日期</label>
                    <input
                    type="date"
                    value={w.start_date}
                    onChange={(e) => handleWorkChange(index, "start_date", e.target.value)}
                    className={errors.work[index]?.start_date ? "res-error" : ""}
                    />
                </div>
                <div className="res-form-group">
                    <label>截止日期</label>
                    <input
                    type="date"
                    value={w.end_date}
                    onChange={(e) => handleWorkChange(index, "end_date", e.target.value)}
                    className={errors.work[index]?.end_date ? "res-error" : ""}
                    />
                </div>
                
              </div>
              <div className="res-form-group-row">
                <div className="res-form-group">
                    <label>岗位概述</label>
                    <textarea
                        value={w.description}
                        onChange={(e) => handleWorkChange(index, "description", e.target.value)}
                        style={{ overflow: "hidden" }}
                        rows={1} // 设置初始行数
                        ref={(textarea) => {
                        if (textarea) {
                            textarea.style.height = "auto"; // 确保初始化时重置高度
                            textarea.style.height = `${textarea.scrollHeight}px`; // 根据内容设置高度
                        }
                        }}
                        onInput={(e) => {
                        e.target.style.height = "auto"; // 输入时重置高度
                        e.target.style.height = `${e.target.scrollHeight}px`; // 动态调整高度
                        }}
                        className={errors.work[index]?.description ? "res-error" : ""}
                    ></textarea>
                </div>
                <button
                    type="button"
                    className="res-delete-btn"
                    onClick={() => handleDeleteWork(index)}
                >
                    删除 X
                </button>
              </div>
              {/* 如果有 Evaluation 字段，请取消注释以下代码 */}
              {/* <div className="form-group">
                <label>Evaluation</label>
                <textarea
                  value={w.eval}
                  onChange={(e) => handleWorkChange(index, "eval", e.target.value)}
                ></textarea>
              </div> */}
              
            </div>
          ))}
          <button type="button" className="res-add-btn" onClick={handleAddWork}>
            + 添加工作经历
          </button>
        </div>

        {/* Skills Section */}
        <div className="res-section">
            <h3>Skills</h3>
            {errors.skills.general && (
                <div className="res-error-message">请至少添加一项技能</div> // "Please add at least one skill."
            )}
            <div className="skills-container">
                {skills.map((skill, index) => (
                <div className="skill-tag" key={index}>
                    <span>{skill}</span>
                    <button
                    type="button"
                    className="skill-delete-btn"
                    onClick={() => handleDeleteSkill(index)}
                    >
                    ×
                    </button>
                </div>
                ))}
                <input
                type="text"
                className="skill-input"
                placeholder=""
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && newSkill.trim()) {
                    handleAddSkill(newSkill.trim());
                    setNewSkill("");
                    }
                }}
                />
            </div>
        </div>


        {/* 保存按钮 */}
        <div className="res-save-container">
          <button
            type="button"
            className="res-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "保存中..." : "保存"}
          </button>
          {saveError && <div className="res-save-error">{saveError}</div>}
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
