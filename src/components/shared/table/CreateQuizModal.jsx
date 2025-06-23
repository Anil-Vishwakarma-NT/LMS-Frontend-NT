import React from "react";
import { Modal, Form, Input, InputNumber, Switch, Button, message } from "antd";

const CreateQuizModal = ({ open, onClose, onCreate, course }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const quizData = {
        ...values,
        courseId: course.courseId,
      };
      console.log("quizData", quizData)
      const result = await onCreate(quizData); // API call
      if (result?.quizId) {
        message.success("Quiz created successfully");
        form.resetFields();
        onClose(result.quizId);
      } else {
        message.error("Failed to create quiz");
      }
    } catch (err) {
      message.error("Validation failed");
    }
  };

  return (
    <Modal
      title="Create New Quiz"
      open={open}
      onCancel={() => onClose(null)}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="time_limit" label="Time Limit (mins)">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="attempts_allowed" label="Attempts Allowed">
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="passing_score" label="Passing Score (%)">
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="randomize_questions" label="Randomize Questions" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="show_results" label="Show Results After Submit" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="is_active" label="Active" valuePropName="checked">
          <Switch defaultChecked />
        </Form.Item>
        {/* <Form.Item name="created_by" label="Created By" rules={[{ required: true }]}>
          <Input />
        </Form.Item> */}
        <Form.Item>
          <Button type="primary" onClick={handleSubmit} style={{ float: "right" }}>
            Create Quiz
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateQuizModal;
