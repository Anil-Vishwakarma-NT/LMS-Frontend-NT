import QuizModal from "./QuizModal";
import React, { useState } from "react";

// import React from "react";
import { Table, Tooltip, Space, Button , message } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, FilePdfOutlined, PlusOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { previewCourseReportPdf, downloadCourseReportPdf} from "../../../service/BookService";
import PDFReaderModal from "../../admin/booksAdmin/PDFReaderModal";

const CourseTable = ({ onEditClick, fields, entries, type, onDeleteClick }) => {
  const navigate = useNavigate();
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportBlobUrl, setReportBlobUrl] = useState("");
  const [reportingCourseId, setReportingCourseId] = useState(null);


  const handlePreviewReport = async (courseId) => {
    try {
      const blob = await previewCourseReportPdf(courseId);
      const blobUrl = URL.createObjectURL(blob);
      setReportBlobUrl(blobUrl);
      setIsReportModalOpen(true);
    } catch (error) {
      console.error("Failed to load report PDF:", error.message);
    }
  };

  const handleDownload = (courseId) => {
    if (!courseId) {
      message.warning("No course selected for download");
      return;
    }
    downloadCourseReportPdf(courseId);
  };

  const handleAddQuizClick = (course) => {
    setSelectedCourse(course);
    setQuizModalOpen(true);
  };   

  const handleQuizSubmit = async (quizData) => {
    try {
      console.log("Quiz Submitted:", quizData);
      // Replace this with actual API call
      // await addQuizAPI(quizData);
      message.success("Quiz added successfully!");
    } catch (err) {
      message.error("Failed to add quiz");
    } finally {
      setQuizModalOpen(false);
    }
  };

  const columns = [
    {
      title: "Course ID",
      dataIndex: "courseId",
      key: "courseId",
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
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Owner ID",
      dataIndex: "ownerId",
      key: "ownerId",
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) => (active ? "Yes" : "No"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        createdAt ? new Date(createdAt.split(".")[0]).toLocaleDateString() : "N/A",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => new Date(updatedAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEditClick(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => onDeleteClick(record)}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/course-content/${record.courseId}`)}
            />
          </Tooltip>
            <Tooltip title="Preview Report">
              <Button
                icon={<FilePdfOutlined />}
                onClick={() => {
                  setReportingCourseId(record.courseId);
                  handlePreviewReport(record.courseId);
                }}
                type="text"
              />
          </Tooltip>
          <Tooltip title="Add Quiz">
            <Button
              type="primary"
              onClick={() => handleAddQuizClick(record)}
            >
              Add Quiz
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px",
      marginLeft:"35px",
      marginRight:"25px",
     }}>
      <Table
        columns={columns}
        dataSource={entries}
        rowKey={(record) => record.courseId}
        bordered
        pagination={{ pageSize: 10 }}     
      />
      <PDFReaderModal
        isOpen={isReportModalOpen}
        pdfUrl={reportBlobUrl}
        onClose={() => {
          setIsReportModalOpen(false);
          URL.revokeObjectURL(reportBlobUrl);
          setSelectedCourse(null);
        }}
        blockTime={0}
        showDownload={true}
        onDownload={() => handleDownload(reportingCourseId)}
      />
      {selectedCourse && (
        <QuizModal
          open={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          onSubmit={handleQuizSubmit}
          course={selectedCourse}
        />
      )}
    </div>
  );
};

export default CourseTable;