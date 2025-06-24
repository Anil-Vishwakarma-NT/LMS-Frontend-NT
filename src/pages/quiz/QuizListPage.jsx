// import React, { useEffect, useState } from "react";
// import { Table, Button, message, Tooltip, Space } from "antd";
// import { useParams, useNavigate } from "react-router-dom";
// // import { Table, Button, message, Tooltip, Space } from "antd";
// import { PlusOutlined, ArrowLeftOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
// import axios from "axios";
// import QuizQuestionModal from "./QuizQuestionModal"; // ✅ Make sure path is correct
// import ViewQuestionModal from "./ViewQuestionModal"; //
// import EditDummyQuestionModal from "./QuizQuestionEditPage";

// const QuizList = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [quizQuestions, setQuizQuestions] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false); // ✅ For modal visibility
//   const [viewModalOpen, setViewModalOpen] = useState(false);
//   const [selectedQuestion, setSelectedQuestion] = useState(null);
  
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [localData, setLocalData] = useState([]);

//   // const fetchQuizQuestions = async () => {
//   //   try {
//   //     const response = 200;
//   //     // const response = await axios.get(`/api/quizzes/questions/${courseId}`);
//   //     setQuizQuestions(response.data.data || []);
//   //   } catch (error) {
//   //     message.error("Failed to load quiz questions");
//   //   }
//   // };
//   const fetchQuizQuestions = async () => {
//   try {
//     const mockData = [
//       {
//         questionId: "q1",
//         questionText: "What is the capital of France?",
//         answerType: "SINGLE_SELECT",
//         options: ["Paris", "Rome", "Madrid", "Berlin"],
//         correctAnswer: ["Paris"],
//       },
//       {
//         questionId: "q2",
//         questionText: "List all primary colors.",
//         answerType: "MULTI_SELECT",
//         options: ["Red", "Green", "Blue", "Yellow"],
//         correctAnswer: ["Red", "Blue", "Yellow"],
//       },
//       {
//         questionId: "q3",
//         questionText: "Explain the concept of polymorphism in OOP.",
//         answerType: "TEXT",
//         correctAnswer: ["Polymorphism allows objects to take many forms."],
//       },
//     ];

//     setQuizQuestions(mockData);
//   } catch (error) {
//     message.error("Failed to load quiz questions");
//   }
// };

//   useEffect(() => {
//     fetchQuizQuestions();
//   }, [courseId]);

//   const handleDeleteQuestion = async (questionId) => {
//     try {
//       await axios.delete(`/api/quizzes/questions/${questionId}`);
//       message.success("Question deleted");
//       fetchQuizQuestions();
//     } catch (error) {
//       message.error("Failed to delete question");
//     }
//   };

//   const columns = [
//     {
//       title: "Question",
//       dataIndex: "questionText",
//       key: "questionText",
//     },
//     {
//       title: "Answer Type",
//       dataIndex: "answerType",
//       key: "answerType",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <>
//           <Space wrap>
//         {/* View Question */}
//         <Tooltip title="View Question">
//         <Button
//           icon={<EyeOutlined />}
//           onClick={() => {
//             setSelectedQuestion(record);
//             setViewModalOpen(true);
//           }}
//         />
//       </Tooltip>

//         {/* Edit Question */}
//         {/* <Tooltip title="Edit Question">
//           <Button
//             icon={<EditOutlined />}
//             onClick={() =>
//               navigate(
//                 `/course-content/${courseId}/quizzes/edit-question/${record.questionId}`
//               )
//             }
//           />
//         </Tooltip> */}

//         <Tooltip title="Edit Question">
//   <Button
//     icon={<EditOutlined />}
//     onClick={() => {
//       setEditingQuestionId(record.questionId);
//       setEditModalOpen(true);
//     }}
//   />
// </Tooltip>

//         {/* Delete Question */}
//         <Tooltip title="Delete Question">
//           <Button
//             icon={<DeleteOutlined />}
//             danger
//             onClick={() => handleDeleteQuestion(record.questionId)}
//           />
//         </Tooltip>
//       </Space>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: "24px", marginTop: "75px" }}>
//       <div
//         style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}
//       >
//         <Button
//           icon={<ArrowLeftOutlined />}
//           onClick={() => navigate("/books")}
//         >
//           Back to Courses
//         </Button>

//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => setModalOpen(true)}
//         >
//           Add Quiz Question
//         </Button>
//       </div>

//       <h2>Quiz List for Course ID: {courseId}</h2>

//       <Table
//         dataSource={quizQuestions}
//         columns={columns}
//         rowKey="questionId"
//         pagination={false}
//         locale={{ emptyText: "No data" }}
//       />

