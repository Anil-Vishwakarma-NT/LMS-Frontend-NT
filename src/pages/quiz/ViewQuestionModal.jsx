
import React from "react";
import { Modal, Descriptions, Tag } from "antd";

const ViewQuestionModal = ({ open, onClose, question }) => {
  if (!question) return null;

  return (
    <Modal
      title="Quiz Question Details"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Question Text">
          {question.questionText}
        </Descriptions.Item>
        <Descriptions.Item label="Answer Type">
          <Tag color="blue">{question.answerType}</Tag>
        </Descriptions.Item>
        {question.options && (
          <Descriptions.Item label="Options">
            {question.options.map((opt, idx) => (
              <Tag key={idx} color="cyan">{opt}</Tag>
            ))}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Correct Answer(s)">
          {Array.isArray(question.correctAnswer)
            ? question.correctAnswer.map((ans, idx) => (
                <Tag key={idx} color="green">{ans}</Tag>
              ))
            : <Tag color="green">{question.correctAnswer}</Tag>}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewQuestionModal;
