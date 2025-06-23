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
    "position"
  ];

  if (answerType === "TEXT") {
    fieldNames.push("textAnswer");
  }

  const values = await form.validateFields(fieldNames);

  // Determine correctAnswer
  let correctAnswer;
  if (answerType === "TEXT") {
    if (!values.textAnswer?.trim()) {
      return message.error("Please enter the correct answer.");
    }
    correctAnswer = [values.textAnswer.trim()]; // ✅ wrap in array
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
        ? "SINGLE_CHOICE"
        : "MULTIPLE_CHOICE",
    options: answerType === "TEXT" ? null : options, // ❗ null for TEXT type
    correctAnswer, // ✅ always List<String>
    points: parseFloat(values.points),
    explanation: values.explanation || "",
    required: !!values.required,
    position: parseInt(values.position),
  };

  console.log("📤 Final Payload:", payload);

  try {
    await axios.post("http://localhost:8080/api/quiz-questions", payload);
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
          {answerType === "TEXT" && (
            <Form.Item
              label="Correct Answer"
              name="textAnswer"
              rules={[{ required: true, message: "Please enter correct answer" }]}
            >
              <Input placeholder="Enter correct answer" />
            </Form.Item>
          )}

          {(answerType === "SINGLE_SELECT" || answerType === "MULTI_SELECT") && (
            <>
              <label>Options</label>
              {options.map((opt, idx) => (
                <Space key={idx} style={{ marginBottom: 8 }}>
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
                  />
                  <MinusCircleOutlined
                    onClick={() => setOptions(options.filter((_, i) => i !== idx))}
                  />
                </Space>
              ))}
              <Button
                icon={<PlusOutlined />}
                onClick={() => setOptions([...options, ""])}
                style={{ margin: "12px 0" }}
              >
                Add Option
              </Button>

              <Form.Item label="Correct Answer(s)">
                {answerType === "SINGLE_SELECT" ? (
                  <Radio.Group
                    value={correctAnswers[0] || ""}
                    onChange={(e) => setCorrectAnswers([e.target.value])}
                  >
                    {options.map((opt, idx) => (
                      <Radio key={idx} value={opt}>
                        {opt}
                      </Radio>
                    ))}
                  </Radio.Group>
                ) : (
                  <Checkbox.Group
                    value={correctAnswers}
                    onChange={setCorrectAnswers}
                  >
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

          <Form.Item
            label="Points"
            name="points"
            rules={[{ required: true, message: "Enter point value" }]}
          >
            <Input type="number" min={0.1} step={0.1} />
          </Form.Item>

          <Form.Item label="Explanation" name="explanation">
            <Input.TextArea rows={2} placeholder="Optional explanation for the answer" />
          </Form.Item>

          <Form.Item label="Required Question" name="required" valuePropName="checked">
            <Checkbox />
          </Form.Item>

          <Form.Item
            label="Position in Quiz"
            name="position"
            rules={[{ required: true, message: "Enter position" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Space>
            <Button onClick={() => setStep(2)}>Back</Button>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Space>
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
        onCancel();
      }}
    >
      <Form layout="vertical" form={form}>
        {renderStep()}
      </Form>
    </Modal>
  );
};

export default QuizQuestionModal;
