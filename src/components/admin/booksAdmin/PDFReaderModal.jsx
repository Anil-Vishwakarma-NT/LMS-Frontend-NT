// import React, { useEffect, useState } from "react";
// import { Viewer, Worker } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css"; // Core styles
// import "./PDFReaderModal.css"; // Custom styling

// const PDFReaderModal = ({ isOpen, pdfUrl, onClose, blockTime }) => {
//   const [remainingTime, setRemainingTime] = useState(blockTime);
//   const [timerActive, setTimerActive] = useState(true);

//   // Reset the timer whenever the modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setRemainingTime(blockTime); // Reset timer to the original block time
//       setTimerActive(true); // Ensure timer is active
//     }
//   }, [isOpen, blockTime]);

//   // Handle tab visibility (pause and resume timer)
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "hidden") {
//         setTimerActive(false); // Pause timer
//       } else {
//         setTimerActive(true); // Resume timer
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, []);

//   // Timer logic: decrement remainingTime every second if active
//   useEffect(() => {
//     let timer;
//     if (timerActive && remainingTime > 0) {
//       timer = setInterval(() => {
//         setRemainingTime((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [timerActive, remainingTime]);

//   // Disable close button until the timer ends
//   const isCloseDisabled = remainingTime > 0;

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         {/* Timer Display */}
//         <div className="timer-section">
//           <p>{`You can close the window in ${remainingTime} seconds`}</p>
//         </div>

//         {/* Close Button */}
//         <button
//           className={`close-button ${isCloseDisabled ? "disabled" : ""}`}
//           onClick={onClose}
//           disabled={isCloseDisabled}
//         >
//           ✖ Close
//         </button>

//         {/* PDF Viewer */}
//         <div className="pdf-viewer-container">
//           <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
//             <Viewer fileUrl={pdfUrl} />
//           </Worker>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PDFReaderModal;

import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css"; // Core styles
import "./PDFReaderModal.css"; // Your custom styles (optional)

const PDFReaderModal = ({ isOpen, pdfUrl, onClose, blockTime }) => {
  const [remainingTime, setRemainingTime] = useState(blockTime);
  const [timerActive, setTimerActive] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setRemainingTime(blockTime);
      setTimerActive(true);
    }
  }, [isOpen, blockTime]);

  // Handle tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTimerActive(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Timer countdown
  useEffect(() => {
    let timer;
    if (timerActive && remainingTime > 0) {
      timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, remainingTime]);

  const isCloseDisabled = remainingTime > 0;

  // Toggle fullscreen mode
  const toggleFullScreen = () => setIsFullScreen((prev) => !prev);

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={isFullScreen ? "100vw" : 900}
      bodyStyle={{
        height: isFullScreen ? "100vh" : "80vh",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1e1e1e",
        color: "#f0f0f0",
      }}
      style={{ top: isFullScreen ? 0 : undefined, padding: 0 }}
      maskStyle={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      destroyOnClose
    >
      {/* Header with timer, fullscreen toggle and close */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#2c2c2c",
          color: "#f0f0f0",
          userSelect: "none",
        }}
      >
        <div>
          {`You can close the window in ${remainingTime} second${remainingTime !== 1 ? "s" : ""}`}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button
            onClick={toggleFullScreen}
            size="small"
            type="default"
            style={{ color: "#000000", borderColor: "#555" }}
          >
            {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
          <Button
            onClick={onClose}
            size="small"
            type="primary"
            danger
            disabled={isCloseDisabled}
            style={{ opacity: isCloseDisabled ? 0.5 : 1 }}
          >
            Close
          </Button>
        </div>
      </div>

      {/* PDF Viewer Container */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "#1e1e1e",
          padding: 12,
        }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
          <Viewer fileUrl={pdfUrl} />
        </Worker>
      </div>
    </Modal>
  );
};

export default PDFReaderModal;
