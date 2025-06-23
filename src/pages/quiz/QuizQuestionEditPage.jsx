// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Button,
//   Space,
//   Checkbox,
//   Radio,
//   message,
//   Spin,
// } from "antd";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// const { Option } = Select;

// const QuizQuestionEditPage = () => {
//   const { courseId, questionId } = useParams();
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(true);
//   const [answerType, setAnswerType] = useState("TEXT");
//   const [options, setOptions] = useState([]);
//   const navigate = useNavigate();

//   // Fetch question by ID
//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         const { data } = await axios.get(`/api/quizzes/questions/${questionId}`);
//         const question = data.data;

//         setAnswerType(question.answerType);
//         setOptions(question.options || []);
//         form.setFieldsValue({
//           questionText: question.questionText,
//           answerType: question.answerType,
//           options: question.options || [],
//           correctAnswer: question.correctAnswer || [],
//         });

//         setLoading(false);
//       } catch (err) {
//         message.error("Failed to load question");
//         setLoading(false);
//       }
//     };

//     fetchQuestion();
//   }, [questionId, form]);

//   const handleSubmit = async (values) => {
//     try {
//       const payload = {
//         ...values,
//         questionId,
//         courseId,
//         answerType,
//       };

//       await axios.put(`/api/quizzes/questions/${questionId}`, payload);
//       message.success("Question updated successfully");
//       navigate(`/course-content/${courseId}/quizzes`);
//     } catch (err) {
//       message.error("Failed to update question");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 700, margin: "auto", paddingTop: 40 }}>
//       <h2>Edit Quiz Question</h2>

//       {loading ? (
//         <Spin size="large" />
//       ) : (
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           <Form.Item
//             label="Question Text"
//             name="questionText"
//             rules={[{ required: true, message: "Please enter a question" }]}
//           >
//             <Input.TextArea rows={3} placeholder="Enter your question" />
//           </Form.Item>

//           <Form.Item label="Answer Type" name="answerType">
//             <Select disabled>
//               <Option value="TEXT">Text</Option>
//               <Option value="SINGLE_SELECT">Single Select</Option>
//               <Option value="MULTI_SELECT">Multi Select</Option>
//             </Select>
//           </Form.Item>

//           {(answerType === "SINGLE_SELECT" || answerType === "MULTI_SELECT") && (
//             <>
//               <Form.Item
//                 label="Options"
//                 name="options"
//                 rules={[{ required: true, message: "Please enter options" }]}
//               >
//                 <Checkbox.Group
//                   options={options}
//                   disabled
//                   style={{ display: "block" }}
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Correct Answer(s)"
//                 name="correctAnswer"
//                 rules={[{ required: true, message: "Please select correct answer(s)" }]}
//               >
//                 {answerType === "SINGLE_SELECT" ? (
//                   <Radio.Group>
//                     {options.map((opt, idx) => (
//                       <Radio key={idx} value={opt}>
//                         {opt}
//                       </Radio>
//                     ))}
//                   </Radio.Group>
//                 ) : (
//                   <Checkbox.Group>
//                     {options.map((opt, idx) => (
//                       <Checkbox key={idx} value={opt}>
//                         {opt}
//                       </Checkbox>
//                     ))}
//                   </Checkbox.Group>
//                 )}
//               </Form.Item>
//             </>
//           )}

//           {answerType === "TEXT" && (
//             <Form.Item
//               label="Correct Answer"
//               name="correctAnswer"
//               rules={[{ required: true, message: "Please enter the correct answer" }]}
//             >
//               <Input placeholder="Correct answer" />
//             </Form.Item>
//           )}

//           <Form.Item>
//             <Space>
//               <Button onClick={() => navigate(`/course-content/${courseId}/quizzes`)}>
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Save Changes
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       )}
//     </div>
//   );
// };

// export default QuizQuestionEditPage;

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Checkbox,
  Radio,
  Modal,
  message,
} from "antd";

const { Option } = Select;

const dummyData = [
  {
    questionId: "q1",
    questionText: "What is the capital of France?",
    answerType: "SINGLE_SELECT",
    options: ["Paris", "Rome", "Madrid", "Berlin"],
    correctAnswer: ["Paris"],
  },
  {
    questionId: "q2",
    questionText: "List all primary colors.",
    answerType: "MULTI_SELECT",
    options: ["Red", "Green", "Blue", "Yellow"],
    correctAnswer: ["Red", "Blue", "Yellow"],
  },
  {
    questionId: "q3",
    questionText: "Explain the concept of polymorphism in OOP.",
    answerType: "TEXT",
    correctAnswer: ["Polymorphism allows objects to take many forms."],
  },
];

const EditDummyQuestionModal = ({ open, onClose, questionId, onUpdate }) => {
  const [form] = Form.useForm();
  const [question, setQuestion] = useState(null);
  const [currentAnswerType, setCurrentAnswerType] = useState(null);

  // Dynamically watch options
  const options = Form.useWatch("options", form) || [];

  useEffect(() => {
    const found = dummyData.find((q) => q.questionId === questionId);
    if (found) {
      setQuestion(found);
      setCurrentAnswerType(found.answerType);
      form.setFieldsValue({
        questionText: found.questionText,
        answerType: found.answerType,
        options: found.options || [],
        correctAnswer: found.correctAnswer,
      });
    }
  }, [questionId, form]);

  const handleSubmit = (values) => {
    const updated = dummyData.map((q) =>
      q.questionId === questionId ? { ...q, ...values } : q
    );
    message.success("Question updated in dummy data");
    onUpdate(updated);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Edit Quiz Question"
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Update"
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Question Text"
          name="questionText"
          rules={[{ required: true, message: "Please enter question" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Answer Type" name="answerType">
          <Select
            onChange={(value) => {
              setCurrentAnswerType(value);
              form.setFieldsValue({
                options: [],
                correctAnswer: [],
              });
            }}
          >
            <Option value="TEXT">Text</Option>
            <Option value="SINGLE_SELECT">Single Select</Option>
            <Option value="MULTI_SELECT">Multi Select</Option>
          </Select>
        </Form.Item>

        {/* MCQ Options & Correct Answer */}
        {["SINGLE_SELECT", "MULTI_SELECT"].includes(currentAnswerType) && (
          <>
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  <label><b>Options</b></label>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[{ required: true, message: "Missing option" }]}
                      >
                        <Input placeholder={`Option ${name + 1}`} />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button onClick={() => remove(name)} danger type="link">
                          Remove
                        </Button>
                      )}
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      Add Option
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item
              label="Correct Answer"
              name="correctAnswer"
              rules={[{ required: true, message: "Please select the correct answer(s)" }]}
            >
              {currentAnswerType === "SINGLE_SELECT" ? (
                <Radio.Group>
                  {options.map((opt, idx) => (
                    <Radio key={idx} value={opt}>
                      {opt}
                    </Radio>
                  ))}
                </Radio.Group>
              ) : (
                <Checkbox.Group>
                  {options.map((opt, idx) => (
                    <Checkbox key={idx} value={opt}>
                      {opt}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              )}
            </Form.Item>
          </>
        )}

        {/* Text Answer */}
        {currentAnswerType === "TEXT" && (
          <Form.Item
            label="Correct Answer"
            name="correctAnswer"
            rules={[{ required: true, message: "Please provide a correct answer" }]}
          >
            <Input />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default EditDummyQuestionModal;

