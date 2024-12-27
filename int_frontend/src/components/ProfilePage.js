import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      } else {
        navigate('/'); // 如果未登录，跳转到登录页面
      }
    }, [navigate]);

    const handleLogout = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        alert("未找到登录信息，请重新登录！");
        navigate('/');
        return;
      }
      localStorage.removeItem('user'); 
      
    };

  return (
    <div className="profile-container">
      <h2>个人中心</h2>
      {user ? (
        <div>
          <p>欢迎, {user.username}</p>
          <button onClick={handleLogout}>登出</button>
          {/* 添加个人信息、教育经历和工作经历的组件 */}
        </div>
      ) : (
        <p>正在加载...</p>
      )}
    </div>
  );
};

export default ProfilePage;
