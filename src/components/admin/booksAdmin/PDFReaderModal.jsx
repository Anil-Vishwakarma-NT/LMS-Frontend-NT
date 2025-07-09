import React, { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Menu } from "antd";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "./PDFReaderModal.css";

const PDFReaderModal = ({
  isOpen,
  pdfUrl,
  onClose,
  blockTime,
  showDownload = false,
  onDownloadPdf = () => {},
  onDownloadExcel = () => {}
}) => {
  const effectiveBlockTime = typeof blockTime === "number" ? blockTime : 10;
  const isBlockingEnabled = effectiveBlockTime > 0;

  const [remainingTime, setRemainingTime] = useState(effectiveBlockTime);
  const [timerActive, setTimerActive] = useState(isBlockingEnabled);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (isOpen && isBlockingEnabled) {
      setRemainingTime(effectiveBlockTime);
      setTimerActive(true);
    } else if (isOpen && !isBlockingEnabled) {
      setRemainingTime(0);
      setTimerActive(false);
    }
  }, [isOpen, effectiveBlockTime, isBlockingEnabled]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isBlockingEnabled) {
        setTimerActive(document.visibilityState === "visible");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isBlockingEnabled]);

  useEffect(() => {
    let timer;
    if (timerActive && isBlockingEnabled && remainingTime > 0) {
      timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, remainingTime, isBlockingEnabled]);

  useEffect(() => {
    if (isOpen) {
      setIsFullScreen(false); 
    }
  }, [isOpen]);

  const isCloseDisabled = isBlockingEnabled && remainingTime > 0;
  const toggleFullScreen = () => setIsFullScreen((prev) => !prev);

  if (!isOpen) return null;

  const downloadMenu = (
    <Menu>
      <Menu.Item key="pdf" onClick={onDownloadPdf}>
        Download as PDF
      </Menu.Item>
      <Menu.Item key="excel" onClick={onDownloadExcel}>
        Download as Excel
      </Menu.Item>
    </Menu>
  );

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
        <div>{isBlockingEnabled ? null : "PDF Viewer"}</div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {showDownload && (
            <Dropdown overlay={downloadMenu} placement="bottomRight">
              <Button
                size="small"
                type="default"
                style={{ color: "#000000", borderColor: "#555" }}
              >
                Download
              </Button>
            </Dropdown>
          )}
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

      <div
        style={{
          flex: 1,
          overflow: "hidden",
          backgroundColor: "#1e1e1e",
        }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={pdfUrl} defaultScale={1.5} />
        </Worker>
      </div>
    </Modal>
  );
};

export default PDFReaderModal;
