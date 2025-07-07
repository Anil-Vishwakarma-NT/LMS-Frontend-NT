import { app} from "../../../service/serviceLMS";
import React, { useState, useEffect } from "react";
import { Table, Tooltip, Space, Button, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilePdfOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QuizModal from "./QuizModal";
import CourseReportOptionsModal from "../../admin/booksAdmin/CourseReportOptionsModal";
import PDFReaderModal from "../../admin/booksAdmin/PDFReaderModal";
import { previewCourseReportPdf, downloadCourseReportPdf, downloadCourseReportExcel} from "../../../service/BookService";

const CourseTable = ({ onEditClick, onDeleteClick, entries, fields, type }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [isMetadataOnly, setIsMetadataOnly] = useState(false);
  const [latestQuizId, setLatestQuizId] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportBlobUrl, setReportBlobUrl] = useState("");
  const [reportingCourseId, setReportingCourseId] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [reportOptions, setReportOptions] = useState(null);


  const handleReportOptionsSubmit = async (options) => {
    try {
      setShowOptionsModal(false);
      setReportOptions(options);  
  
      const blob = await previewCourseReportPdf(options);
      const blobUrl = URL.createObjectURL(blob);
      setReportBlobUrl(blobUrl);
      setIsReportModalOpen(true);
    } catch (err) {
      message.error("Failed to generate report");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      await downloadCourseReportPdf(reportOptions); 
      message.success("PDF downloaded successfully");
    } catch {
      message.error("Failed to download PDF");
    }
  };
  
  const handleDownloadExcel = async () => {
    try {
      await downloadCourseReportExcel(reportOptions);
      message.success("Excel downloaded successfully");
    } catch {
      message.error("Failed to download Excel");
    }
  };
  

  const handleAddQuizClick = (course, metadataOnly = false) => {
    setSelectedCourse(course);
    setIsMetadataOnly(metadataOnly);
    setQuizModalOpen(true);
  };

  const handleQuizSubmit = async (quizMetadata) => {
    try {
      const payload = {
        ...quizMetadata,
        parentId: selectedCourse.courseId,
        createdBy: 1,
        parentType: "course",
      };
      const response = await app.post("course/api/service-api/quizzes", payload);
      const result = response?.data?.data;
      const messageText = response?.data?.message;

      if (result?.quizId) {
        message.success(messageText || "Quiz created successfully.");
        setQuizModalOpen(false);
        fetchCourses();
        navigate(`/course-content/${selectedCourse.courseId}/quizzes/${result.quizId}/questions`);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Quiz creation failed", err);
      message.error("Failed to create quiz");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await app.get("course/api/service-api/course");

      const coursesWithQuizStatus = await Promise.all(
        response.data.data.map(async (course) => {
          try {
            const quizResponse = await app.get(`course/api/service-api/quizzes/course/${course.courseId}`);
            const quizzes = quizResponse?.data?.data || [];
            const latestQuiz = quizzes[0];
            return {
              ...course,
              quizCreated: quizzes.length > 0,
              quizId: latestQuiz?.quizId || null,
            };
          } catch {
            return { ...course, quizCreated: false, quizId: null };
          }
        })
      );

      setCourses(coursesWithQuizStatus);
    } catch (err) {
      message.error("Failed to load courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const columns = [
    { title: "Course ID", dataIndex: "courseId" },
    { title: "Title", dataIndex: "title" },
    { title: "Description", dataIndex: "description" },
    { title: "Level", dataIndex: "level" },
    { title: "Owner ID", dataIndex: "ownerId" },
    {
      title: "Is Active",
      dataIndex: "isActive",
      render: (active) => (active ? "Yes" : "No"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt) => createdAt ? new Date(createdAt.split(".")[0]).toLocaleDateString() : "N/A",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      render: (updatedAt) => new Date(updatedAt).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 320,
      render: (_, record) => (
        <Space wrap>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => onEditClick(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} danger onClick={() => onDeleteClick(record)} />
          </Tooltip>
          <Tooltip title="View Course">
            <Button icon={<EyeOutlined />} onClick={() => navigate(`/course-content/${record.courseId}`)} />
          </Tooltip>
          <Tooltip title="Preview Report">
            <Button
              icon={<FilePdfOutlined />}
              onClick={() => {
                setReportingCourseId(record.courseId);
                setShowOptionsModal(true);  
              }}
              type="text"
            />
          </Tooltip>
          <Tooltip title="Manage Quiz">
            <Button
              type="primary"
              icon={<UnorderedListOutlined />}
              onClick={() => navigate(`/course-content/${record.courseId}/quizzes`)}
            >
              Manage Quiz
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "16px", marginLeft: "35px", marginRight: "25px" }}>
      <Table
        columns={columns}
        dataSource={entries || courses}
        rowKey="courseId"
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
        onDownloadPdf={handleDownloadPdf}
        onDownloadExcel={handleDownloadExcel}
      />
      {showOptionsModal && (
      <CourseReportOptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onSubmit={(options) => handleReportOptionsSubmit(options)}
        courseId={String(reportingCourseId)}
      />
        )}
      {selectedCourse && (
        <QuizModal
          open={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          onSubmit={handleQuizSubmit}
          course={selectedCourse}
          metadataOnly={isMetadataOnly}
          initialValues={quizToEdit}
        />
      )}
    </div>
  );
};

export default CourseTable;