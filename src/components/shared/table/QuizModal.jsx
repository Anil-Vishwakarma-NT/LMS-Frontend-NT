import React from "react";
import { Modal, Form, Input, InputNumber, Switch, Button } from "antd";

const QuizModal = ({ open, onClose, onSubmit, course }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values); // Submit metadata to parent (CourseTable)
    form.resetFields(); // Optional: Reset form
  };

  return (
    <Modal
      open={open}
      title={`Create Quiz for "${course?.title}"`}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      destroyOnClose
    >
    <Form
  form={form}
  layout="vertical"
  onFinish={handleFinish}
  initialValues={{ isActive: true, randomizeQuestions: false, showResultsAfterSubmission: false }}
>
  <Form.Item
    label="Quiz Title"
    name="title"
    rules={[{ required: true, message: "Please enter the quiz title" }]}
  >
    <Input />
  </Form.Item>

  <Form.Item label="Description" name="description">
    <Input.TextArea rows={3} />
  </Form.Item>

  <Form.Item
    label="Time Limit (in minutes)"
    name="timeLimit"
    rules={[{ required: true, message: "Enter time limit in minutes" }]}
  >
    <InputNumber min={1} style={{ width: "100%" }} />
  </Form.Item>

  <Form.Item
    label="Attempts Allowed"
    name="attemptsAllowed"
    rules={[{ required: true, message: "Enter allowed attempts" }]}
  >
    <InputNumber min={1} style={{ width: "100%" }} />
  </Form.Item>

  <Form.Item
    label="Passing Score (%)"
    name="passingScore"
    rules={[{ required: true, message: "Enter passing score (%)" }]}
  >
    <InputNumber min={0} max={100} style={{ width: "100%" }} />
  </Form.Item>

  <Form.Item label="Randomize Questions" name="randomizeQuestions" valuePropName="checked">
    <Switch />
  </Form.Item>

  <Form.Item label="Show Results After Submission" name="showResultsAfterSubmission" valuePropName="checked">
    <Switch />
  </Form.Item>

  <Form.Item label="Active?" name="isActive" valuePropName="checked">
    <Switch defaultChecked />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit" block>
      Submit
    </Button>
  </Form.Item>
</Form>
    </Modal>
  );
};

export default QuizModal;
