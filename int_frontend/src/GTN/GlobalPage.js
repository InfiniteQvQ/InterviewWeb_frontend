import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GlobalPage.css";

import API_BASE_URL from "../config/apiConfig";

const GTNPage = () => {
  const [posts, setPosts] = useState([]);             // 用于存储后端返回的帖子列表
  const [selectedCard, setSelectedCard] = useState(null); // 当前选中的帖子
  const navigate = useNavigate();

  // 一进页面就请求后端的帖子列表
  useEffect(() => {
    // 根据你的后端实际地址调整
    // 如果是Spring Boot默认端口8080，则类似：http://localhost:8080/api/posts
    fetch(`${API_BASE_URL}/posts`)
      .then((response) => response.json())
      .then((data) => {
        console.log("后端返回的帖子数据:", data);
        setPosts(data);
      })
      .catch((error) => {
        console.error("获取帖子出错:", error);
      });
  }, []);

  // 点击卡片时，设置当前选中的帖子
  const handleCardClick = (cardData) => {
    setSelectedCard(cardData);
  };

  // “返回”按钮：清空选中的帖子，回到列表
  const handleBackClick = () => {
    setSelectedCard(null);
  };

  // “创建”按钮：跳转到创建页面
  const handleCreateClick = () => {
    navigate("/createpost");
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
        <button className="GTN-btn-post" onClick={handleCreateClick}>
          + 创建
        </button>
      </div>

      {/* 主内容区域 */}
      <div className="GTN-main-content">
        {/* 左侧滚动内容区域 */}
        <div className="GTN-scrollable-content">
          {/* 如果有选中的帖子，显示详情，否则显示帖子列表 */}
          {selectedCard ? (
            <div className="GTN-detailed-content">
              <button className="GTN-back-button" onClick={handleBackClick}>
                ← 返回
              </button>
              {/* 显示选中帖子的标题、内容、图片等 */}
              <h3 className="GTN-reddit-title">{selectedCard.title}</h3>
              {/* 这里也可以用 selectedCard.username 来显示发帖人 */}
              <h1 className="GTN-reddit-question">{selectedCard.content}</h1>
              <div className="GTN-reddit-image-container">
                {/* 注意：要保证 selectedCard.imagePath 是可访问的 URL */}
                <img
                  src={selectedCard.imagePath}
                  alt={selectedCard.title}
                  className="GTN-reddit-image"
                  loading="lazy"
                />
              </div>
              {/* 更多字段展示 */}
              <p className="GTN-detailed-description">
                由 {selectedCard.username} 发布 / Likes: {selectedCard.likes}
              </p>
              <h3>评论区 (示例，需要你自己拓展)</h3>
              {/* 评论数据可以在后端返回或单独请求，这里仅示例 */}
              {/* <div className="GTN-comments-section">...</div> */}
            </div>
          ) : (
            // 如果没有选中帖子，则遍历 posts，显示列表
            posts.map((post, index) => (
              <React.Fragment key={post.postId}>
                <div
                  className="GTN-reddit-card"
                  onClick={() => handleCardClick(post)}
                >
                  {/* 帖子标题 */}
                  <h3 className="GTN-reddit-title">{post.title}</h3>
                  {/* 帖子内容（这里只展示一部分也行） */}
                  <h1 className="GTN-reddit-question">{post.content}</h1>
                  {/* 图片 */}
                  <div className="GTN-reddit-image-container">
                    <img
                      src={API_BASE_URL + post.imagePath}
                      alt={post.title}
                      className="GTN-reddit-image"
                      loading="lazy"
                    />
                  </div>
                  {/* 点赞/评论等操作区域 */}
                  <div className="GTN-reddit-actions">
                    <button className="GTN-like-button">
                      <div className="GTN-button-content">
                        <img src="/like.png" alt="like" className="GTN-icon" />
                        <span>{post.likes}</span>
                      </div>
                    </button>
                    {/* 你可以在这里添加评论、分享等按钮 */}
                  </div>
                </div>
                {index < posts.length - 1 && <hr className="GTN-divider" />}
              </React.Fragment>
            ))
          )}
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
          {/* 这里可扩展更多社区信息 */}
        </div>
      </div>
    </div>
  );
};

export default GTNPage;
