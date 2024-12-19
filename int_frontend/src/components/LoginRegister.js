import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css';
import API_BASE_URL from '../config/apiConfig';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true); // true: 登录模式, false: 注册模式
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // 新增邮箱状态
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
    setEmail(''); // 切换模式时清空邮箱
  };

  const handleSubmit = async () => {
    const url = isLogin ? `${API_BASE_URL}/users/login` : `${API_BASE_URL}/users/register`;
    const successMessage = isLogin ? '登录成功' : '注册成功，请登录';
    const errorMessage = isLogin ? '用户名或密码错误' : '用户名已存在或邮箱已注册';

    const requestBody = isLogin
      ? { username, pwd: password }
      : { username, pwd: password, email }; // 添加邮箱到注册请求

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        if (isLogin) {
          const user = await response.json();
          sessionStorage.setItem('user', JSON.stringify(user));
          navigate('/profile'); // 跳转到个人中心页面
        } else {
          alert(successMessage);
          setIsLogin(true); // 注册成功后切换回登录模式
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || errorMessage);
      }
    } catch (error) {
      console.error('请求失败:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? '登录' : '注册'}</h2>
      <input
        type="text"
        placeholder="用户名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {!isLogin && (
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}
      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>{isLogin ? '登录' : '注册'}</button>
      <p onClick={toggleMode} className="toggle-link">
        {isLogin ? '还没有账号？注册' : '已有账号？登录'}
      </p>
    </div>
  );
};

export default LoginRegister;
