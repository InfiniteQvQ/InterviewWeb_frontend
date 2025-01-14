import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GlobalPage.css";
import "./CreatePostPage.css";
import API_BASE_URL from "../config/apiConfig";
const CreatePostPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("text"); // 当前选项卡
  const [uploadedImage, setUploadedImage] = useState(null); // 存储上传的图片
  const [formData, setFormData] = useState({
    userId: "", // 用户ID
    title: "",
    content: "",
    com: "all", // 默认分类
  });

  // 从 localStorage 获取用户信息
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        username: user.username, // 设置用户名
      }));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file); // 存储文件对象
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // 阻止默认行为
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedImage(file); // 存储文件对象
    }
  };

  const handleClick = () => {
    document.getElementById("file-upload-input").click(); // 触发文件选择
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.title || !formData.content) {
      alert("请填写所有必填字段！");
      return;
    }

    const data = new FormData();
    data.append("username", formData.username); // 发送用户名
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("com", formData.com);
    if (uploadedImage) {
      data.append("image", uploadedImage); // 添加图片
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Post 创建成功！");
      console.log(response.data);
      navigate("/global-talent-network"); 
    } catch (error) {
      console.error("创建 Post 失败", error);
      alert("创建失败，请重试！");
    }
  };

  return (
    <div className="GTN-newpage-container">
      {/* 搜索栏 */}
      <div className="GTN-global-search-bar">
        <input
          type="text"
          placeholder="在人才网络当中搜索..."
          className="GTN-search-input"
        />
        <button
          className="GTN-btn-post"
          onClick={() => navigate("/global-talent-network")}
        >
          ← 返回
        </button>
      </div>

      {/* 主内容区域 */}
      <div className="GTN-main-content">
        {/* 左侧创建内容区域 */}
        <div className="GTN-scrollable-content">
          <h1 className="create-post-title">创建Post</h1>
          <div className="create-post-community">
            <label>选择一个社区</label>
            <select
              name="com"
              className="create-post-select"
              value={formData.com}
              onChange={handleInputChange}
            >
              <option value="all">公共频道</option>
              <option value="community1">社区1</option>
              <option value="community2">社区2</option>
            </select>
          </div>
          <div className="create-post-container">
            {/* Tabs */}
            <div className="create-post-tabs">
              <button
                className={`create-post-tab ${activeTab === "text" ? "active" : ""}`}
                onClick={() => setActiveTab("text")}
              >
                纯文本
              </button>
              <button
                className={`create-post-tab ${activeTab === "image" ? "active" : ""}`}
                onClick={() => setActiveTab("image")}
              >
                加入图片
              </button>
            </div>

            {/* 根据选项卡状态渲染内容 */}
            {activeTab === "text" ? (
              <>
                <div className="create-post-title-input">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title*"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="create-post-body">
                  <textarea
                    name="content"
                    className="create-post-textarea"
                    placeholder="Body"
                    rows="7"
                    value={formData.content}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </>
            ) : (
              <>
                <div className="create-post-title-input">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title*"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="create-post-body">
                  <textarea
                    name="content"
                    className="create-post-textarea"
                    placeholder="Body"
                    rows="7"
                    value={formData.content}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div
                  className="create-post-upload"
                  onClick={handleClick}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {uploadedImage ? (
                    <img
                      src={URL.createObjectURL(uploadedImage)}
                      alt="Uploaded"
                      className="uploaded-preview"
                    />
                  ) : (
                    <p>拖拽上传图片或点击上传</p>
                  )}
                  <input
                    id="file-upload-input"
                    type="file"
                    accept="image/*"
                    className="create-upload-input"
                    onChange={handleFileChange}
                  />
                </div>
              </>
            )}

            <div className="create-post-actions">
              <button className="post-button" onClick={handleSubmit}>
                发布
              </button>
            </div>
          </div>
        </div>

        {/* 右侧社区信息区域 */}
        <div className="GTN-community-info">
          <div className="GTN-ad-container">
            <div className="GTN-ad-logo">
              <img src="/Fc.jpg" alt="Freeca Logo" className="GTN-ad-image" />
            </div>
            <div className="GTN-ad-text">
              <div className="GTN-ad-line">加入Freeca</div>
              <div className="GTN-ad-line">实现你的梦想！</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