//       {/* ✅ Modal for Adding Question */}
//       <QuizQuestionModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)} 
//         onSuccess={() => {
//           setModalOpen(false);
//           fetchQuizQuestions();
//         }}
//         courseId={courseId}
//       />
//       <ViewQuestionModal
//         visible={viewModalOpen}
//         onClose={() => {
//           setViewModalOpen(false);
//           setSelectedQuestion(null);
//         }}
//         question={selectedQuestion}
//     />

//     <EditDummyQuestionModal
//   open={editModalOpen}
//   questionId={editingQuestionId}
//   onClose={() => setEditModalOpen(false)}
//   onUpdate={(updatedData) => setLocalData(updatedData)}
// />
//     </div>
//   );
// };

// export default QuizList;


import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Tooltip, Space } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
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

const QuizList = () => {
  const { courseId, quizId} = useParams();
  const navigate = useNavigate();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [quizToEdit, setQuizToEdit] = useState(null);

  const fetchQuizQuestions = async () => {
    console.log("courseId", courseId)
    console.log("quizId", quizId)
    try {
      // const mockData = [
      //   {
      //     questionId: "q1",
      //     questionText: "What is the capital of France?",
      //     answerType: "SINGLE_SELECT",
      //     options: ["Paris", "Rome", "Madrid", "Berlin"],
      //     correctAnswer: ["Paris"],
      //   },
      //   {
      //     questionId: "q2",
      //     questionText: "List all primary colors.",
      //     answerType: "MULTI_SELECT",
      //     options: ["Red", "Green", "Blue", "Yellow"],
      //     correctAnswer: ["Red", "Blue", "Yellow"],
      //   },
      //   {
      //     questionId: "q3",
      //     questionText: "Explain the concept of polymorphism in OOP.",
      //     answerType: "TEXT",
      //     correctAnswer: ["Polymorphism allows objects to take many forms."],
      //   },
      // ];
      // const response = await axios.get(`http://localhost:8080/api/quiz-questions/quiz/${courseId}`);
      const response = await axios.get(`http://localhost:8080/api/quiz-questions/quiz/${quizId}`);
      console.log("here")
      console.log("response11111111", response)
      setQuizQuestions(response.data?.data || []);
    } catch (error) {
      message.error("Failed to load quiz questions");
    }
  };

  useEffect(() => {
    fetchQuizQuestions();
  }, [courseId]);

  const handleDeleteQuestion = async (questionId) => {
    try {
      const filtered = quizQuestions.filter((q) => q.questionId !== questionId);
      setQuizQuestions(filtered);
      message.success("Question deleted (mock)");
    } catch (error) {
      message.error("Failed to delete question");
    }
  };

  const handleSaveEditedQuestion = (updated) => {
    const updatedList = quizQuestions.map((q) =>
      q.questionId === updated.questionId ? updated : q
    );
    setQuizQuestions(updatedList);
    setEditModalOpen(false);
    message.success("Question updated successfully");
  };

  const columns = [
    {
      title: "Question",
      dataIndex: "questionText",
      key: "questionText",
    },
    {
      title: "Answer Type",
      dataIndex: "questionType",
      key: "questionType",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {/* View Question */}
          <Tooltip title="View Question">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedQuestion(record);
                setViewModalOpen(true);
              }}
            />
          </Tooltip>

          {/* Edit Question */}
          <Tooltip title="Edit Question">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setQuizToEdit(record); 
                setSelectedQuestion(record);
                setEditModalOpen(true);
              }}
            />
          </Tooltip>

          {/* Delete */}
          <Tooltip title="Delete Question">
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

  return (
    <div style={{ padding: "24px", marginTop: "75px" }}>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/books")}>Back to Courses</Button>

        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Add Quiz Question
        </Button>
      </div>

      <h2>Quiz List for Course ID: {courseId}</h2>

      <Table
        dataSource={quizQuestions}
        columns={columns}
        rowKey="questionId"
        pagination={false}
        locale={{ emptyText: "No data" }}
      />

      {/* Add Modal */}
      <QuizQuestionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
        fetchQuizQuestions();
        setModalOpen(false);
      }}
        courseId={courseId}
        quizId={quizId}
      />

      {/* View Modal */}
      <ViewQuestionModal
        open={viewModalOpen}
        question={selectedQuestion}
        onClose={() => setViewModalOpen(false)}
      />

      {/* Edit Modal */}
      <EditQuestionModal
      open={editModalOpen}
      questionId={selectedQuestion?.questionId}
      onClose={() => {
        setEditModalOpen(false);
        setQuizToEdit(null);
      }}
      onUpdate={(updatedList) => {
        setQuizQuestions(updatedList);
        setSelectedQuestion(null);
      }}
      initialValues={quizToEdit}
    />
    </div>
  );
};

export default QuizList;

