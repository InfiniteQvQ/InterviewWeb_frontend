import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./VideoInterviewPage.css";

const VideoInterviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const data = state?.data;
  const [devices, setDevices] = useState({
    cameras: [],
    microphones: [],
    speakers: [],
  });
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // 清理媒体资源的函数
  const forceCleanupMediaTracks = useCallback(() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          console.error("Error stopping track:", error);
        }
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // 初始化摄像头预览
  const startPreview = useCallback(async () => {
    forceCleanupMediaTracks();

    if (!selectedCamera) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCamera },
        audio: { deviceId: selectedMicrophone },
      });

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error starting video preview:", error);
    }
  }, [forceCleanupMediaTracks, selectedCamera, selectedMicrophone]);

  // 获取媒体设备
  const getMediaDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      const microphones = devices.filter(
        (device) => device.kind === "audioinput"
      );
      const speakers = devices.filter((device) => device.kind === "audiooutput");

      setDevices({ cameras, microphones, speakers });

      if (cameras.length > 0) setSelectedCamera(cameras[0].deviceId);
      if (microphones.length > 0) setSelectedMicrophone(microphones[0].deviceId);
      if (speakers.length > 0) setSelectedSpeaker(speakers[0].deviceId);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  }, []);

  // 清理逻辑：路由变化、页面卸载、页面隐藏
  useEffect(() => {
    getMediaDevices();

    const handleBeforeUnload = () => {
      forceCleanupMediaTracks();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        forceCleanupMediaTracks();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      forceCleanupMediaTracks();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [getMediaDevices, forceCleanupMediaTracks]);

  // 更新摄像头预览
  useEffect(() => {
    startPreview();
    return () => {
      forceCleanupMediaTracks();
    };
  }, [startPreview, forceCleanupMediaTracks]);

  const handleStartInterview = () => {
    forceCleanupMediaTracks();
    navigate("/interview-process", { state: { data } });
  };

  const handleSkip = () => {
    forceCleanupMediaTracks();
    console.log(data);
    
    navigate("/profile", { state: { data: data.data } });
  };

  return (
    <div className="video-int-container">
      <div className="video-int-mid">
        <div className="video-int-left-box">
          {/* 视频预览 */}
          <div className="video-int-preview">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-box"
            />
          </div>

          {/* 设备选择 */}
          <div className="video-int-equip-select">
            <div className="video-int-equip-item">
              <label className="video-int-equip-label">摄像头：</label>
              <select
                className="video-int-equip-select-box"
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
              >
                {devices.cameras.map((camera) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || "Camera"}
                  </option>
                ))}
              </select>
            </div>

            <div className="video-int-equip-item">
              <label className="video-int-equip-label">麦克风：</label>
              <select
                className="video-int-equip-select-box"
                value={selectedMicrophone}
                onChange={(e) => setSelectedMicrophone(e.target.value)}
              >
                {devices.microphones.map((mic) => (
                  <option key={mic.deviceId} value={mic.deviceId}>
                    {mic.label || "Microphone"}
                  </option>
                ))}
              </select>
            </div>

            <div className="video-int-equip-item">
              <label className="video-int-equip-label">扬声器：</label>
              <select
                className="video-int-equip-select-box"
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
              >
                {devices.speakers.map((speaker) => (
                  <option key={speaker.deviceId} value={speaker.deviceId}>
                    {speaker.label || "Speaker"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="video-int-right-box">
          <div className="video-int-head">
            <div className="video-int-title">
              <img src="/Fc.jpg" alt="Logo" />
              <p>智能面试</p>
            </div>
            <p className="video-int-subtitle">你会经历一个长度约20分钟的面试</p>
          </div>
          <div className="video-int-btns">
            <button className="video-int-start-btn" onClick={handleStartInterview}>
              开始面试
            </button>
            <button className="video-int-issues-btn" onClick={handleSkip}>
              暂时跳过
            </button>
          </div>
        </div>
      </div>

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
                <div className="progress-bar-segment animate"></div>
                </div>
                <div className="progress-label active-label">
                智能面试 <br /> 20 mins
                </div>
            </div>

            {/* 第三个进度条 */}
            <div className="progress-item">
                <div className="progress-bar-wrapper">
                <div className="progress-bar-segment"></div>
                </div>
                <div className="progress-label">
                完善信息 <br /> 5 mins
                </div>
            </div>
        </div>

        

    </div>
  );
};

export default VideoInterviewPage;
