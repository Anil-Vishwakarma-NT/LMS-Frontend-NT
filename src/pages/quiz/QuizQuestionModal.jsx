import { app, appCourse } from "../../service/serviceLMS";
import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  Checkbox,
  Radio,
  message,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import {app} from "../../service/serviceLMS";

const { Option } = Select;

const QuizQuestionModal = ({ open, onCancel, onSuccess, courseId, quizId }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [answerType, setAnswerType] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const handleQuestionNext = async () => {
    try {
      await form.validateFields(["questionText"]);
      setStep(2);
    } catch {}
  };

  const handleTypeNext = async () => {
    try {
      const { answerType } = await form.validateFields(["answerType"]);
      setAnswerType(answerType);
      setStep(3);
    } catch {}
  };

 const handleSubmit = async () => {
  const fieldNames = [
    "questionText",
    "answerType",
    "points",
    "explanation",
    "required",
    // "position"
  ];

  if (answerType === "TEXT") {
    fieldNames.push("textAnswer");
  }

  const values = await form.validateFields(fieldNames);

  // Determine correctAnswer
  let correctAnswer;
  if (answerType === "TEXT") {
  correctAnswer = [values.textAnswer.trim()];
} else {
    if (options.length < 2) {
      return message.error("Add at least 2 options.");
    }
    if (!correctAnswers.length) {
      return message.error("Please select at least one correct answer.");
    }

    correctAnswer = answerType === "SINGLE_SELECT"
      ? [correctAnswers[0]] // ✅ wrap single value in array
      : correctAnswers;     // ✅ already an array
  }

  const payload = {
  quizId,
  questionText: values.questionText,
  questionType:
    answerType === "TEXT"
      ? "SHORT_ANSWER"
      : answerType === "SINGLE_SELECT"
      ? "MCQ_SINGLE"
      : "MCQ_MULTIPLE",
  options: answerType === "TEXT" ? null : JSON.stringify(options),
  correctAnswer: JSON.stringify(correctAnswer),
  points: parseFloat(values.points),
  explanation: values.explanation || "",
  required: !!values.required,
//   position: parseInt(values.position),
};

  console.log("📤 Final Payload:", payload);

  try {
    await app.post("course/api/service-api/quiz-questions", payload);
    message.success("Question added successfully");
    form.resetFields();
    setStep(1);
    setAnswerType(null);
    setOptions([]);
    setCorrectAnswers([]);
    onSuccess();
  } catch (error) {
    console.error(error);
    message.error("Failed to add question");
  }
};

  const renderStep = () => {
    if (step === 1) {
      return (
        <>
          <Form.Item
            label="Enter Question"
            name="questionText"
            rules={[{ required: true, message: "Please enter the question" }]}
          >
            <Input.TextArea placeholder="Type your question..." rows={3} />
          </Form.Item>
          <Button type="primary" onClick={handleQuestionNext}>
            Next
          </Button>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <Form.Item
            label="Select Answer Type"
            name="answerType"
            rules={[{ required: true, message: "Please choose an answer type" }]}
          >
            <Select placeholder="Choose answer type">
              <Option value="TEXT">Text Answer</Option>
              <Option value="SINGLE_SELECT">Single Select MCQ</Option>
              <Option value="MULTI_SELECT">Multi Select MCQ</Option>
            </Select>
          </Form.Item>
          <Space>
            <Button onClick={() => setStep(1)}>Back</Button>
            <Button type="primary" onClick={handleTypeNext}>
              Next
            </Button>
          </Space>
        </>
      );
    }

    if (step === 3) {
  return (
    <>
      {/* TEXT TYPE */}
      {answerType === "TEXT" && (
        <Form.Item
          label="Correct Answer"
          name="textAnswer"
          rules={[{ required: true, message: "Please enter the correct answer" }]}
        >
          <Input placeholder="Enter correct answer" />
        </Form.Item>
      )}

      {/* SELECT TYPES */}
      {(answerType === "SINGLE_SELECT" || answerType === "MULTI_SELECT") && (
        <>
          <Form.Item label="Options" required>
            {options.map((opt, idx) => (
              <Space key={idx} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                <Input
                  value={opt}
                  onChange={(e) =>
                    setOptions([
                      ...options.slice(0, idx),
                      e.target.value,
                      ...options.slice(idx + 1),
                    ])
                  }
                  placeholder={`Option ${idx + 1}`}
                  style={{ width: 300 }}
                />
                <MinusCircleOutlined
                  onClick={() => setOptions(options.filter((_, i) => i !== idx))}
                  style={{ color: "#ff4d4f", cursor: "pointer" }}
                />
              </Space>
            ))}
            <Button
              icon={<PlusOutlined />}
              onClick={() => setOptions([...options, ""])}
              type="dashed"
            >
              Add Option
            </Button>
          </Form.Item>

          <Form.Item label="Correct Answer(s)" required>
            {answerType === "SINGLE_SELECT" ? (
              <Radio.Group
                value={correctAnswers[0] || ""}
                onChange={(e) => setCorrectAnswers([e.target.value])}
              >
                <Space direction="vertical">
                  {options.map((opt, idx) => (
                    <Radio key={idx} value={opt}>
                      {opt}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            ) : (
              <Checkbox.Group value={correctAnswers} onChange={setCorrectAnswers}>
                <Space direction="vertical">
                  {options.map((opt, idx) => (
                    <Checkbox key={idx} value={opt}>
                      {opt}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            )}
          </Form.Item>
        </>
      )}

      <Form.Item
        label="Points"
        name="points"
        rules={[{ required: true, message: "Enter point value" }]}
      >
        <Input type="number" min={0.1} step={0.1} placeholder="e.g. 5.0" style={{ width: 200 }} />
      </Form.Item>

      <Form.Item label="Explanation" name="explanation">
        <Input.TextArea rows={2} placeholder="Optional explanation for the answer" />
      </Form.Item>

      <Form.Item
        label="Required Question"
        name="required"
        valuePropName="checked"
      >
        <Checkbox>Check if question must be answered</Checkbox>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button onClick={() => setStep(2)}>Back</Button>
          <Button type="primary" onClick={handleSubmit}>Submit</Button>
        </Space>
      </Form.Item>
    </>
  );
}

  };

  return (
    <Modal
      open={open}
      title="Add Quiz Question"
      footer={null}
      onCancel={() => {
        setStep(1);
        setAnswerType(null);
        setOptions([]);
        setCorrectAnswers([]);
        form.resetFields();
        if (onCancel) onCancel();
      }}
    >
      <Form layout="vertical" form={form}>
        {renderStep()}
      </Form>
    </Modal>
  );
};

export default QuizQuestionModal;
