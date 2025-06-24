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
import axios from "axios";

const { Option } = Select;

const EditQuizQuestionModal = ({ open, onClose, quizId, questionId, onUpdate }) => {
  const [form] = Form.useForm();
  const [currentAnswerType, setCurrentAnswerType] = useState(null);

  // Dynamically watch options
  const options = Form.useWatch("options", form) || [];

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/quiz-questions/${questionId}`);
        const data = res.data?.data;

        if (data) {
          setCurrentAnswerType(data.questionType);
          form.setFieldsValue({
            questionText: data.questionText,
            answerType: data.questionType,
            options: data.options || [],
            correctAnswer: data.correctAnswer || [],
            points: data.points,
          });
        }
      } catch (error) {
        console.error("Failed to fetch question:", error);
        message.error("Could not load question data");
      }
    };

    if (questionId && open) {
      fetchQuestion();
    }
  }, [questionId, form, open]);

const handleSubmit = async (values) => {
  try {
    // Determine correctAnswer structure based on type
    let correctAnswer = null;

    if (values.answerType === "TEXT") {
      correctAnswer = JSON.stringify([values.correctAnswer]); // wrap in array and stringify
    } else if (values.answerType === "SINGLE_SELECT") {
      correctAnswer = JSON.stringify([values.correctAnswer]); // wrap in array and stringify
    } else if (values.answerType === "MULTI_SELECT") {
      correctAnswer = JSON.stringify(values.correctAnswer); // already array
    }

    const payload = {
      questionText: values.questionText,
      questionType:
        values.answerType === "TEXT"
          ? "SHORT_ANSWER"
          : values.answerType === "SINGLE_SELECT"
          ? "MCQ_SINGLE"
          : "MCQ_MULTIPLE",
      options:
        ["SINGLE_SELECT", "MULTI_SELECT"].includes(values.answerType) && values.options
          ? JSON.stringify(values.options)
          : null,
      correctAnswer,
      position: values.position,
      points: values.points
    };

    await axios.put(`http://localhost:8080/api/quiz-questions/${questionId}`, payload);

    message.success("Question updated successfully");
    if (onUpdate) onUpdate(); // Trigger parent refresh
    onClose();
  } catch (err) {
    console.error("Failed to update question:", err);
    message.error("Failed to update question");
  }
};


  return (
    <Modal
      open={open}
      title="Edit Quiz Question"
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Update"
      destroyOnClose
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
        <Form.Item
        label="Points"
        name="points"
        rules={[{ required: true, message: "Please enter the points" }]}
        >
        <Input type="number" min={0} step={1} />
        </Form.Item>
        <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: "Please enter the question position" }]}
            >
            <Input type="number" min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditQuizQuestionModal;
