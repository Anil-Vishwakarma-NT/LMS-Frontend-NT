import React, { useState } from "react";
import VideoModal from "../../user/myCourses/UserVideoModal";
import PDFReaderModal from "../../user/myCourses/UserPDFReaderModal";
import "../../admin/booksAdmin/VideoModal.css";
import "../../admin/booksAdmin/PDFReaderModal.css";
import "./Table.css";

const getResourceType = (resourceLink) => {
  if (!resourceLink) return "unknown";
  const lowerLink = resourceLink.toLowerCase();

  if (lowerLink.includes("youtube.com") || lowerLink.includes("youtu.be")) return "youtube";
  if (lowerLink.endsWith(".mp4") || lowerLink.endsWith(".mov")) return "video";
  if (lowerLink.endsWith(".pdf")) return "pdf";
  if (lowerLink.startsWith("http://") || lowerLink.startsWith("https://")) return "website";

  return "unknown";
};

const UserCourseContentTable = ({ fields, entries, courseId }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [currentContentId, setCurrentContentId] = useState(null); 
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [currentPDFUrl, setCurrentPDFUrl] = useState("");

  const handlePlayVideo = (resourceLink, contentId) => {
    setCurrentVideoUrl(resourceLink);
    setCurrentContentId(contentId); 
    setIsVideoModalOpen(true);
  };

  const handleViewPDF = (resourceLink, contentId) => {
    setCurrentPDFUrl(resourceLink);
    setCurrentContentId(contentId); 
    setIsPDFModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setCurrentVideoUrl("");
    setCurrentContentId(null);
    setIsVideoModalOpen(false);
  };

  const handleClosePDFModal = () => {
    setCurrentPDFUrl("");
    setCurrentContentId(null);
    setIsPDFModalOpen(false);
  };

  const renderActionButton = (resourceLink, contentId) => {
    const resourceType = getResourceType(resourceLink);

    switch (resourceType) {
      case "youtube":
      case "video":
        return (
          <button onClick={() => handlePlayVideo(resourceLink, contentId)}>
            Play Video
          </button>
        );

      case "pdf":
        return (
          <button onClick={() => handleViewPDF(resourceLink, contentId)}>
            View PDF
          </button>
        );

      case "website":
        return (
          <button onClick={() => window.open(resourceLink, "_blank")}>
            Visit Link
          </button>
        );

      default:
        return <span>Unsupported Content</span>;
    }
  };

  return (
    <div className="table-container">
      <VideoModal
        isOpen={isVideoModalOpen}
        videoUrl={currentVideoUrl}
        contentId={currentContentId} 
        courseId={courseId} 
        onClose={handleCloseVideoModal}
      />
      <PDFReaderModal
        isOpen={isPDFModalOpen}
        pdfUrl={currentPDFUrl}
        contentId={currentContentId} 
        courseId={courseId} 
        onClose={handleClosePDFModal}
        blockTime={10} 
      />
      <div className="table-parent">
        <table className="books-table">
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.index}>{field.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries?.map((item, i) => (
              <tr key={i}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                  {item.resourceLink ? renderActionButton(item.resourceLink, item.contentId) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserCourseContentTable;