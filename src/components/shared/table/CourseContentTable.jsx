import React, { useState } from "react";
import { Table, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  FilePdfOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import VideoModal from "../../admin/booksAdmin/VideoModal";
import PDFReaderModal from "../../admin/booksAdmin/PDFReaderModal";

const getResourceType = (resourceLink) => {
  if (!resourceLink) return "unknown";
  const lowerLink = resourceLink.toLowerCase();
  if (lowerLink.includes("youtube.com") || lowerLink.includes("youtu.be"))
    return "youtube";
  if (lowerLink.endsWith(".mp4") || lowerLink.endsWith(".mov")) return "video";
  if (lowerLink.endsWith(".pdf")) return "pdf";
  if (lowerLink.startsWith("http://") || lowerLink.startsWith("https://"))
    return "website";
  return "unknown";
};

const CourseContentTable = ({ onEditClick, fields, entries, showConfirmDeleteCourseContent }) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [currentPDFUrl, setCurrentPDFUrl] = useState("");

  const handlePlayVideo = (resourceLink) => {
    setCurrentVideoUrl(resourceLink);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setCurrentVideoUrl("");
    setIsVideoModalOpen(false);
  };

  const handleViewPDF = (resourceLink) => {
    setCurrentPDFUrl(resourceLink);
    setIsPDFModalOpen(true);
  };

  const handleClosePDFModal = () => {
    setCurrentPDFUrl("");
    setIsPDFModalOpen(false);
  };

  const renderActionButton = (resourceLink) => {
    const resourceType = getResourceType(resourceLink);
    switch (resourceType) {
      case "youtube":
      case "video":
        return (
          <Button
            icon={<PlayCircleOutlined />}
            onClick={() => handlePlayVideo(resourceLink)}
          >
            Watch
          </Button>
        );
      case "pdf":
        return (
          <Button
            icon={<FilePdfOutlined />}
            onClick={() => handleViewPDF(resourceLink)}
          >
            View PDF
          </Button>
        );
      case "website":
        return (
          <Button
            icon={<LinkOutlined />}
            onClick={() => window.open(resourceLink, "_blank")}
            type="link"
          >
            Visit
          </Button>
        );
      default:
        return <span>Unsupported</span>;
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "courseContentId",
      key: "courseContentId",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
      render: (text) => text || "N/A",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) => (active ? "Yes" : "No"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date.split(".")[0]).toLocaleDateString() : "N/A",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) =>
        date ? new Date(date.split(".")[0]).toLocaleDateString() : "N/A",
    },
    {
      title: "Resource",
      dataIndex: "resourceLink",
      key: "resourceLink",
      render: (resourceLink) =>
        resourceLink ? renderActionButton(resourceLink) : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 12 }}>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => onEditClick(record)}
              type="text"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => showConfirmDeleteCourseContent(record.courseContentId)}
              type="text"
              danger
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <VideoModal
        isOpen={isVideoModalOpen}
        videoUrl={currentVideoUrl}
        onClose={handleCloseVideoModal}
      />
      <PDFReaderModal
        isOpen={isPDFModalOpen}
        pdfUrl={currentPDFUrl}
        onClose={handleClosePDFModal}
        blockTime={0}
      />

      <div style={{ padding:"16px", marginLeft: "35px", marginRight: "25px" }}>
        <Table
          dataSource={entries}
          columns={columns}
          rowKey="courseContentId"
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: "max-content" }}
        />
      </div>
    </>
  );
};

export default CourseContentTable;
