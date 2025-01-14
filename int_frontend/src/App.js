import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./nav/Navbar";
import CompanyNavbar from "./nav/CompanyNavbar";
import HomePage from "./aiInterview/aiInterview";
import CandidatesPage from "./candidates/Candidates";
import LoginRegister from "./components/LoginRegister";
import FrontPage from "./front/frontPage";
import GTNPage from "./GTN/GlobalPage";
import SearchPage from "./search/CompanySearch";
import JobsPage from "./jobs/jobsPage";
import CompanyTeam from "./team/TeamPage";
import CompanySpend from "./spend/SpendPage";
import CompanySetting from "./setting/SettingPage";
import JDPage from "./jobs/JDPage";
import JobsApplicant from "./jobs/jobsApplicant";
import Chatbot from "./components/Chatbot";
import VideoInterviewPage from "./aiInterview/VideoInterviewPage";
import ProfilePage from "./components/ProfilePage";
import PersonalDashboard from "./dashboard/Dashboard";
import IndividualPage from "./individual/IndividualPage";
import PersonalNavbar from "./nav/PersonalNavbar";
import ResumePage from "./individual/ResumePage";
import IndividualInterview from "./individual/IndividualInterview";
import GlobalNavbar from "./nav/GlobalNavbar";

import CreatePostPage from "./GTN/CreatePostPage";
// 如果你还有新创建的 Navbar / Page，也在这里引入

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
      setUsername(user.username);
    }
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user.username); 
  };

  const handleLogout = () => {
    console.log("called log");
    setIsLoggedIn(false);
    setUsername("");
    localStorage.removeItem("user");
  };

  const location = useLocation();

  // 公司端的路径
  const companyPaths = [
    "/companies",
    "/search",
    "/jobs",
    "/spend",
    "/team",
    "/settings",
    "/jd",
    "/applicant",
  ];

  // 个人端的路径
  const personalPaths = [
    "/personalprofile",
    "/personalresume", 
    "/dashboard",
    "/blog",
  ];
  
  // 判断是否在 GTN 路径
  const showGTNbar = location.pathname === "/global-talent-network" || location.pathname === "/createpost";


  // 判断是否在个人端路由
  const showPersonalNavbar = personalPaths.includes(location.pathname) && !showGTNbar;

  // 判断是否在公司端路由
  const showCompanyNavbar = companyPaths.includes(location.pathname) && !showPersonalNavbar && !showGTNbar;

  // 如果不是 GTN / 个人 / 公司，才显示默认 Navbar
  const showDefaultNavbar = !showGTNbar && !showPersonalNavbar && !showCompanyNavbar;

  // 如果不是公司、也不是个人、也不是 GTN，就显示 Chatbot
  const showChatbot = !showCompanyNavbar && !showPersonalNavbar && !showGTNbar;

  return (
    <>
      {/* 根据不同条件渲染不同 Navbar */}
      {showGTNbar ? (
        <GlobalNavbar />
      ) : showPersonalNavbar ? (
        <PersonalNavbar username={username} handleLogout={handleLogout} />
      ) : showCompanyNavbar ? (
        <CompanyNavbar />
      ) : showDefaultNavbar ? (
        <Navbar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />
      ) : null}

      {/* 路由部分 */}
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/interview" element={<HomePage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
        <Route path="/companies" element={<SearchPage />} />
        {/* 下面这个与上面的 showGTNbar 对应，一定要保证写的是 /global-talent-network */}
        <Route path="/global-talent-network" element={<GTNPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/team" element={<CompanyTeam />} />
        <Route path="/spend" element={<CompanySpend />} />
        <Route path="/settings" element={<CompanySetting />} />
        <Route path="/applicant" element={<JobsApplicant />} />
        <Route path="/jd" element={<JDPage />} />
        <Route path="/int" element={<VideoInterviewPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<PersonalDashboard />} />
        <Route path="/personalprofile" element={<IndividualPage />} />
        <Route path="/personalresume" element={<ResumePage />} />
        <Route path="/blog" element={<IndividualInterview />} />
        <Route path="/createpost" element={<CreatePostPage />} />


        {/* 如果还要添加其他新页面（比如你说的新的页面）也可以在这里加 */}
        {/* <Route path="/newpage" element={<NewPage />} /> */}
      </Routes>

      {/* Chatbot 显示条件 */}
      {showChatbot && <Chatbot />}
    </>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
