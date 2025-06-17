import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Radio,
  Space,
  Typography,
  message,
} from "antd";

const { Option } = Select;
const { Title } = Typography;

const QuizModal = ({ open, onClose, course, onSubmit }) => {
  const [form] = Form.useForm();
  const [answerType, setAnswerType] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setAnswerType(null);
    }
  }, [open, form]);

  const handleAnswerTypeChange = (value) => {
    setAnswerType(value);
  };

  const handleAddAnother = async () => {
    try {
      const values = await form.validateFields();
      const quizData = {
        courseId: course?.courseId,
        ...values,
      };
      setSubmitting(true);
      const response = await onSubmit(quizData);

      if (response?.status === 200 || response?.success) {
        message.success("Question added successfully");
        form.resetFields();
        setAnswerType(null);
      } else {
        message.error("Failed to add question");
      }
    } catch (err) {
      message.error("Validation failed or question could not be added");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAndClose = async () => {
    try {
      const values = await form.validateFields();
      const quizData = {
        courseId: course?.courseId,
        ...values,
      };
      setSubmitting(true);
      const response = await onSubmit(quizData);

      if (response?.status === 200 || response?.success) {
        message.success("Quiz submitted successfully");
        onClose();
      } else {
        message.error("Failed to submit quiz");
      }
    } catch (err) {
      message.error("Validation failed or quiz could not be submitted");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={`Add Quiz to "${course?.title || ""}"`}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, message: "Please enter a question" }]}
        >
          <Input placeholder="Enter your quiz question" />
        </Form.Item>

        <Form.Item
          name="answerType"
          label="Answer Type"
          rules={[{ required: true, message: "Please select an answer type" }]}
        >
          <Select onChange={handleAnswerTypeChange} placeholder="Select answer type">
            <Option value="text">Text</Option>
            <Option value="mcq_single">MCQ (Single Option)</Option>
            <Option value="mcq_multiple">MCQ (Multiple Options)</Option>
          </Select>
        </Form.Item>

        {/* Text Answer */}
        {answerType === "text" && (
          <Form.Item
            name="textAnswer"
            label="Answer"
            rules={[{ required: true, message: "Please enter the answer" }]}
          >
            <Input placeholder="Type the correct answer" />
          </Form.Item>
        )}

        {/* MCQ Options */}
        {(answerType === "mcq_single" || answerType === "mcq_multiple") && (
          <>
            <Title level={5}>Options</Title>
            {[1, 2, 3, 4].map((num) => (
              <Form.Item
                key={`option${num}`}
                name={`option${num}`}
                label={`Option ${num}`}
                rules={[{ required: true, message: `Please enter option ${num}` }]}
              >
                <Input placeholder={`Enter option ${num}`} />
              </Form.Item>
            ))}

            {answerType === "mcq_single" && (
              <Form.Item
                name="correctOption"
                label="Correct Option"
                rules={[{ required: true, message: "Please select the correct option" }]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    {[1, 2, 3, 4].map((num) => (
                      <Radio key={num} value={`option${num}`}>
                        Option {num}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>
            )}

            {answerType === "mcq_multiple" && (
              <Form.Item
                name="correctOptions"
                label="Correct Option(s)"
                rules={[
                  {
                    required: true,
                    message: "Please select one or more correct options",
                    type: "array",
                  },
                ]}
              >
                <Select mode="multiple" placeholder="Select correct option(s)">
                  {[1, 2, 3, 4].map((num) => (
                    <Option key={`option${num}`} value={`option${num}`}>
                      Option {num}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </>
        )}

        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleAddAnother} loading={submitting}>
              Add Another Question
            </Button>
            <Button type="primary" onClick={handleSubmitAndClose} loading={submitting}>
              Submit Quiz
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuizModal;
