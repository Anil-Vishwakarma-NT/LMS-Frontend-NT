import React, { useState } from "react";
import VideoModal from "../../user/myCourses/UserVideoModal";
import PDFReaderModal from "../../user/myCourses/UserPDFReaderModal";
import { Table, Button } from "antd";

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
          <Button type="link" onClick={() => handlePlayVideo(resourceLink, contentId)}>
            Play Video
          </Button>
        );
      case "pdf":
        return (
          <Button type="link" onClick={() => handleViewPDF(resourceLink, contentId)}>
            View PDF
          </Button>
        );
      case "website":
        return (
          <Button type="link" onClick={() => window.open(resourceLink, "_blank")}>
            Visit Link
          </Button>
        );
      default:
        return <span>Unsupported Content</span>;
    }
  };

  const columns = [
    {
      title: fields[0]?.title || "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => text || "N/A",
    },
    {
      title: fields[1]?.title || "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "N/A",
    },
    {
      title: "Completion %",
      dataIndex: "completionPercentage",
      key: "completionPercentage",
      render: (value) =>
        typeof value === "number" ? `${value.toFixed(2)}%` : "0%",
    },
    {
      title: fields[2]?.title || "Action",
      key: "action",
      render: (_, record) =>
        record.resourceLink ? renderActionButton(record.resourceLink, record.contentId) : "N/A",
    },
  ];

  return (
    <div style={{ padding: 16, marginLeft: 35, marginRight: 25 }}>
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
      <Table
        columns={columns}
        dataSource={entries}
        rowKey={(record) => record.contentId || record.id}
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default UserCourseContentTable;
