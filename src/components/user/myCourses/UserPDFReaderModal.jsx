import React, { useEffect, useState, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import { Modal, Button } from "antd";
import { useSelector } from "react-redux";
import { updateContentProgress } from "../../../service/UserCourseService";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

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
