import React, { useEffect, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css"; // Core styles
import { updateContentProgress } from "../../../service/UserCourseService";
import "../../admin/booksAdmin/PDFReaderModal.css";

const UserPDFReaderModal = ({ isOpen, pdfUrl, onClose, userId = 2, contentId, courseId }) => {
  const [lastViewedPage, setLastViewedPage] = useState(0);

  // **Debug Log: When Modal Opens**
  useEffect(() => {
    if (isOpen) {
      console.log("📖 PDF Modal Opened: Resetting Last Viewed Page.");
      setLastViewedPage(0);
    }
  }, [isOpen]);

  // **Extract Full Metadata and Log All Attributes**
  const handleDocumentLoad = async (pdf) => {
    console.log("🚀 Document Load Event Triggered. PDF Object:", pdf);

    if (pdf?.getMetadata) {
        try {
            const metadata = await pdf.getMetadata();
            console.log("📜 PDF Metadata Extracted:", metadata);
        } catch (error) {
            console.error("❌ Error fetching PDF metadata:", error);
        }
    } else {
        console.warn("⚠ Metadata function not available on this PDF.");
    }

    console.log("🧐 Full PDF Object:", pdf); // ✅ Log the entire PDF object to inspect all available attributes
  };

  // **Track PDF Page Changes**
  const handlePageChange = (event) => {
    console.log("📄 User Navigated to Page:", event.currentPage);
    setLastViewedPage(event.currentPage);
  };

  // **Handle PDF Completion**
  const handleClose = () => {
    console.log("🔄 Sending Progress Update:", { userId, contentId, courseId, lastViewedPage });

    updateContentProgress(userId, contentId, courseId, lastViewedPage, "pdf");

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>✖ Close</button>

        <div className="pdf-viewer-container">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}>
            <Viewer 
              fileUrl={pdfUrl} 
              defaultScale={SpecialZoomLevel.PageWidth}
              onDocumentLoadSuccess={handleDocumentLoad} // ✅ Fix Applied: Logging Full Attributes
              onPageChange={handlePageChange}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default UserPDFReaderModal;