
import React from "react";
import { Modal, Descriptions, Tag } from "antd";

const ViewQuestionModal = ({ open, onClose, question }) => {
  if (!question) return null;
  const parsedOptions = Array.isArray(question.options)
    ? question.options
    : typeof question.options === "string"
      ? JSON.parse(question.options)
      : [];


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
        <Tag color="blue">{question.questionType}</Tag>
      </Descriptions.Item>

      <Descriptions.Item label="Points">
        {question.points}
      </Descriptions.Item>

      <Descriptions.Item label="Position">
        {question.position}
      </Descriptions.Item>

      {/* Safely parse options */}
      {question.options && (() => {
        let parsedOptions = [];
        try {
          parsedOptions = Array.isArray(question.options)
            ? question.options
            : JSON.parse(question.options);
        } catch (e) {
          parsedOptions = [];
        }

        return (
          parsedOptions.length > 0 && (
            <Descriptions.Item label="Options">
              {parsedOptions.map((opt, idx) => (
                <Tag key={idx} color="cyan">{opt}</Tag>
              ))}
            </Descriptions.Item>
          )
        );
      })()}

      {/* Safely parse correctAnswer */}
      <Descriptions.Item label="Correct Answer(s)">
        {(() => {
          let parsedAnswers = [];
          try {
            parsedAnswers = Array.isArray(question.correctAnswer)
              ? question.correctAnswer
              : JSON.parse(question.correctAnswer);
          } catch (e) {
            parsedAnswers = [question.correctAnswer];
          }

          return parsedAnswers.map((ans, idx) => (
            <Tag key={idx} color="green">{ans}</Tag>
          ));
        })()}
      </Descriptions.Item>
    </Descriptions>
  </Modal>
);
};

export default ViewQuestionModal;
