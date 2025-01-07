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

  // Function to clean up media tracks
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

  // Function to request media permissions
  const requestPermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log("Media permissions granted.");
    } catch (error) {
      console.error("Error requesting media permissions:", error);
    }
  }, []);

  // Function to get and set media devices
  const getMediaDevices = useCallback(async () => {
    try {
      await requestPermission(); // Ensure permissions are granted first

      const deviceInfos = await navigator.mediaDevices.enumerateDevices();
      console.log("Devices found:", deviceInfos);

      const cameras = deviceInfos.filter((device) => device.kind === "videoinput");
      const microphones = deviceInfos.filter((device) => device.kind === "audioinput");
      const speakers = deviceInfos.filter((device) => device.kind === "audiooutput");

      setDevices({ cameras, microphones, speakers });

      if (cameras.length > 0) setSelectedCamera(cameras[0].deviceId);
      if (microphones.length > 0) setSelectedMicrophone(microphones[0].deviceId);
      if (speakers.length > 0) setSelectedSpeaker(speakers[0].deviceId);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  }, [requestPermission]);

  // Initialize media devices on component mount
  useEffect(() => {
    getMediaDevices();

    // Cleanup on unmount or when dependencies change
    return () => {
      forceCleanupMediaTracks();
    };
  }, [getMediaDevices, forceCleanupMediaTracks]);

  // Function to start video preview
  const startPreview = useCallback(async () => {
    forceCleanupMediaTracks();

    if (!selectedCamera && !selectedMicrophone) return;

    try {
      const constraints = {
        video: selectedCamera ? { deviceId: { exact: selectedCamera } } : false,
        audio: selectedMicrophone ? { deviceId: { exact: selectedMicrophone } } : false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error starting video preview:", error);
    }
  }, [forceCleanupMediaTracks, selectedCamera, selectedMicrophone]);

  // Start preview whenever selectedCamera or selectedMicrophone changes
  useEffect(() => {
    if (selectedCamera || selectedMicrophone) {
      startPreview();
    }

    return () => {
      forceCleanupMediaTracks();
    };
  }, [startPreview, forceCleanupMediaTracks, selectedCamera, selectedMicrophone]);

  // Handle page unload and visibility changes
  useEffect(() => {
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
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [forceCleanupMediaTracks]);

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
          {/* Video Preview */}
          <div className="video-int-preview">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-box"
            />
          </div>

          {/* Device Selection */}
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
        {/* First Progress Bar */}
        <div className="progress-item">
          <div className="progress-bar-wrapper">
            <div className="progress-bar-segment-active"></div>
          </div>
          <div className="progress-label">
            上传简历 <br /> 2 mins
          </div>
        </div>

        {/* Second Progress Bar */}
        <div className="progress-item">
          <div className="progress-bar-wrapper">
            <div className="progress-bar-segment animate"></div>
          </div>
          <div className="progress-label active-label">
            智能面试 <br /> 20 mins
          </div>
        </div>

        {/* Third Progress Bar */}
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
