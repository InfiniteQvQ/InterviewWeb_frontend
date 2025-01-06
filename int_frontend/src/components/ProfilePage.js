import React, { useState, useEffect } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultData = {
    profile: {
      phone: "",
      gender: "",
      age: "",
      location: "",
      expected_salary: "",
      description: "",
      is_full_time: false,
    },
    edu: [],
    work: [],
    errors: {
      profile: {},
      edu: [],
      work: [],
    },
  };

  const [data, setData] = useState(() => {
    const incomingData = location.state?.data || null; // 检查传递的数据
    if (incomingData) {
      return {
        ...defaultData,
        ...incomingData,
        errors: {
          ...defaultData.errors,
          ...incomingData.errors,
        },
      };
    }
    return defaultData; // 如果没有传递数据，使用默认空数据
  });

  /**
   * 当用户输入 "2024-07" (即 yyyy-MM) 时，自动补成 "2024-07-01"
   * 如果输入了 "2024-07-18" 这种正常格式，则保持不变
   * 如果为空，就返回一个默认值 "2023-01-01"（可自行更改）
   */
  /**
   * 当用户输入各种不完整的日期时，自动补全：
   * 1. yyyy-MM-dd => 原样返回
   * 2. yyyy-MM => 默认日 = 01
   * 3. yyyy => 默认月 = 01, 日 = 01
   * 4. 空 => 2023-01-01
   * 5. 如果用户输入了类似 "2024.7"、"2024/07/09"，也能自动拆分并补齐。
   */
  const initializeDate = (dateStr) => {
    if (!dateStr) {
      // 如果为空
      return "2023-01-01";
    }

    // 先用各种分隔符（- . / 等）拆分
    const parts = dateStr.split(/[-./]/).map((p) => p.trim());

    // parts[0], parts[1], parts[2] 分别可能是 year / month / day
    let year = parseInt(parts[0], 10);  // 如果为空或无法转数字，就会得到 NaN
    let month = parseInt(parts[1], 10);
    let day = parseInt(parts[2], 10);

    // 如果某部分是 NaN 或者没有，就给默认值
    if (isNaN(year) || year < 1000) {
      year = 2023; // 默认年份
    }
    if (isNaN(month) || month < 1 || month > 12) {
      month = 1; // 默认月份
    }
    if (isNaN(day) || day < 1 || day > 31) {
      day = 1;   // 默认日
    }

    // 转成 yyyy-MM-dd 格式
    const yyyy = String(year).padStart(4, "0");
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };


  const hasAnyErrors = (errors) => {
    // 1. 检查 profile 里的属性
    const profileHasError = Object.values(errors.profile || {}).some(Boolean);

    // 2. 检查 edu 数组里是否有任何一项有 true
    const eduHasError = (errors.edu || []).some((eduErr) =>
      Object.values(eduErr).some(Boolean)
    );

    // 3. 检查 work 数组里是否有任何一项有 true
    const workHasError = (errors.work || []).some((workErr) =>
      Object.values(workErr).some(Boolean)
    );

    return profileHasError || eduHasError || workHasError;
  };

  const handleSavebtn = () => {
    // 如果还有错误，弹出提示
    if (hasAnyErrors(data.errors)) {
      alert("需要填写数值");
    } else {
      // 没有错误，则保存并跳转
      alert("保存成功");
      navigate("/"); // 跳转到首页
    }
  };

  // 判断字段是否为空的函数
  const isFieldEmpty = (value) => {
    if (typeof value === "string") {
      return !value.trim();
    }
    return !value; // For numbers, booleans, etc.
  };

  // ============ 处理profile、edu、work里的输入改变 =============
  const handleProfileChange = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      profile: { ...prevData.profile, [key]: value },
    }));
  };

  const handleEduChange = (index, key, value) => {
    const updatedEdu = [...data.edu];
    updatedEdu[index][key] = value;
    setData((prevData) => ({ ...prevData, edu: updatedEdu }));
  };

  const handleWorkChange = (index, key, value) => {
    const updatedWork = [...data.work];
    updatedWork[index][key] = value;
    setData((prevData) => ({ ...prevData, work: updatedWork }));
  };

  // ============ 添加/删除 教育、工作 =============
  const handleAddEdu = () => {
    setData((prevData) => ({
      ...prevData,
      edu: [
        ...prevData.edu,
        {
          school_name: "",
          degree: "",
          major: "",
          start_date: "",
          end_date: "",
          eval: "",
        },
      ],
    }));
  };

  const handleDeleteEdu = (index) => {
    const updatedEdu = data.edu.filter((_, i) => i !== index);
    setData((prevData) => ({ ...prevData, edu: updatedEdu }));
  };

  const handleAddWork = () => {
    setData((prevData) => ({
      ...prevData,
      work: [
        ...prevData.work,
        {
          company_name: "",
          position: "",
          description: "",
          start_date: "",
          end_date: "",
          eval: "",
        },
      ],
    }));
  };

  const handleDeleteWork = (index) => {
    const updatedWork = data.work.filter((_, i) => i !== index);
    setData((prevData) => ({ ...prevData, work: updatedWork }));
  };


  // ============ 校验必填项, 只保留一段 useEffect =============
  useEffect(() => {
    const errors = { profile: {}, edu: [], work: [] };

    // 校验 profile
    Object.keys(data.profile).forEach((key) => {
      if (key !== "is_full_time") {
        if (isFieldEmpty(data.profile[key])) {
          errors.profile[key] = true;
        }
      }
    });

    // 校验 edu
    data.edu.forEach((eduItem) => {
      const eduErrors = {};
      if (isFieldEmpty(eduItem.school_name)) eduErrors.school_name = true;
      if (isFieldEmpty(eduItem.start_date)) eduErrors.start_date = true;
      if (isFieldEmpty(eduItem.end_date)) eduErrors.end_date = true;
      errors.edu.push(eduErrors);
    });

    // 校验 work
    data.work.forEach((workItem) => {
      const workErrors = {};
      if (isFieldEmpty(workItem.company_name)) workErrors.company_name = true;
      if (isFieldEmpty(workItem.start_date)) workErrors.start_date = true;
      if (isFieldEmpty(workItem.end_date)) workErrors.end_date = true;
      errors.work.push(workErrors);
    });

    // 存到 data 或单独存都行，这里依旧放进 data 里
    setData((prevData) => ({
      ...prevData,
      errors,
    }));
    // 只依赖这几个字段，避免无限循环
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.profile, data.edu, data.work]);

  return (
    <div className="profile-container">
      <div className="profile-container__mid">
        {/* 左侧 */}
        <div className="profile-container__left-section">
          {/* 基本信息 */}
          <div className="profile-container__section">
            <h3>基本信息</h3>
            {/* 1. 第一行：电话、性别、年龄 */}
            <div className="profile-container__form-row">
              <div className="profile-container__form-group">
                <label htmlFor="phone">电话:</label>
                <input
                  id="phone"
                  type="text"
                  className={
                    isFieldEmpty(data.profile.phone)
                      ? "profile-container__input profile-container__input-error"
                      : "profile-container__input"
                  }
                  value={data.profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                />
              </div>

              <div className="profile-container__form-group">
                <label htmlFor="gender">性别:</label>
                <select
                  id="gender"
                  className={
                    isFieldEmpty(data.profile.gender)
                      ? "profile-container__input profile-container__input-error"
                      : "profile-container__input"
                  }
                  value={data.profile.gender}
                  onChange={(e) => handleProfileChange("gender", e.target.value)}
                >
                  <option value="">请选择</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              <div className="profile-container__form-group">
                <label htmlFor="age">年龄:</label>
                <input
                  id="age"
                  type="number"
                  className={
                    isFieldEmpty(data.profile.age)
                      ? "profile-container__input profile-container__input-error"
                      : "profile-container__input"
                  }
                  value={data.profile.age}
                  onChange={(e) => handleProfileChange("age", e.target.value)}
                />
              </div>
            </div>

            {/* 2. 第二行：位置、薪资、是否全职 */}
            <div className="profile-container__form-row">
              <div className="profile-container__form-group">
                <label htmlFor="location">位置:</label>
                <input
                  id="location"
                  type="text"
                  className={
                    isFieldEmpty(data.profile.location)
                      ? "profile-container__input profile-container__input-error"
                      : "profile-container__input"
                  }
                  value={data.profile.location}
                  onChange={(e) => handleProfileChange("location", e.target.value)}
                />
              </div>

              <div className="profile-container__form-group">
                <label htmlFor="expected_salary">薪资:</label>
                <input
                  id="expected_salary"
                  type="text"
                  className={
                    isFieldEmpty(data.profile.expected_salary)
                      ? "profile-container__input profile-container__input-error"
                      : "profile-container__input"
                  }
                  value={data.profile.expected_salary}
                  onChange={(e) =>
                    handleProfileChange("expected_salary", e.target.value)
                  }
                />
              </div>

              <div className="profile-container__form-group profile-container__checkbox-group">
                <label htmlFor="is_full_time">是否全职:</label>
                <input
                  id="is_full_time"
                  type="checkbox"
                  checked={data.profile.is_full_time}
                  onChange={(e) =>
                    handleProfileChange("is_full_time", e.target.checked)
                  }
                />
              </div>
            </div>

            {/* 3. 第三行：描述 */}
            <div className="profile-container__form-row">
              <div className="profile-container__form-group profile-container__form-group--full-width">
                <label htmlFor="description">描述:</label>
                <textarea
                  id="description"
                  className={
                    isFieldEmpty(data.profile.description)
                      ? "profile-container__textarea profile-container__input-error"
                      : "profile-container__textarea"
                  }
                  value={data.profile.description}
                  onChange={(e) => handleProfileChange("description", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 教育经历 */}
          <div className="profile-container__education-container">
            <h3>教育经历</h3>
            <div className="profile-container__edu-section">
              {data.edu.map((eduItem, index) => (
                <div key={index} className="profile-container__edu-entry">
                  <div className="profile-container__form-row">
                    <div className="profile-container__form-group">
                      <label htmlFor={`major_${index}`}>专业:</label>
                      <input
                        id={`major_${index}`}
                        type="text"
                        className={
                          isFieldEmpty(eduItem.major)
                            ? "profile-container__input profile-container__input-error"
                            : "profile-container__input"
                        }
                        value={eduItem.major}
                        onChange={(e) =>
                          handleEduChange(index, "major", e.target.value)
                        }
                      />
                    </div>
                    <div className="profile-container__form-group">
                      <label>时间:</label>
                      <input
                        type="date"
                        className={
                          data.errors.edu[index]?.start_date
                            ? "profile-date-input profile-container__input-error"
                            : "profile-date-input"
                        }
                        value={initializeDate(eduItem.start_date)}
                        onChange={(e) =>
                          handleEduChange(index, "start_date", e.target.value)
                        }
                      />
                      <span>至</span>
                      <input
                        type="date"
                        className={
                          data.errors.edu[index]?.end_date
                            ? "profile-date-input profile-container__input-error"
                            : "profile-date-input"
                        }
                        value={initializeDate(eduItem.end_date)}
                        onChange={(e) =>
                          handleEduChange(index, "end_date", e.target.value)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="profile-container__delete-button"
                      onClick={() => handleDeleteEdu(index)}
                    >
                      删除
                    </button>
                  </div>

                  <div className="profile-container__form-row">
                    <div className="profile-container__form-group">
                      <label htmlFor={`school_name_${index}`}>学校:</label>
                      <input
                        id={`school_name_${index}`}
                        type="text"
                        className={
                          isFieldEmpty(eduItem.school_name)
                            ? "profile-container__input profile-container__input-error"
                            : "profile-container__input"
                        }
                        value={eduItem.school_name}
                        onChange={(e) =>
                          handleEduChange(index, "school_name", e.target.value)
                        }
                      />
                    </div>
                    <div className="profile-container__form-group">
                      <label htmlFor={`eval_edu_${index}`}>评价:</label>
                      <span>{eduItem.eval}</span>
                      {/* 如果要让用户输入评价，可改成： 
                          <input
                            type="text"
                            value={eduItem.eval}
                            onChange={(e) => handleEduChange(index, "eval", e.target.value)}
                          />
                      */}
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="profile-container__add-button"
                onClick={handleAddEdu}
              >
                添加教育经历
              </button>
            </div>
          </div>
        </div>

        {/* 右侧 */}
        <div className="profile-container__right-section">
          <h3>工作经历</h3>
          <div className="profile-container__work-section">
            {data.work.map((workItem, index) => (
              <div key={index} className="profile-container__work-entry">
                <div className="profile-container__form-row">
                  <div className="profile-container__form-group">
                    <label htmlFor={`position_${index}`}>岗位:</label>
                    <input
                      id={`position_${index}`}
                      type="text"
                      className={
                        isFieldEmpty(workItem.position)
                          ? "profile-container__input profile-container__input-error"
                          : "profile-container__input"
                      }
                      value={workItem.position}
                      onChange={(e) =>
                        handleWorkChange(index, "position", e.target.value)
                      }
                    />
                  </div>
                  <div className="profile-container__form-group">
                    <label htmlFor={`eval_work_${index}`}>评价:</label>
                    <span>{workItem.eval}</span>
                    {/* 同上，如果想让用户输入评语，可改成 <input> */}
                  </div>
                  <button
                    type="button"
                    className="profile-container__delete-button"
                    onClick={() => handleDeleteWork(index)}
                  >
                    删除
                  </button>
                </div>

                <div className="profile-container__form-row">
                  <div className="profile-container__form-group">
                    <label htmlFor={`company_name_${index}`}>公司:</label>
                    <input
                      id={`company_name_${index}`}
                      type="text"
                      className={
                        isFieldEmpty(workItem.company_name)
                          ? "profile-container__input profile-container__input-error"
                          : "profile-container__input"
                      }
                      value={workItem.company_name}
                      onChange={(e) =>
                        handleWorkChange(index, "company_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="profile-container__form-group">
                    <label>时间:</label>
                    <input
                      type="date"
                      className={
                        data.errors.work[index]?.start_date
                          ? "profile-date-input profile-container__input-error"
                          : "profile-date-input"
                      }
                      value={initializeDate(workItem.start_date)}
                      onChange={(e) =>
                        handleWorkChange(index, "start_date", e.target.value)
                      }
                    />
                    <span>至</span>
                    <input
                      type="date"
                      className={
                        data.errors.work[index]?.end_date
                          ? "profile-date-input profile-container__input-error"
                          : "profile-date-input"
                      }
                      value={initializeDate(workItem.end_date)}
                      onChange={(e) =>
                        handleWorkChange(index, "end_date", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="profile-container__form-row">
                  <div className="profile-container__form-group profile-container__form-group--full-width">
                    <label htmlFor={`description_work_${index}`}>描述:</label>
                    <textarea
                      id={`description_work_${index}`}
                      className={
                        isFieldEmpty(workItem.description)
                          ? "profile-container__textarea profile-container__input-error"
                          : "profile-container__textarea"
                      }
                      value={workItem.description}
                      onChange={(e) => {
                        handleWorkChange(index, "description", e.target.value);
                        // 自动调整文本域高度
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      style={{ overflow: "hidden" }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="profile-container__add-button"
              onClick={handleAddWork}
            >
              添加工作经历
            </button>
          </div>

          <div className="profile-container__save-container">
            <button
              type="button"
              className="profile-container__save-button"
              onClick={handleSavebtn}
            >
              保存
            </button>
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="progress-bar-container">
        {/* 第一个进度条 */}
            <div className="progress-item">
                <div className="progress-bar-wrapper">
                <div className="progress-bar-segment-active"></div>
                </div>
                <div className="progress-label">
                上传简历 <br /> 2 mins
                </div>
            </div>

            {/* 第二个进度条 */}
            <div className="progress-item">
                <div className="progress-bar-wrapper">
                <div className="progress-bar-segment"></div>
                </div>
                <div className="progress-label ">
                智能面试 <br /> 20 mins
                </div>
            </div>

            {/* 第三个进度条 */}
            <div className="progress-item">
                <div className="progress-bar-wrapper">
                <div className="progress-bar-segment animate"></div>
                </div>
                <div className="progress-label active-label">
                完善信息 <br /> 5 mins
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;
