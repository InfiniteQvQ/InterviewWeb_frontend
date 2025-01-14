import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GlobalPage.css";

const GTNPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (cardData) => {
    setSelectedCard(cardData);
  };

  const handleBackClick = () => {
    setSelectedCard(null);
  };

  const handleCreateClick = () => {
    navigate("/createpost");
  };

  // 示例数据
  const redditCards = [
    {
      id: 1,
      title: "r/cuteanimals • 2 days ago",
      question: "What should I name her?",
      imageSrc: "/cat.jpg",
      alt: "Cute cat",
      votes: "5.4K",
      comments: "985",
      detailedContent: "这是关于这只可爱猫咪的详细内容。",
      commentsList: [
        { author: "User1", content: "What a cute cat!" },
        { author: "User2", content: "I would name her Luna." },
        // 更多评论
      ],
    },
    {
      id: 2,
      title: "r/aww • 1 day ago",
      question: "This is my dog, isn't he cute?",
      imageSrc: "/cat.jpg",
      alt: "Cute dog",
      votes: "2.3K",
      comments: "456 comments",
      detailedContent: "这是关于这只可爱狗狗的详细内容。",
      commentsList: [
        { author: "User3", content: "He is adorable!" },
        { author: "User4", content: "So fluffy!" },
        // 更多评论
      ],
    },
    // 可以添加更多卡片数据
  ];

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
        {/* 滚动内容区域 */}
        <div className="GTN-scrollable-content">
          {selectedCard ? (
            <div className="GTN-detailed-content">
              <button className="GTN-back-button" onClick={handleBackClick}>
                ← 返回
              </button>
              <h3 className="GTN-reddit-title">{selectedCard.title}</h3>
              <h1 className="GTN-reddit-question">{selectedCard.question}</h1>
              <div className="GTN-reddit-image-container">
                <img
                  src={selectedCard.imageSrc}
                  alt={selectedCard.alt}
                  className="GTN-reddit-image"
                  loading="lazy"
                />
              </div>
              <p className="GTN-detailed-description">{selectedCard.detailedContent}</p>
              <h3>评论区</h3>
              <div className="GTN-comments-section">
                {selectedCard.commentsList.map((comment, index) => (
                  <div key={index} className="GTN-comment">
                    <div className="GTN-comment-author">{comment.author}</div>
                    <div className="GTN-comment-content">{comment.content}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            redditCards.map((card, index) => (
              <React.Fragment key={card.id}>
                <div
                  className="GTN-reddit-card"
                  onClick={() => handleCardClick(card)}
                >
                  <h3 className="GTN-reddit-title">{card.title}</h3>
                  <h1 className="GTN-reddit-question">{card.question}</h1>
                  <div className="GTN-reddit-image-container">
                    <img
                      src={card.imageSrc}
                      alt={card.alt}
                      className="GTN-reddit-image"
                      loading="lazy"
                    />
                  </div>
                  <div className="GTN-reddit-actions">
                    {/* 按钮区域 */}
                    {/* 点赞 */}
                    <button className="GTN-like-button">
                      <div className="GTN-button-content">
                        <img src="/like.png" alt="like" className="GTN-icon" />
                        <span>{card.votes}</span>
                      </div>
                    </button>
                    {/* 评论 */}
                    <button className="GTN-comments-button">
                      <div className="GTN-button-content">
                        <img src="/chat-box.png" alt="comments" className="GTN-icon" />
                        <span>{card.comments}</span>
                      </div>
                    </button>
                    {/* 分享 */}
                    <button className="GTN-share-button">
                      <div className="GTN-button-content">
                        <img src="/share.png" alt="share" className="GTN-icon" />
                        <span>分享</span>
                      </div>
                    </button>
                  </div>
                </div>
                {index < redditCards.length - 1 && <hr className="GTN-divider" />}
              </React.Fragment>
            ))
          )}
          {/* 可以继续添加更多卡片 */}
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
          {/* 可以在这里添加更多社区相关的信息 */}
        </div>
      </div>
    </div>
  );
};

export default GTNPage;
