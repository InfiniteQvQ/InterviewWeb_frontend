import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRegister from './components/LoginRegister';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} /> {/* 登录/注册页面 */}
        <Route path="/profile" element={<ProfilePage />} /> {/* 个人中心页面 */}
      </Routes>
    </Router>
  );
}

export default App;
