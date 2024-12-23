import React, { useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SpendFilters.css";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const SpendFilters = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const dropdownRefs = useRef({});

  const [spendData] = useState([
    { date: "2024-12-01", category: "Marketing", amount: "$500" },
    { date: "2024-12-02", category: "Development", amount: "$700" },
    { date: "2024-12-03", category: "Design", amount: "$300" },
    { date: "2024-12-04", category: "Marketing", amount: "$450" },
    { date: "2024-12-05", category: "Development", amount: "$800" },
    { date: "2024-12-06", category: "Marketing", amount: "$600" },
    { date: "2024-12-07", category: "Design", amount: "$200" },
    { date: "2024-12-08", category: "Development", amount: "$750" },
    { date: "2024-12-09", category: "Marketing", amount: "$550" },
    { date: "2024-12-10", category: "Development", amount: "$900" },
    { date: "2024-12-11", category: "Design", amount: "$400" },
    { date: "2024-12-12", category: "Marketing", amount: "$500" },
    { date: "2024-12-13", category: "Development", amount: "$850" },
    { date: "2024-12-14", category: "Design", amount: "$350" },
    { date: "2024-12-15", category: "Marketing", amount: "$650" },
  ]);


  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const filteredData = spendData.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= endDate;
  });

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleClickOutside = (event) => {
    const refs = Object.values(dropdownRefs.current);
    if (!refs.some((ref) => ref && ref.contains(event.target))) {
      setActiveDropdown(null);
    }
  };

  const totalSpend = filteredData.reduce(
    (sum, entry) => sum + parseFloat(entry.amount.slice(1)),
    0
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="spend-container">
      {/* Filters */}
      <div className="spend-filters">
        {/* Date Picker */}
        <div
          className="dropdown"
          ref={(ref) => (dropdownRefs.current["date"] = ref)}
        >
          <button
            className="dropdown-button"
            onClick={() => toggleDropdown("date")}
          >
            日期:{" "}
            {startDate && endDate
              ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
              : "Select Date"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dropdown-icon"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {activeDropdown === "date" && (
            <div className="dropdown-calendar">
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
              />
            </div>
          )}
        </div>

        {/* Project Dropdown */}
        <div
          className="dropdown"
          ref={(ref) => (dropdownRefs.current["project"] = ref)}
        >
          <button
            className="dropdown-button"
            onClick={() => toggleDropdown("project")}
          >
            Projects: All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dropdown-icon"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {activeDropdown === "project" && (
            <div className="dropdown-menu">
              <div className="dropdown-item">Project 1</div>
              <div className="dropdown-item">Project 2</div>
            </div>
          )}
        </div>

        {/* Team Members Dropdown */}
        <div
          className="dropdown"
          ref={(ref) => (dropdownRefs.current["team"] = ref)}
        >
          <button
            className="dropdown-button"
            onClick={() => toggleDropdown("team")}
          >
            团队成员: All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dropdown-icon"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {activeDropdown === "team" && (
            <div className="dropdown-menu">
              <div className="dropdown-item">开发人员</div>
              <div className="dropdown-item">设计人员</div>
            </div>
          )}
        </div>

        {/* Tags Dropdown */}
        <div
          className="dropdown"
          ref={(ref) => (dropdownRefs.current["tags"] = ref)}
        >
          <button
            className="dropdown-button"
            onClick={() => toggleDropdown("tags")}
          >
            职位类型: All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="dropdown-icon"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {activeDropdown === "tags" && (
            <div className="dropdown-menu">
              <div className="dropdown-item">全职和兼职</div>
              <div className="dropdown-item">全职</div>
              <div className="dropdown-item">兼职</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="spend-summary">
        <h2>花费</h2>
        <div>
            <span className="span1">总花费: </span>
            <span className="spend2">${totalSpend.toFixed(2)}</span>
        </div>
        
      </div>

      {/* Chart Display */}
      <div className="chart-container">
        <Bar
          data={{
            labels: filteredData.map((entry) => entry.date), // X轴显示日期
            datasets: [
              {
                label: "Daily Spend ($)",
                data: filteredData.map((entry) =>
                  parseFloat(entry.amount.slice(1))
                ), // 去掉 "$" 转成数字
                backgroundColor: "#1dad9c", // 柱状图颜色
                borderColor: "#128c7e", // 边框颜色
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                  font: {
                    size: 14,
                  },
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Amount ($)",
                  font: {
                    size: 14,
                  },
                },
                ticks: {
                  callback: (value) => `$${value}`, // Y轴加单位
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SpendFilters;
