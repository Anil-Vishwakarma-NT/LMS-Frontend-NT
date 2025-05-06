import React, { useEffect, useState, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import { updateContentProgress } from "../../../service/UserCourseService";
import "../../admin/booksAdmin/PDFReaderModal.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`;

const UserPDFReaderModal = ({ isOpen, pdfUrl, onClose, userId = 2, contentId, courseId }) => {
  const canvasRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  let activeRenderTask = null;

  useEffect(() => {
    if (isOpen && pdfUrl) {
      loadPDF(pdfUrl);
    }
  }, [isOpen, pdfUrl]);

  useEffect(() => {
    if (numPages) {
      loadPDF(pdfUrl);
    }
  }, [currentPage]); // ✅ Ensures re-render when page changes

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
      const modalWidth = window.innerWidth * (isFullscreen ? 0.95 : 0.8); // ✅ Adjust for fullscreen mode
      const viewport = page.getViewport({ scale: modalWidth / page.getViewport({ scale: 1 }).width });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // ✅ Cancel previous render task before starting new one
      if (activeRenderTask) {
        activeRenderTask.cancel();
      }

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

  const nextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

const toggleFullscreen = () => {
  const modal = document.querySelector(".modal-overlay");

  if (!document.fullscreenElement) {
    modal.requestFullscreen().catch(err => {
      console.error("❌ Fullscreen request failed:", err);
    });
  } else {
    document.exitFullscreen();
  }
};

  const handleClose = () => {
    let completionPercentage = (currentPage / numPages) * 100;
    if (completionPercentage >= 95 || numPages - currentPage <= 1) completionPercentage = 100;

    updateContentProgress(userId, contentId, courseId, currentPage, completionPercentage, "pdf");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={isFullscreen ? "fullscreen-overlay" : "modal-overlay"}>
<div className="modal-content">
<div className="top-bar">
    <button onClick={toggleFullscreen}>{isFullscreen ? "↙ Exit Fullscreen" : "↗ Fullscreen"}</button>
    <button className="close-button" onClick={handleClose}>✖ Close</button>
</div>
  <div className="pdf-viewer-container">
    <canvas ref={canvasRef}></canvas>
  </div>
  <div className="pdf-controls">  
    <button onClick={prevPage} disabled={currentPage === 1}>⬅ Previous</button>
    <button onClick={nextPage} disabled={currentPage === numPages}>Next ➡</button>
  </div>
</div>
    </div>
  );
};

export default UserPDFReaderModal;