import { app, appCourse } from "../../service/serviceLMS";


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  message,
  Tooltip,
  Space,
  Spin,
  Card,
  Row,
  Col,
  Divider,
  Tag
} from "antd";
import {
  FieldTimeOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import QuizQuestionModal from "./QuizQuestionModal";
import ViewQuestionModal from "./ViewQuestionModal";
import EditQuestionModal from "./QuizQuestionEditPage";
import QuizMetadataModal from "./QuizMetadataModal";

const QuizListPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [quizMetaModalOpen, setQuizMetaModalOpen] = useState(false);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");

  const fetchQuizMetadata = async () => {
    try {
      const res = await appCourse.get(`/api/quizzes/course/${courseId}`);
      setQuiz(res.data?.data?.[0] || null);
      setCourseTitle(res.data?.data?.[0].title || "");
    } catch (err) {
      setQuiz(null);
    }
  };

  const fetchQuestions = async (quizId) => {
    try {
      const res = await appCourse.get(`/api/quiz-questions/quiz/${quizId}`);
      setQuizQuestions(res.data?.data || []);
    } catch (err) {
      message.error("Failed to load quiz questions");
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchQuizMetadata();
      setLoading(false);
    };
    load();
  }, [courseId]);

  useEffect(() => {
    if (quiz?.quizId) {
      fetchQuestions(quiz.quizId);
    }
  }, [quiz]);

  const handleDeleteQuestion = async (questionId) => {
    try {
      await appCourse.delete(`/api/quiz-questions/${questionId}`);
      setQuizQuestions(prev => prev.filter(q => q.questionId !== questionId));
      message.success("Question deleted successfully");
    } catch (error) {
      message.error("Failed to delete question");
    }
  };

  const columns = [
    {
      title: "Question",
      dataIndex: "questionText",
    },
    {
      title: "Answer Type",
      dataIndex: "questionType",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedQuestion(record);
                setViewModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setQuizToEdit(record);
                setSelectedQuestion(record);
                setEditModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteQuestion(record.questionId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Spin fullscreen />;
  }

  return (
    <div style={{ padding: 24, marginTop: 75 }}>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/books")}>
          Back to Courses
        </Button>

        {quiz ? (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => setQuizMetaModalOpen(true)}>
              Modify Quiz
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              Add Quiz Question
            </Button>
          </Space>
        ) : (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              console.log("Create quiz clicked");
              setQuizMetaModalOpen(true);
            }}
          >
            Create Quiz
          </Button>
        )}
      </div>

      {quiz ? (
        <>
          <Card
          title={`📘 Quiz Metadata - ${courseTitle}`}
          bordered={false}
          style={{ marginBottom: 24, borderRadius: 12, background: "#fafafa", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)" }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <p><strong>📖 Title:</strong> {quiz.title}</p>
            </Col>
            <Col span={12}>
              <p><strong><InfoCircleOutlined /> Description:</strong> {quiz.description}</p>
            </Col>

            <Col span={12}>
              <p><strong><ClockCircleOutlined /> Time Limit:</strong> {quiz.timeLimit} mins</p>
            </Col>
            <Col span={12}>
              <p><strong><SyncOutlined /> Attempts Allowed:</strong> {quiz.attemptsAllowed}</p>
            </Col>

            <Col span={12}>
              <p><strong><CheckCircleOutlined /> Passing Score:</strong> {quiz.passingScore}%</p>
            </Col>
            <Col span={12}>
              <p>
                <strong>🔀 Randomize Questions:</strong>{" "}
                <Tag color={quiz.randomizeQuestions ? "green" : "red"}>
                  {quiz.randomizeQuestions ? "Yes" : "No"}
                </Tag>
              </p>
            </Col>

            <Col span={12}>
              <p>
                <strong><EyeOutlined /> Show Results:</strong>{" "}
                <Tag color={quiz.showResults ? "blue" : "orange"}>
                  {quiz.showResults ? "Yes" : "No"}
                </Tag>
              </p>
            </Col>
            <Col span={12}>
              <p>
                <strong>Status:</strong>{" "}
                <Tag color={quiz.isActive ? "green" : "red"}>
                  {quiz.isActive ? "Active" : "Inactive"}
                </Tag>
              </p>
            </Col>
          </Row>

          <Divider style={{ marginTop: 16 }} />
          <p style={{ fontStyle: "italic", color: "#888" }}>
            Last updated metadata for the quiz associated with the course.
          </p>
        </Card>

          <Table
            dataSource={quizQuestions}
            columns={columns}
            rowKey="questionId"
            pagination={false}
            locale={{ emptyText: "No questions added yet" }}
          />

          <QuizQuestionModal
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            onSuccess={() => {
              fetchQuestions(quiz.quizId);
              setModalOpen(false);
            }}
            courseId={courseId}
            quizId={quiz.quizId}
          />

          <ViewQuestionModal
            open={viewModalOpen}
            question={selectedQuestion}
            onClose={() => setViewModalOpen(false)}
          />

          <EditQuestionModal
            open={editModalOpen}
            questionId={selectedQuestion?.questionId}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedQuestion(null);
            }}
            onUpdate={() => {
              fetchQuestions(quiz.quizId);
              setEditModalOpen(false);
            }}
          />
        </>
      ) : (
        <p>No quiz created for this course yet.</p>
      )}

      {/* ✅ Always Render Metadata Modal */}
      <QuizMetadataModal
        open={quizMetaModalOpen}
        onClose={() => setQuizMetaModalOpen(false)}
        quiz={quiz}
        onSubmit={async (formData) => {
          try {
            if (quiz) {
              await appCourse.put(`/api/quizzes/${quiz.quizId}`, formData);
              message.success("Quiz metadata updated successfully");
            } else {
              const response = await appCourse.post(`/api/quizzes`, {
                ...formData,
                parentId: courseId,
                parentType: "course",
              });
              message.success("Quiz created successfully");
              setQuiz(response.data?.data || null);
            }
            await fetchQuizMetadata();
            setQuizMetaModalOpen(false);
          } catch (err) {
            console.error("Quiz save failed:", err);
            message.error("Failed to save quiz metadata");
          }
        }}
      />
    </div>
  );
};

export default QuizListPage;
