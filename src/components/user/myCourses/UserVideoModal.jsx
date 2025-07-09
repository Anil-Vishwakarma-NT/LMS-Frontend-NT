import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";
import { updateContentProgress } from "../../../service/UserCourseService";
import { useSelector } from "react-redux";

const UserVideoModal = ({ isOpen, videoUrl, onClose, contentId, courseId }) => {
  const lastPositionRef = useRef(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const storedUserId = localStorage.getItem("userId");
  const userId = useSelector((state) => state.auth.userId) || storedUserId;
  
  useEffect(() => {
    if (isOpen) {
      lastPositionRef.current = 0;
      setTotalDuration(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  useEffect(() => {
    async function fetchLastPosition() {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user-progress/last-position?userId=${userId}&courseId=${courseId}&contentId=${contentId}`
        );
        lastPositionRef.current = response.data;
      } catch (error) {
        console.error("Error fetching last position:", error);
        lastPositionRef.current = 0;
      }
    }

    if (isOpen) {
      fetchLastPosition();
    }
  }, [isOpen, userId, courseId, contentId]);

  const handleProgress = (progress) => {
    lastPositionRef.current = progress.playedSeconds;
  };

  const handleDuration = (duration) => {
    setTotalDuration(duration);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    lastPositionRef.current = totalDuration;
  };

  const handleClose = () => {
    const finalPosition = lastPositionRef.current;

    if (finalPosition > 0 && totalDuration > 0) {
      let completionPercentage = (finalPosition / totalDuration) * 100;
      if (completionPercentage >= 95 || totalDuration - finalPosition <= 5)
        completionPercentage = 100;

      updateContentProgress(
        userId,
        contentId,
        courseId,
        finalPosition,
        completionPercentage,
        "video"
      );
    }

    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={800}
      centered
      closeIcon={<CloseOutlined style={{ fontSize: 18, color: "#000" }} />}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
    >
      <div style={{ position: "relative", paddingTop: "56.25%" /* 16:9 */ }}>
        <ReactPlayer
          url={videoUrl}
          controls
          playing={isPlaying}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handleVideoEnd}
          progressInterval={1000}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>
    </Modal>
  );
};

export default UserVideoModal;
