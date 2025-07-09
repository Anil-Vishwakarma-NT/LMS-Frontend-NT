import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Checkbox } from "antd";

const QuizMetadataModal = ({ open, onClose, quiz, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (quiz) {
      form.setFieldsValue(quiz);
    } else {
      form.resetFields();
    }
  }, [quiz, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  return (
    <Modal
      open={open}
      title={quiz ? "Edit Quiz Metadata" : "Create Quiz"}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form layout="vertical" form={form}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="timeLimit" label="Time Limit (mins)">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item name="attemptsAllowed" label="Attempts Allowed">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item name="passingScore" label="Passing Score (%)">
          <InputNumber min={0} max={100} />
        </Form.Item>
        <Form.Item name="randomizeQuestions" valuePropName="checked">
          <Checkbox>Randomize Questions</Checkbox>
        </Form.Item>
        <Form.Item name="showResults" valuePropName="checked">
          <Checkbox>Show Results</Checkbox>
        </Form.Item>
        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Is Active</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuizMetadataModal;
