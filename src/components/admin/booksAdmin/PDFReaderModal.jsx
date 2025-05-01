import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css"; // Core styles
import "./PDFReaderModal.css"; // Custom styling

const PDFReaderModal = ({ isOpen, pdfUrl, onClose, blockTime }) => {
  const [remainingTime, setRemainingTime] = useState(blockTime);
  const [timerActive, setTimerActive] = useState(true);

  // Reset the timer whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setRemainingTime(blockTime); // Reset timer to the original block time
      setTimerActive(true); // Ensure timer is active
    }
  }, [isOpen, blockTime]);

  // Handle tab visibility (pause and resume timer)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setTimerActive(false); // Pause timer
      } else {
        setTimerActive(true); // Resume timer
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Timer logic: decrement remainingTime every second if active
  useEffect(() => {
    let timer;
    if (timerActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, remainingTime]);

  // Disable close button until the timer ends
  const isCloseDisabled = remainingTime > 0;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Timer Display */}
        <div className="timer-section">
          <p>{`You can close the window in ${remainingTime} seconds`}</p>
        </div>

        {/* Close Button */}
        <button
          className={`close-button ${isCloseDisabled ? "disabled" : ""}`}
          onClick={onClose}
          disabled={isCloseDisabled}
        >
          ✖ Close
        </button>

        {/* PDF Viewer */}
        <div className="pdf-viewer-container">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
            <Viewer fileUrl={pdfUrl} />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PDFReaderModal;