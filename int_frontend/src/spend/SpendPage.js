
import "./SpendPage.css";
import SpendFilters from "./SpendFilters";

const CompanySpend = () => {
  return (
    <div className="company-content">
      <div className="spends-header">
        <div className="spends-header-left">
          <h1>支出</h1>
          <p>你可以在这里查看和管理公司的支出</p>
        </div>
        <div className="spends-header-buttons">
          <button
            className="export-button"
            onClick={() => alert("Exporting data...")}
          >
            
            导出
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="export-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12h15m-7.5-7.5L19.5 12l-7.5 7.5"
              />
            </svg>
          </button>
          <button
            className="billing-details-button"
            onClick={() => alert("Viewing billing details...")}
          >
            账单详情
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="arrow-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 18l6-6-6-6"
              />
            </svg>
          </button>
        </div>
      </div>

      <SpendFilters />

    </div>
  );
};

export default CompanySpend;
