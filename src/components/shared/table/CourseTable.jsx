import React, { useState, useEffect } from "react";
import { Table, Tooltip, Space, Button, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileAddOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QuizModal from "./QuizModal";

const CourseTable = ({ onEditClick, onDeleteClick }) => {
  const navigate = useNavigate();
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isMetadataOnly, setIsMetadataOnly] = useState(false);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [latestQuizId, setLatestQuizId] = useState(null);

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
        parentType: "course"
      };
      console.log("payload", payload)
      const response = await axios.post("http://localhost:8080/api/quizzes", payload);
      console.log("response1", response)
      // const response = { success: true, quizId: "mock-quiz-123" };
      const result = response?.data?.data;
      const messageText = response?.data?.message;

      if (result?.quizId) {
        const quizId = result.quizId;
        message.success(messageText || "Quiz created successfully.");
        setQuizModalOpen(false);
        fetchCourses();
        navigate(`/course-content/${selectedCourse.courseId}/quizzes/${quizId}/questions`);
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
    const response = await axios.get("http://localhost:8080/api/course");

    const coursesWithQuizStatus = await Promise.all(
      response.data.data.map(async (course) => {
        try {
          const quizResponse = await axios.get(`http://localhost:8080/api/quizzes/course/${course.courseId}`);
          const quizzes = quizResponse?.data?.data || [];

          if (quizzes.length > 0) {
            // If you have multiple quizzes, pick the latest or the first one
            const latestQuiz = quizzes[0]; 
            return {
              ...course,
              quizCreated: true,
              quizId: latestQuiz.quizId,
            };
          } else {
            return { ...course, quizCreated: false, quizId: null };
          }
        } catch (err) {
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
      render: (createdAt) =>
        createdAt ? new Date(createdAt).toLocaleString() : "N/A",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      render: (updatedAt) => new Date(updatedAt).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 283,
      render: (_, record) => {
        const quizExists = record.quizCreated;
        return (
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

            {/* Create or Modify Quiz */}
            {/* <Tooltip title={quizExists ? "Modify Quiz Metadata" : "Create Quiz Metadata"}>
              <Button
                icon={<FileAddOutlined />}
                type="primary"
                onClick={() => handleAddQuizClick(record, true)}
              >
                {quizExists ? "Modify Quiz" : "Create Quiz"}
              </Button>
            </Tooltip> */}

            {/* Quiz Listing */}
            {/* {quizExists ? (
            <Tooltip title="Quiz List">
              <Button
                icon={<UnorderedListOutlined />}
                onClick={() =>
                  navigate(`/course-content/${record.courseId}/quizzes/${record.quizId}/questions`)
                }
              >
                Quiz List
              </Button>
          </Tooltip>
        ) : (
            <Tooltip title="No quiz created">
              <Button icon={<UnorderedListOutlined />} disabled>
                Quiz List
              </Button>
            </Tooltip>
          )} */}

          <Tooltip title="Manage Quiz">
        <Button
          type="primary"
          icon={<UnorderedListOutlined />}
          onClick={() =>
            navigate(`/course-content/${record.courseId}/quizzes`)
          }
        >
          Manage Quiz
        </Button>
      </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "16px", marginLeft: "35px", marginRight: "25px" }}>
      <Table
        columns={columns}
        dataSource={courses}
        rowKey="courseId"
        bordered
        pagination={{ pageSize: 10 }}
      />
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
