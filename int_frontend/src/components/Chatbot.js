import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import API_BASE_URL from '../config/apiConfig';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hideIcon, setHideIcon] = useState(false);
  const chatHistoryRef = useRef(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const toggleChat = () => {
    if (!isOpen) {
      setHideIcon(true);
      setTimeout(() => {
        setIsOpen(true);   
        streamInitialMessage();
      }, 300);
    } else {
      setIsOpen(false);
      setTimeout(() => {
        setHideIcon(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      const bounceInterval = setInterval(() => {
        setIsBouncing(true);
        setFadeOut(false); // 确保在每次跳动前重置 fadeOut
        setTimeout(() => {
          setIsBouncing(false);
        }, 2000); 
      }, 30000); 

      return () => clearInterval(bounceInterval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isBouncing && !isOpen) {
      setFadeOut(true); // 开始淡出动画

      const fadeOutTimeout = setTimeout(() => {
        setFadeOut(false); // 动画结束后移除淡出状态
      }, 300); // 与 fadeOutTooltip 动画时长一致

      return () => clearTimeout(fadeOutTimeout);
    }
  }, [isBouncing, isOpen]);

  const streamInitialMessage = () => {
    const initialMessageContent = "您好，我是智能职业规划&&职业发展咨询助手，请问我有什么可以帮您的吗？";
    const assistantMessage = { role: "assistant", content: "" };
    setMessages([assistantMessage]); // 初始化空消息
  
    let index = 0;
  
    const interval = setInterval(() => {
      if (index < initialMessageContent.length) {
        // 每次添加一个字符
        assistantMessage.content += initialMessageContent[index];
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === "assistant") {
            return [...prev.slice(0, -1), assistantMessage]; // 更新最后一条消息
          } else {
            return [...prev, assistantMessage]; // 添加新消息
          }
        });
        index++;
      } else {
        clearInterval(interval); // 所有字符添加完成后停止
      }
    }, 70); 
  };

  const handleSend = () => {
    if (!currentMessage.trim()) return;

    const userMessage = { role: "user", content: currentMessage.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage(""); // 清空输入框
    setStreaming(true);

    const eventSource = new EventSource(
      `${API_BASE_URL}/job/chatbot?query=${encodeURIComponent(userMessage.content)}`
    );

    let assistantMessage = { role: "assistant", content: "" };

    eventSource.onmessage = (event) => {
      const data = event.data;
      if (data === "[DONE]") {
        // 停止流式标志
        setStreaming(false);
        // 关闭 EventSource
        eventSource.close();
      }
      else  {
        assistantMessage.content += data; 
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === "assistant") {
            return [...prev.slice(0, -1), assistantMessage ]; // 更新最后一条消息
          } else {
            return [...prev, assistantMessage ]; // 添加新消息
          }
        });
      }
    };

    eventSource.onerror = () => {
        setStreaming(false);
        eventSource.close();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "抱歉，我暂时无法连接到服务器，请稍后再试。" },
        ]);
      };
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]); 
  

  return (
    <>
      {!hideIcon && (
        <div className="chatbot-container">
            {/* 图标和提示框容器 */}
            <div className="chatbot-icon-wrapper">
                <div className={`chatbot-icon ${isBouncing ? "bounce-animation" : ""}`} onClick={toggleChat}>
                    <img src="/StarIcon.png" alt="Chatbot Icon" className="chatbot-image" />
                </div>
            {/* 在 isBouncing 或 fadeOut 时显示提示框 */}
            {(isBouncing || fadeOut) && (
                <div className={`chatbot-tooltip ${fadeOut ? "fade-out" : ""}`}>
                    有什么问题都来问我！
                </div>
            )}
            </div>
        </div>
      )}

      {isOpen && (
        <div className="chat-box chatbox-animation">
          <div className="chatbox-header">
            <span>智能咨询助手</span>
            <button onClick={toggleChat} className="chatbox-close">
              X
            </button>
          </div>
          <div className="chat-history" ref={chatHistoryRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.role === "user" ? "user" : "assistant"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              name="message"
              placeholder="输入您的信息..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              disabled={streaming}
            />
            <button type="button" onClick={handleSend} disabled={streaming}>
              发送
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
