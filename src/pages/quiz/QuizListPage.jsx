import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  Space,
  Button,
  Tooltip,
  message,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import QuizModal from "../../components/shared/table/QuizModal";


// MOCK: Replace with real API
const getQuizQuestions = async (courseId) => {
  return [
    {
      id: 1,
      courseId,
      question: "What is React?",
      answerType: "mcq_single",
      options: ["Library", "Framework", "Tool", "IDE"],
      correctOption: "option1",
    },
    {
      id: 2,
      courseId,
      question: "State is used to store data in components?",
      answerType: "text",
      textAnswer: "Yes",
    },
  ];
};

const QuizListPage = () => {
  const { courseId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [quizToEdit, setQuizToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getQuizQuestions(courseId);
        setQuestions(data);
      } catch (err) {
        message.error("Failed to load quiz questions");
      }
    };

    fetchData();
  }, [courseId]);

  const handleView = (quiz) => {
    setSelectedQuiz(quiz);
    setViewModalOpen(true);
  };

  const handleEdit = (quiz) => {
    setQuizToEdit(quiz);
    setEditModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: "Are you sure you want to delete this quiz?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        message.success(`Deleted quiz with ID: ${id}`);
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        // TODO: Replace with actual DELETE API
      },
    });
  };

  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Answer Type",
      dataIndex: "answerType",
      key: "answerType",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 100 }}>
      <h2>Quiz List for Course ID: {courseId}</h2>
      <div style={{ marginTop: "18px" }}>
        <Table
          dataSource={questions}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* View Modal */}
      {selectedQuiz && (
        <Modal
          open={viewModalOpen}
          title="Quiz Details"
          onCancel={() => setViewModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setViewModalOpen(false)}>
              Close
            </Button>,
          ]}
        >
          <p><strong>Question:</strong> {selectedQuiz.question}</p>
          <p><strong>Answer Type:</strong> {selectedQuiz.answerType}</p>

          {selectedQuiz.answerType === "text" && (
            <p><strong>Answer:</strong> {selectedQuiz.textAnswer}</p>
          )}

          {(selectedQuiz.answerType === "mcq_single" || selectedQuiz.answerType === "mcq_multiple") && (
            <>
              <p><strong>Options:</strong></p>
              <ul>
                {selectedQuiz.options?.map((opt, index) => (
                  <li key={index}>{opt}</li>
                ))}
              </ul>
              <p><strong>
                {selectedQuiz.answerType === "mcq_single"
                  ? "Correct Option:"
                  : "Correct Options:"}
              </strong> {selectedQuiz.correctOption || selectedQuiz.correctOptions?.join(", ")}</p>
            </>
          )}
        </Modal>
      )}

      {/* Edit Modal using QuizModal */}
      {quizToEdit && (
        <QuizModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setQuizToEdit(null);
          }}
          course={{ courseId: quizToEdit.courseId, title: "Edit Quiz" }}
          onSubmit={async (updatedQuiz) => {
            try {
              // TODO: Replace with PUT API call
              message.success("Quiz updated successfully");
              setQuestions((prev) =>
                prev.map((q) =>
                  q.id === quizToEdit.id ? { ...q, ...updatedQuiz } : q
                )
              );
              setEditModalOpen(false);
              setQuizToEdit(null);
            } catch (error) {
              message.error("Failed to update quiz");
            }
          }}
          initialValues={quizToEdit}
        />
      )}
    </div>
  );
};

export default QuizListPage;
