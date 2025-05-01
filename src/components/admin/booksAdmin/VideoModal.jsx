import React from "react";
import ReactPlayer from "react-player";
import "./VideoModal.css";

const VideoModal = ({ isOpen, videoUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✖ Close
        </button>
        <div className="player-container">
          <ReactPlayer
            url={videoUrl}
            controls
            width="100%"
            height="400px"
            playing={true} // Video auto-plays when modal opens
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;