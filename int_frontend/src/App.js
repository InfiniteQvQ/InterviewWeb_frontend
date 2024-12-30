import React, { useState } from "react";
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user.username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    sessionStorage.removeItem("user");
  };

  const location = useLocation();

  // 控制是否显示 CompanyNavbar
  const showCompanyNavbar =
    location.pathname === "/companies" || location.pathname === "/search" 
    || location.pathname === "/jobs" || location.pathname === "/spend"
    || location.pathname === "/team" || location.pathname === "/settings"
    || location.pathname === "/jd" || location.pathname === "/applicant"; ;

  return (
    <>
   
      {showCompanyNavbar ? (
        <CompanyNavbar />
      ) : (
        <Navbar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />
      )}

      
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/interview" element={<HomePage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/login" element={<LoginRegister onLogin={handleLogin} />} />
        <Route path="/companies" element={<SearchPage />} /> 
        <Route path="/global-talent-network" element={<GTNPage />} />
        <Route path="/search" element={<SearchPage />} /> 
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/team" element={<CompanyTeam />} />
        <Route path="/spend" element={<CompanySpend />} />
        <Route path="/settings" element={<CompanySetting />} />
        <Route path="/applicant" element={<JobsApplicant />} />
        <Route path="/jd" element={<JDPage />} />
        
      </Routes>
    </>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
