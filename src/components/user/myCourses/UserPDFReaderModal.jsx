// import React, { useEffect, useState, useRef } from "react";
// import * as pdfjs from "pdfjs-dist";
// import { Modal, Button } from "antd";
// import { useSelector } from "react-redux";
// import { updateContentProgress } from "../../../service/UserCourseService";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

// const UserPDFReaderModal = ({
//   isOpen,
//   pdfUrl,
//   onClose,
//   contentId,
//   courseId,
//   blockTime = 30, // default 30s
// }) => {
//   const canvasRef = useRef(null);
//   const [numPages, setNumPages] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [remainingTime, setRemainingTime] = useState(blockTime);
//   const [timerActive, setTimerActive] = useState(true);
//   const storedUserId = localStorage.getItem("userId");
//   const userId = useSelector((state) => state.auth.userId) || storedUserId;
  
//   let activeRenderTask = null;

//   // Reset timer and page on open
//   useEffect(() => {
//     if (isOpen) {
//       setCurrentPage(1);
//       setRemainingTime(blockTime);
//       setTimerActive(true);
//     } else {
//       setTimerActive(false);
//     }
//   }, [isOpen, blockTime]);

//   // Pause timer on tab hidden
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

//   // Load PDF and render page
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
//       const modalWidth = window.innerWidth * (isFullScreen ? 0.95 : 0.8);
//       const viewport = page.getViewport({
//         scale: modalWidth / page.getViewport({ scale: 1 }).width,
//       });

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

//   // Load PDF on open or page change
//   useEffect(() => {
//     if (isOpen && pdfUrl) loadPDF(pdfUrl);
//   }, [isOpen, pdfUrl]);

//   useEffect(() => {
//     if (numPages) loadPDF(pdfUrl);
//   }, [currentPage]);

//   // Page navigation
//   const nextPage = () => {
//     if (currentPage < numPages) setCurrentPage((p) => p + 1);
//   };
//   const prevPage = () => {
//     if (currentPage > 1) setCurrentPage((p) => p - 1);
//   };

//   // Toggle fullscreen mode (adjust modal size & styles)
//   const toggleFullScreen = () => {
//     setIsFullScreen((prev) => !prev);
//   };

//   // Handle close - update progress then close
//   const handleClose = () => {
//     let completionPercentage = (currentPage / numPages) * 100;
//     if (completionPercentage >= 95 || numPages - currentPage <= 1) completionPercentage = 100;

//     updateContentProgress(userId, contentId, courseId, currentPage, completionPercentage, "pdf");
//     onClose();
//   };

//   const isCloseDisabled = remainingTime > 0;

//   if (!isOpen) return null;

//   return (
//     <Modal
//       open={isOpen}
//       onCancel={handleClose}
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
//       {/* Header with timer, fullscreen toggle and close */}
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
//         <div>
//           {`You can close the window in ${remainingTime} second${remainingTime !== 1 ? "s" : ""}`}
//         </div>
//         <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
//           <Button
//             onClick={toggleFullScreen}
//             size="small"
//             type="default"
//             style={{ color: "#000000", borderColor: "#555" }}
//           >
//             {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
//           </Button>
//           <Button
//             onClick={handleClose}
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

//       {/* PDF Canvas Container */}
//       <div
//         style={{
//           flex: 1,
//           overflow: "auto",
//           backgroundColor: "#1e1e1e",
//           padding: 12,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
//       </div>

//       {/* Page navigation buttons */}
//       <div
//         style={{
//           padding: "10px 16px",
//           borderTop: "1px solid #333",
//           display: "flex",
//           justifyContent: "center",
//           gap: 12,
//           background: "#2c2c2c",
//         }}
//       >
//         <Button onClick={prevPage} disabled={currentPage === 1} size="small">
//           ⬅ Previous
//         </Button>
//         <Button onClick={nextPage} disabled={currentPage === numPages} size="small">
//           Next ➡
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default UserPDFReaderModal;


