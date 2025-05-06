// import React, { useState, useEffect } from "react";
// import ReactPlayer from "react-player";
// import { updateContentProgress } from "../../../service/UserCourseService";
// import "../../admin/booksAdmin/VideoModal.css";

// const UserVideoModal = ({ isOpen, videoUrl, onClose, userId = 2, contentId, courseId }) => {
//   const [lastPosition, setLastPosition] = useState(0);
//   const [totalDuration, setTotalDuration] = useState(0); // Track total video duration

//   const handleProgress = (progress) => {
//     setLastPosition(progress.playedSeconds); // Capture last watched timestamp
//   };

//   const handleDuration = (duration) => {
//     setTotalDuration(duration); // Set total video duration
//   };

//   const handleClose = () => {
//     if (userId && contentId && courseId && lastPosition > 0 && totalDuration > 0) {
//       let completionPercentage = (lastPosition / totalDuration) * 100;

//       if (completionPercentage >= 99) {
//         completionPercentage = 100;
//       }

//       updateContentProgress(userId, contentId, courseId, lastPosition, completionPercentage, "video");
//     }

//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="close-button" onClick={handleClose}>
//           ✖ Close
//         </button>
//         <div className="player-container">
//           <ReactPlayer
//             url={videoUrl}
//             controls
//             width="100%"
//             height="400px"
//             playing={true}
//             onProgress={handleProgress} // Track video position
//             onDuration={handleDuration} // Capture total video duration
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserVideoModal;


import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import { updateContentProgress } from "../../../service/UserCourseService";
import "../../admin/booksAdmin/VideoModal.css";

const UserVideoModal = ({ isOpen, videoUrl, onClose, userId = 2, contentId, courseId }) => {
  const [lastPosition, setLastPosition] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const playerRef = useRef(null); // ✅ Reference to the player

  useEffect(() => {
    async function fetchLastPosition() {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user-progress/last-position?userId=${userId}&courseId=${courseId}&contentId=${contentId}`
        );
        const retrievedPosition = response.data;
        setLastPosition(retrievedPosition >= totalDuration ? 0 : retrievedPosition);
      } catch (error) {
        console.error(" Error fetching last position:", error);
        setLastPosition(0);
      }
    }

    if (isOpen) {
      fetchLastPosition();
    }
  }, [isOpen, userId, courseId, contentId]);

  useEffect(() => {
    if (playerRef.current && lastPosition > 0) {
      playerRef.current.seekTo(lastPosition, "seconds");
    }
  }, [lastPosition]); 

  const handleProgress = (progress) => {
    setLastPosition(progress.playedSeconds);
  };

  const handleDuration = (duration) => {
    setTotalDuration(duration);
  };

  const handleClose = () => {
    if (lastPosition > 0 && totalDuration > 0) {
      let completionPercentage = (lastPosition / totalDuration) * 100;
      if (completionPercentage >= 99) completionPercentage = 100;

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
            ref={playerRef} 
            url={videoUrl}
            controls
            width="100%"
            height="400px"
            playing={true}
            onProgress={handleProgress}
            onDuration={handleDuration}
            progressInterval={1000}
          />
        </div>
      </div>
    </div>
  );
};

export default UserVideoModal;





