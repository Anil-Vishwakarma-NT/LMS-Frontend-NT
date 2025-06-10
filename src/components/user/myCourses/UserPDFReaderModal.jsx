// import React, { useEffect, useState, useRef } from "react";
// import * as pdfjs from "pdfjs-dist";
// import { updateContentProgress } from "../../../service/UserCourseService";
// import "../../admin/booksAdmin/PDFReaderModal.css";
// import { useSelector } from "react-redux";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`;

// const UserPDFReaderModal = ({
//   isOpen,
//   pdfUrl,
//   onClose,
//   contentId,
//   courseId,
//   blockTime = 30, // default to 30 seconds if not provided
// }) => {
//   const canvasRef = useRef(null);
//   const [numPages, setNumPages] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [remainingTime, setRemainingTime] = useState(blockTime);
//   const [timerActive, setTimerActive] = useState(true);
//   const userId = useSelector(state => state.auth.userId);

//   let activeRenderTask = null;

//   // Reset timer and page state when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setCurrentPage(1);
//       setRemainingTime(blockTime);
//       setTimerActive(true);
//     } else {
//       setTimerActive(false); // stop timer if modal closes
//     }
//   }, [isOpen, blockTime]);

//   // Pause/resume timer on tab visibility change
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       setTimerActive(document.visibilityState === "visible");
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, []);

//   // Timer countdown
//   useEffect(() => {
//     let timer;
//     if (timerActive && remainingTime > 0) {
//       timer = setInterval(() => {
//         setRemainingTime((prev) => Math.max(0, prev - 1));
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [timerActive, remainingTime]);

//   const loadPDF = async (url) => {
//     try {
//       const loadingTask = pdfjs.getDocument(url);
//       const pdf = await loadingTask.promise;
//       setNumPages(pdf.numPages);
//       renderPage(pdf, currentPage);
//     } catch (error) {
//       console.error("❌ Error loading PDF:", error);
//     }
//   };

//   const renderPage = async (pdf, pageNumber) => {
//     try {
//       const page = await pdf.getPage(pageNumber);
//       const modalWidth = window.innerWidth * (isFullscreen ? 0.95 : 0.8);
//       const viewport = page.getViewport({ scale: modalWidth / page.getViewport({ scale: 1 }).width });

//       const canvas = canvasRef.current;
//       const context = canvas.getContext("2d");

//       if (activeRenderTask) activeRenderTask.cancel();

//       context.clearRect(0, 0, canvas.width, canvas.height);
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       activeRenderTask = page.render({ canvasContext: context, viewport });
//       await activeRenderTask.promise;

//       activeRenderTask = null;
//     } catch (error) {
//       console.error("❌ Error rendering page:", error);
//     }
//   };

//   useEffect(() => {
//     if (isOpen && pdfUrl) loadPDF(pdfUrl);
//   }, [isOpen, pdfUrl]);

//   useEffect(() => {
//     if (numPages) loadPDF(pdfUrl);
//   }, [currentPage]);

//   const nextPage = () => {
//     if (currentPage < numPages) setCurrentPage((prev) => prev + 1);
//   };

//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage((prev) => prev - 1);
//   };

//   const toggleFullscreen = () => {
//     const modal = document.querySelector(".modal-overlay");
//     if (!document.fullscreenElement) {
//       modal?.requestFullscreen().catch((err) => {
//         console.error("❌ Fullscreen request failed:", err);
//       });
//     } else {
//       document.exitFullscreen();
//     }
//   };

//   const handleClose = () => {
//     let completionPercentage = (currentPage / numPages) * 100;
//     if (completionPercentage >= 95 || numPages - currentPage <= 1) completionPercentage = 100;

//     updateContentProgress(userId, contentId, courseId, currentPage, completionPercentage, "pdf");
//     onClose();
//   };

//   const isCloseDisabled = remainingTime > 0;

//   if (!isOpen) return null;

