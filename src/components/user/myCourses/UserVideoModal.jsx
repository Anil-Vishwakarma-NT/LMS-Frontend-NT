import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import { updateContentProgress } from "../../../service/UserCourseService";
import "../../admin/booksAdmin/VideoModal.css";
import { useSelector } from "react-redux";



const UserVideoModal = ({ isOpen, videoUrl, onClose, contentId, courseId }) => {
  const [lastPosition, setLastPosition] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const userId = useSelector(state => state.auth.userId);
  

  useEffect(() => {
    if (isOpen) {
      setLastPosition(0);
      setTotalDuration(0);
    }
  }, [isOpen]);

  useEffect(() => {
    async function fetchLastPosition() {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user-progress/last-position?userId=${userId}&courseId=${courseId}&contentId=${contentId}`
        );
        setLastPosition(response.data);
      } catch (error) {
        console.error("Error fetching last position:", error);
        setLastPosition(0);
      }
    }

    if (isOpen) {
      fetchLastPosition();
    }
  }, [isOpen, userId, courseId, contentId]);

  useEffect(() => {
    if (lastPosition >= totalDuration) {
      setLastPosition(0);
    }
  }, [lastPosition, totalDuration]);

  const handleProgress = (progress) => {
    setLastPosition(progress.playedSeconds);
  };

  const handleDuration = (duration) => {
    setTotalDuration(duration);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  const handleClose = () => {
    console.log("Closing Modal - Sending Progress Update");
    console.log("Last Position:", lastPosition);
    console.log("Total Duration:", totalDuration);

    if (lastPosition > 0 && totalDuration > 0) {
      let completionPercentage = (lastPosition / totalDuration) * 100;
      if (completionPercentage >= 95 || totalDuration - lastPosition <= 5) completionPercentage = 100;

      updateContentProgress(userId, contentId, courseId, lastPosition, completionPercentage, "video");
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>✖ Close</button>
        <div className="player-container">
          <ReactPlayer
            url={videoUrl}
            controls
            width="100%"
            height="400px"
            playing={isPlaying}
            onProgress={handleProgress}
            onDuration={handleDuration}
            onEnded={handleVideoEnd}
            progressInterval={1000}
          />
        </div>
      </div>
    </div>
  );
};

export default UserVideoModal;