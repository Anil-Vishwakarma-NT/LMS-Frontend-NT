// import React, { useEffect, useState } from "react";
// import { Modal, Button, Dropdown, Menu } from "antd";
// import { Viewer, Worker } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "./PDFReaderModal.css";

// const PDFReaderModal = ({
//   isOpen,
//   pdfUrl,
//   onClose,
//   blockTime,
//   showDownload = false,
//   onDownloadPdf = () => {},
//   onDownloadExcel = () => {}
// }) => {
//   const effectiveBlockTime = typeof blockTime === "number" ? blockTime : 10;
//   const isBlockingEnabled = effectiveBlockTime > 0;

//   const [remainingTime, setRemainingTime] = useState(effectiveBlockTime);
//   const [timerActive, setTimerActive] = useState(isBlockingEnabled);
//   const [isFullScreen, setIsFullScreen] = useState(false);

//   useEffect(() => {
//     if (isOpen && isBlockingEnabled) {
//       setRemainingTime(effectiveBlockTime);
//       setTimerActive(true);
//     } else if (isOpen && !isBlockingEnabled) {
//       setRemainingTime(0);
//       setTimerActive(false);
//     }
//   }, [isOpen, effectiveBlockTime, isBlockingEnabled]);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (isBlockingEnabled) {
//         setTimerActive(document.visibilityState === "visible");
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, [isBlockingEnabled]);

//   useEffect(() => {
//     let timer;
//     if (timerActive && isBlockingEnabled && remainingTime > 0) {
//       timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
//     }
//     return () => clearInterval(timer);
//   }, [timerActive, remainingTime, isBlockingEnabled]);

//   useEffect(() => {
//     if (isOpen) {
//       setIsFullScreen(false); 
//     }
//   }, [isOpen]);

//   const isCloseDisabled = isBlockingEnabled && remainingTime > 0;
//   const toggleFullScreen = () => setIsFullScreen((prev) => !prev);

//   if (!isOpen) return null;

//   const downloadMenu = (
//     <Menu>
//       <Menu.Item key="pdf" onClick={onDownloadPdf}>
//         Download as PDF
//       </Menu.Item>
//       <Menu.Item key="excel" onClick={onDownloadExcel}>
//         Download as Excel
//       </Menu.Item>
//     </Menu>
//   );

//   return (
//     <Modal
//       open={isOpen}
//       onCancel={onClose}
//       footer={null}
//       centered
//       width={isFullScreen ? "100vw" : 900}
//       bodyStyle={{
//         height: isFullScreen ? "100vh" : "80vh",
//         padding: 0,
//         display: "flex",
//         flexDirection: "column",
//         backgroundColor: "#1e1e1e",
//         color: "#f0f0f0",
//       }}
//       style={{ top: isFullScreen ? 0 : undefined, padding: 0 }}
//       maskStyle={{ backgroundColor: "rgba(0,0,0,0.85)" }}
//       destroyOnClose
//     >
//       <div
//         style={{
//           padding: "12px 16px",
//           borderBottom: "1px solid #333",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           background: "#2c2c2c",
//           color: "#f0f0f0",
//           userSelect: "none",
//         }}
//       >
//         <div>{isBlockingEnabled ? null : "PDF Viewer"}</div>

//         <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
//           {showDownload && (
//             <Dropdown overlay={downloadMenu} placement="bottomRight">
//               <Button
//                 size="small"
//                 type="default"
//                 style={{ color: "#000000", borderColor: "#555" }}
//               >
//                 Download
//               </Button>
//             </Dropdown>
//           )}
//           <Button
//             onClick={toggleFullScreen}
//             size="small"
//             type="default"
//             style={{ color: "#000000", borderColor: "#555" }}
//           >
//             {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
//           </Button>
//           <Button
//             onClick={onClose}
//             size="small"
//             type="primary"
//             danger
//             disabled={isCloseDisabled}
//             style={{ opacity: isCloseDisabled ? 0.5 : 1 }}
//           >
//             Close
//           </Button>
//         </div>
//       </div>

//       <div
//         style={{
//           flex: 1,
//           overflow: "hidden",
//           backgroundColor: "#1e1e1e",
//         }}
//       >
//         <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
//           <Viewer fileUrl={pdfUrl} defaultScale={1.5} />
//         </Worker>
//       </div>
//     </Modal>
//   );
// };

// export default PDFReaderModal;

import React, { useEffect, useState } from "react";
import { Modal, Button, Dropdown, Menu, Spin, message } from "antd";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { app } from "../../../service/serviceLMS";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "./PDFReaderModal.css";
import axios from "axios";