import React, { useEffect, useState, useRef } from "react";
import * as pdfjs from "pdfjs-dist";
import { Modal, Button, Spin, message } from "antd";
import { useSelector } from "react-redux";
import { updateContentProgress } from "../../../service/UserCourseService";
import axios from "axios";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const UserPDFReaderModal = ({
  isOpen,
  fileName, // Changed from pdfUrl to fileName
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
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const storedUserId = localStorage.getItem("userId");
  const userId = useSelector((state) => state.auth.userId) || storedUserId;
  
  let activeRenderTask = null;

  // Fetch PDF file from S3 streaming API
  useEffect(() => {
    console.log("🔍 useEffect triggered - isOpen:", isOpen, "fileName:", fileName);
    
    const fetchPdfFromS3 = async () => {
      if (!fileName || !isOpen) {
        console.log("❌ Not fetching - fileName:", fileName, "isOpen:", isOpen);
        return;
      }

      console.log("🚀 Starting PDF fetch process...");
      setLoading(true);
      setLoadingProgress(0);
      setError(null);
      
      // Clear any existing blob URL
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
      }
      
      try {
        const streamingUrl = `http://localhost:8080/api/service-api/streaming/pdf/${fileName}`;
        console.log("🔄 Fetching PDF from:", streamingUrl);
        
        // First, get file metadata to determine total size
        let totalSize = 0;
        try {
          const metadataUrl = `http://localhost:8080/api/service-api/streaming/metadata/${fileName}`;
          console.log("📊 Fetching metadata from:", metadataUrl);
          const metadataResponse = await axios.get(metadataUrl, {
            timeout: 10000
          });
          totalSize = metadataResponse.data.size;
          console.log("📊 File size:", totalSize, "bytes");
        } catch (metaError) {
          console.warn("Could not fetch file metadata:", metaError);
        }

        // Use axios with responseType blob and no range headers
        console.log("📡 Making main PDF request...");
        const response = await axios.get(streamingUrl, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf',
            'Cache-Control': 'no-cache'
          },
          timeout: 60000, // 60 seconds for large files
          onDownloadProgress: (progressEvent) => {
            console.log("📈 Download progress:", progressEvent.loaded, "/", progressEvent.total || totalSize);
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
              setLoadingProgress(progress);
            } else if (totalSize > 0) {
              const progress = Math.round((progressEvent.loaded / totalSize) * 100);
              setLoadingProgress(Math.min(progress, 99)); // Cap at 99% until complete
            }
          }
        });

        console.log("✅ PDF response received. Size:", response.data.size, "Type:", response.data.type);

        // Create blob URL from response
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(blobUrl);
        setLoadingProgress(100);
        console.log("✅ PDF blob created successfully. Blob URL:", blobUrl);

      } catch (err) {
        console.error("❌ PDF fetch error:", err);
        console.error("❌ Error response:", err.response);
        console.error("❌ Error config:", err.config);
        
        let errorMessage = "Failed to load PDF file. Please try again.";
        
        if (err.code === 'ECONNABORTED') {
          errorMessage = "Request timeout. The PDF file might be too large.";
        } else if (err.response?.status === 404) {
          errorMessage = "PDF file not found.";
        } else if (err.response?.status === 500) {
          errorMessage = "Server error while loading PDF.";
        } else if (err.message.includes('Network Error')) {
          errorMessage = "Network error. Please check your connection.";
        }
        
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
        setLoadingProgress(0);
      }
    };

    fetchPdfFromS3();
  }, [fileName, isOpen]); // Removed pdfBlobUrl from dependencies

  // Cleanup blob URL when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        console.log("🧹 Cleaning up blob URL:", pdfBlobUrl);
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

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

  // Load PDF and render page when blob URL is available
  const loadPDF = async (blobUrl) => {
    try {
      if (!blobUrl) return;

      console.log("🔄 Loading PDF from blob URL");
      const loadingTask = pdfjs.getDocument({
        url: blobUrl,
        disableRange: false,
        disableStream: false,
      });
      
      const pdf = await loadingTask.promise;
      console.log("✅ PDF loaded successfully. Pages:", pdf.numPages);
      setNumPages(pdf.numPages);
      await renderPage(pdf, currentPage);
    } catch (error) {
      console.error("❌ Error loading PDF:", error);
      setError("Failed to render PDF document");
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
      if (!canvas) return;
      
      const context = canvas.getContext("2d");

      if (activeRenderTask) activeRenderTask.cancel();

      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      activeRenderTask = page.render({ canvasContext: context, viewport });
      await activeRenderTask.promise;
      activeRenderTask = null;
      console.log("✅ Page", pageNumber, "rendered successfully");
    } catch (error) {
      if (error.name !== 'RenderingCancelledException') {
        console.error("❌ Error rendering page:", error);
      }
    }
  };

  // Load PDF when blob URL is available
  useEffect(() => {
    if (pdfBlobUrl && !loading) {
      loadPDF(pdfBlobUrl);
    }
  }, [pdfBlobUrl, loading]);

  // Re-render when page changes
  useEffect(() => {
    if (numPages && pdfBlobUrl && !loading) {
      loadPDF(pdfBlobUrl);
    }
  }, [currentPage]);

  // Page navigation
  const nextPage = () => {
    if (currentPage < numPages) setCurrentPage((p) => p + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  // Retry loading PDF
  const retryLoading = () => {
    console.log("🔄 Manual retry triggered");
    setError(null);
    setPdfBlobUrl(null);
    setLoading(false);
    
    // Force re-fetch by toggling a dependency
    setTimeout(() => {
      if (fileName && isOpen) {
        console.log("🔄 Triggering manual fetch for:", fileName);
        fetchPdfManually();
      }
    }, 100);
  };

  // Manual fetch function for debugging
  const fetchPdfManually = async () => {
    if (!fileName || !isOpen) {
      console.log("❌ Cannot fetch - fileName:", fileName, "isOpen:", isOpen);
      return;
    }

    console.log("🚀 Manual fetch starting...");
    setLoading(true);
    setLoadingProgress(0);
    setError(null);
    
    try {
      const streamingUrl = `http://localhost:8080/api/service-api/streaming/pdf/${fileName}`;
      console.log("🔄 Manual fetching PDF from:", streamingUrl);
      
      // Test the URL first
      console.log("🧪 Testing URL accessibility...");
      const testResponse = await fetch(streamingUrl, { method: 'HEAD' });
      console.log("🧪 HEAD response:", testResponse.status, testResponse.statusText);
      
      // Use axios with responseType blob
      console.log("📡 Making axios request...");
      const response = await axios.get(streamingUrl, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          'Cache-Control': 'no-cache'
        },
        timeout: 60000,
        onDownloadProgress: (progressEvent) => {
          console.log("📈 Progress:", progressEvent.loaded, "/", progressEvent.total);
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setLoadingProgress(progress);
          }
        }
      });

      console.log("✅ Response received:", response.status, response.statusText);
      console.log("✅ Response data size:", response.data.size, "Type:", response.data.type);

      // Create blob URL
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfBlobUrl(blobUrl);
      setLoadingProgress(100);
      console.log("✅ Blob URL created:", blobUrl);

    } catch (err) {
      console.error("❌ Manual fetch error:", err);
      console.error("❌ Error details:", {
        message: err.message,
        response: err.response,
        config: err.config,
        code: err.code
      });
      
      let errorMessage = "Failed to load PDF file. Please try again.";
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Check if backend is running.";
      } else if (err.response?.status === 404) {
        errorMessage = "PDF file not found on server.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error while loading PDF.";
      } else if (err.message.includes('Network Error')) {
        errorMessage = "Cannot connect to backend. Is it running on localhost:8080?";
      }
      
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  // Handle close - update progress then close
  const handleClose = () => {
    if (numPages && currentPage) {
      let completionPercentage = (currentPage / numPages) * 100;
      if (completionPercentage >= 95 || numPages - currentPage <= 1) completionPercentage = 100;

      updateContentProgress(userId, contentId, courseId, currentPage, completionPercentage, "pdf");
    }
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
          justifyContent: "center",
        }}
      >
        {loading && (
          <div style={{ textAlign: "center" }}>
            <Spin tip={`Loading PDF... ${loadingProgress > 0 ? loadingProgress + '%' : ''}`} size="large" />
            <div style={{ color: "#f0f0f0", marginTop: 16 }}>
              Streaming PDF from S3...
              <div style={{ marginTop: 8, fontSize: "12px", opacity: 0.7 }}>
                File: {fileName}
              </div>
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
        )}
        
        {error && (
          <div style={{ color: "#ff6b6b", textAlign: "center", padding: "20px" }}>
            <div>❌ Failed to load PDF</div>
            <div style={{ marginTop: 8, fontSize: "14px" }}>
              {error}
            </div>
            <div style={{ marginTop: 8, fontSize: "12px", opacity: 0.7 }}>
              File: {fileName}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: "8px", justifyContent: "center" }}>
              <Button onClick={retryLoading} type="primary">
                Retry Loading
              </Button>
              <Button 
                onClick={() => {
                  console.log("🔍 Debug Info:");
                  console.log("- fileName:", fileName);
                  console.log("- isOpen:", isOpen);
                  console.log("- loading:", loading);
                  console.log("- pdfBlobUrl:", pdfBlobUrl);
                  console.log("- Backend URL:", `http://localhost:8080/api/service-api/streaming/pdf/${fileName}`);
                  
                  // Test if backend is reachable
                  fetch(`http://localhost:8080/api/service-api/streaming/pdf/${fileName}`, { method: 'HEAD' })
                    .then(response => {
                      console.log("✅ Backend reachable:", response.status, response.statusText);
                    })
                    .catch(err => {
                      console.error("❌ Backend not reachable:", err);
                    });
                }} 
                type="default"
              >
                Debug Info
              </Button>
            </div>
          </div>
        )}
        
        {!loading && !error && !pdfBlobUrl && (
          <div style={{ color: "#f0f0f0", textAlign: "center", padding: "20px" }}>
            <div>No PDF loaded</div>
            <div style={{ marginTop: 8, fontSize: "12px", opacity: 0.7 }}>
              File: {fileName}
            </div>
            <Button 
              onClick={fetchPdfManually} 
              style={{ marginTop: 16 }}
              type="primary"
            >
              Load PDF Manually
            </Button>
          </div>
        )}
        
        {!loading && !error && pdfBlobUrl && (
          <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
        )}
      </div>

      {/* Page navigation buttons */}
      {!loading && !error && numPages && (
        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            background: "#2c2c2c",
          }}
        >
          <Button onClick={prevPage} disabled={currentPage === 1} size="small">
            ⬅ Previous
          </Button>
          
          <div style={{ color: "#f0f0f0", fontSize: "14px" }}>
            Page {currentPage} of {numPages}
          </div>
          
          <Button onClick={nextPage} disabled={currentPage === numPages} size="small">
            Next ➡
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default UserPDFReaderModal;