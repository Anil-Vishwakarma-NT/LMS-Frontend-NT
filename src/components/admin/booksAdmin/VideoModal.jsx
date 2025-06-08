// import React from "react";
// import ReactPlayer from "react-player";
// import "./VideoModal.css";

// const VideoModal = ({ isOpen, videoUrl, onClose }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <button className="close-button" onClick={onClose}>
//           ✖ Close
//         </button>
//         <div className="player-container">
//           <ReactPlayer
//             url={videoUrl}
//             controls
//             width="100%"
//             height="400px"
//             playing={true} // Video auto-plays when modal opens
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoModal;

import React from "react";
import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";

const VideoModal = ({ isOpen, videoUrl, onClose }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      closeIcon={<CloseOutlined style={{ fontSize: 18, color: "#000" }} />}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
    >
      <div style={{ position: "relative", paddingTop: "56.25%" /* 16:9 ratio */ }}>
        <ReactPlayer
          url={videoUrl}
          controls
          playing
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>
    </Modal>
  );
};

export default VideoModal;