//   return (
//     <div className={isFullscreen ? "fullscreen-overlay" : "modal-overlay"}>
//       <div className="modal-content">
//         <div className="top-bar">
//           <button onClick={toggleFullscreen}>
//             {isFullscreen ? "↙ Exit Fullscreen" : "↗ Fullscreen"}
//           </button>
//           <button className={`close-button ${isCloseDisabled ? "disabled" : ""}`} onClick={handleClose} disabled={isCloseDisabled}>
//             ✖ Close
//           </button>
//         </div>

//         {/* Timer Display */}
//         {isCloseDisabled && (
//           <div className="timer-section">
//             <p>{`You can close the window in ${remainingTime} seconds`}</p>
//           </div>
//         )}

//         <div className="pdf-viewer-container">
//           <canvas ref={canvasRef}></canvas>
//         </div>

//         <div className="pdf-controls">
//           <button onClick={prevPage} disabled={currentPage === 1}>⬅ Previous</button>
//           <button onClick={nextPage} disabled={currentPage === numPages}>Next ➡</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserPDFReaderModal;




import React, { useEffect, useState, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import { Modal, Button } from "antd";
import { useSelector } from "react-redux";
import { updateContentProgress } from "../../../service/UserCourseService";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`;

const UserPDFReaderModal = ({
  isOpen,
  pdfUrl,
  onClose,
  contentId,
  courseId,
  blockTime = 30, // default 30s
}) => {
  const canvasRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(blockTime);
  const [timerActive, setTimerActive] = useState(true);
  const userId = useSelector((state) => state.auth.userId);

  let activeRenderTask = null;

  // Reset timer and page on open
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setRemainingTime(blockTime);
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [isOpen, blockTime]);

  // Pause timer on tab hidden
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
      timer = setInterval(() => {
        setRemainingTime((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, remainingTime]);

  // Load PDF and render page
  const loadPDF = async (url) => {
    try {
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);
      renderPage(pdf, currentPage);
    } catch (error) {
      console.error("❌ Error loading PDF:", error);
    }
  };

  const renderPage = async (pdf, pageNumber) => {
    try {
      const page = await pdf.getPage(pageNumber);
      const modalWidth = window.innerWidth * (isFullScreen ? 0.95 : 0.8);
      const viewport = page.getViewport({
        scale: modalWidth / page.getViewport({ scale: 1 }).width,
      });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (activeRenderTask) activeRenderTask.cancel();

      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      activeRenderTask = page.render({ canvasContext: context, viewport });
      await activeRenderTask.promise;
      activeRenderTask = null;
    } catch (error) {
      console.error("❌ Error rendering page:", error);
    }
  };

  // Load PDF on open or page change
  useEffect(() => {
    if (isOpen && pdfUrl) loadPDF(pdfUrl);
  }, [isOpen, pdfUrl]);

  useEffect(() => {
    if (numPages) loadPDF(pdfUrl);
  }, [currentPage]);

  // Page navigation
  const nextPage = () => {
    if (currentPage < numPages) setCurrentPage((p) => p + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Toggle fullscreen mode (adjust modal size & styles)
  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  // Handle close - update progress then close
  const handleClose = () => {
    let completionPercentage = (currentPage / numPages) * 100;
    if (completionPercentage >= 95 || numPages - currentPage <= 1) completionPercentage = 100;

    updateContentProgress(userId, contentId, courseId, currentPage, completionPercentage, "pdf");
    onClose();
  };

  const isCloseDisabled = remainingTime > 0;

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
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
            onClick={handleClose}
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

      {/* PDF Canvas Container */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "#1e1e1e",
          padding: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
      </div>

      {/* Page navigation buttons */}
      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid #333",
          display: "flex",
          justifyContent: "center",
          gap: 12,
          background: "#2c2c2c",
        }}
      >
        <Button onClick={prevPage} disabled={currentPage === 1} size="small">
          ⬅ Previous
        </Button>
        <Button onClick={nextPage} disabled={currentPage === numPages} size="small">
          Next ➡
        </Button>
      </div>
    </Modal>
  );
};

export default UserPDFReaderModal;