const PDFReaderModal = ({
  isOpen,
  fileName,
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
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Fetch PDF file from S3 streaming API with proper chunked handling
  useEffect(() => {
    const fetchPdfFromS3 = async () => {
      if (!fileName || !isOpen) return;

      setLoading(true);
      setLoadingProgress(0);
      
      try {
        const streamingUrl = `http://localhost:8080/api/service-api/streaming/pdf/${fileName}`;
        
        // First, get file metadata to determine total size
        let totalSize = 0;
        try {
          const metadataResponse = await axios.get(`http://localhost:8080/api/service-api/streaming/metadata/${fileName}`, {
            timeout: 10000
          });
          totalSize = metadataResponse.data.size;
        } catch (metaError) {
          console.warn("Could not fetch file metadata:", metaError);
        }

        // Use fetch API with no Range header to get the full file
        // The backend will handle this as a full file request
        const response = await fetch(streamingUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Read the response as array buffer with progress tracking
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Response body is not readable");
        }

        const chunks = [];
        let receivedLength = 0;

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          chunks.push(value);
          receivedLength += value.length;
          
          // Update progress if we know total size
          if (totalSize > 0) {
            const progress = Math.round((receivedLength / totalSize) * 100);
            setLoadingProgress(progress);
          }
        }

        // Combine chunks into single Uint8Array
        const allChunks = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
          allChunks.set(chunk, position);
          position += chunk.length;
        }

        // Create blob and URL
        const pdfBlob = new Blob([allChunks], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(blobUrl);
        setLoadingProgress(100);

      } catch (err) {
        console.error("PDF fetch error:", err);
        
        // Enhanced error handling
        if (err.name === 'AbortError') {
          message.error("Request was cancelled.");
        } else if (err.message.includes('Failed to fetch')) {
          message.error("Network error. Please check your connection.");
        } else if (err.message.includes('404')) {
          message.error("PDF file not found.");
        } else if (err.message.includes('500')) {
          message.error("Server error while loading PDF.");
        } else {
          message.error("Failed to load PDF file. Please try again.");
        }
      } finally {
        setLoading(false);
        setLoadingProgress(0);
      }
    };

    fetchPdfFromS3();

    // Cleanup on modal close or fileName change
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
    };
  }, [fileName, isOpen]);

  // Alternative method using axios with proper range handling disabled
  const fetchPdfWithAxios = async () => {
    if (!fileName || !isOpen) return;

    setLoading(true);
    setLoadingProgress(0);
    
    try {
      const streamingUrl = `http://localhost:8080/api/service-api/streaming/pdf/${fileName}`;
      
      // Use axios with responseType blob and no range headers
      const response = await axios.get(streamingUrl, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          'Cache-Control': 'no-cache'
        },
        timeout: 60000, // 60 seconds for large files
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setLoadingProgress(progress);
          }
        }
      });

      // Create blob URL from response
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfBlobUrl(blobUrl);
      setLoadingProgress(100);

    } catch (err) {
      console.error("PDF axios fetch error:", err);
      
      if (err.code === 'ECONNABORTED') {
        message.error("Request timeout. The PDF file might be too large.");
      } else if (err.response?.status === 404) {
        message.error("PDF file not found.");
      } else if (err.response?.status === 500) {
        message.error("Server error while loading PDF.");
      } else {
        message.error("Failed to load PDF file. Please try again.");
      }
    } finally {
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  // Timer effects (unchanged)
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
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
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

  // Enhanced download handlers
  const handleDownloadPdf = async () => {
    try {
      const streamingUrl = `http://localhost:8080/api/service-api/streaming/pdf/${fileName}`;
      const response = await axios.get(streamingUrl, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          'Cache-Control': 'no-cache'
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      message.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      message.error("Failed to download PDF.");
    }
  };

  const isCloseDisabled = isBlockingEnabled && remainingTime > 0;
  const toggleFullScreen = () => setIsFullScreen((prev) => !prev);

  if (!isOpen) return null;

  const downloadMenu = (
    <Menu>
      <Menu.Item key="pdf" onClick={handleDownloadPdf}>
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
        <div>
          {isBlockingEnabled ? (
            <span>
              PDF Viewer {remainingTime > 0 && `(Close in ${remainingTime}s)`}
            </span>
          ) : (
            "PDF Viewer"
          )}
        </div>

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
            Close {remainingTime > 0 && `(${remainingTime}s)`}
          </Button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "hidden",
          backgroundColor: "#1e1e1e",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spin tip={`Loading PDF... ${loadingProgress > 0 ? loadingProgress + '%' : ''}`} size="large" />
            <div style={{ color: "#fff", marginTop: 16 }}>
              Streaming PDF from S3...
              {loadingProgress > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ 
                    width: '200px', 
                    height: '4px', 
                    background: '#333', 
                    borderRadius: '2px',
                    margin: '0 auto',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${loadingProgress}%`,
                      height: '100%',
                      background: '#1890ff',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : pdfBlobUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{ width: "100%", height: "100%" }}>
              <Viewer 
                fileUrl={pdfBlobUrl} 
                defaultScale={1.2}
                onDocumentLoadSuccess={() => {
                  console.log("PDF loaded successfully");
                }}
                onDocumentLoadFailure={(error) => {
                  console.error("PDF load failed:", error);
                  message.error("Failed to render PDF");
                }}
              />
            </div>
          </Worker>
        ) : (
          <div style={{ color: "#fff", textAlign: "center" }}>
            <div>No PDF loaded</div>
            <Button 
              onClick={() => fetchPdfWithAxios()} 
              style={{ marginTop: 16 }}
              type="primary"
            >
              Retry Loading
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PDFReaderModal;