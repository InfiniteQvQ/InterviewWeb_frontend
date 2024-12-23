import React from "react";
import { Link } from "react-router-dom";
import './CompanyNavbar.css';

const CompanyNavbar = () => {
  return (
    <nav className="company-navbar">
      <div className="company-navbar-logo">
         <Link to="/">
            <img
                src="/Fc.jpg" 
                alt="Logo"
                className="navbar-logo-image"
                style={{ width: '45px', height: '45px' }}
            />
        </Link>
      </div>
      <ul className="company-navbar-links">
        <li>
          <Link to="/search">
            <img src="/Search.jpg" alt="Search" className="navbar-icon" />
            <span>搜索</span>
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <img src="/Jobs.jpg" alt="Jobs" className="navbar-icon" />
            <span>工作</span>
          </Link>
        </li>
        <li>
          <Link to="/team">
            <img src="/Team.jpg" alt="Team" className="navbar-icon" />
            <span>团队</span>
          </Link>
        </li>
        <li>
          <Link to="/spend">
            <img src="/Spend.jpg" alt="Spend" className="navbar-icon" />
            <span>花销</span>
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <img src="/Settings.jpg" alt="Settings" className="navbar-icon" />
            <span>设置</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default CompanyNavbar;
