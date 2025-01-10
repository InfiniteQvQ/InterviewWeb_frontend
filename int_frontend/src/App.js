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

  const personalPaths = [
    "/personalprofile",
    "/personalresume", 
    "/dashboard",
    "/blog",
  ];

  const showPersonalNavbar = personalPaths.includes(location.pathname);
  const showCompanyNavbar = companyPaths.includes(location.pathname) && !showPersonalNavbar;
  const showChatbot = !showCompanyNavbar && !showPersonalNavbar;
  return (
    <>
   
      {showPersonalNavbar ? (
        <PersonalNavbar username={username} handleLogout={handleLogout} />
      ) : showCompanyNavbar ? (
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
        <Route path="/int" element={<VideoInterviewPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/dashboard" element={<PersonalDashboard />}/>
        <Route path="/personalprofile" element={<IndividualPage />}/>
        <Route path="/personalresume" element={<ResumePage/>} />
        <Route path="/blog" element={<IndividualInterview />}/>
      </Routes>
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
