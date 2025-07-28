// components/QuizAttemptDetailsModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Select,
  Space,
  Tag,
  Divider,
  Typography,
  Progress,
} from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const tryParseJSON = (value) => {
  if (!value || value === "null") return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "string") return [parsed];
    return [JSON.stringify(parsed)];
  } catch {
    return [value];
  }
};

const QuizAttemptDetailsModal = ({
  open,
  onClose,
  attempts = [],
}) => {
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(0);

  useEffect(() => {
    if (open) setSelectedAttemptIndex(0);
  }, [open]);

  const selectedAttempt = attempts[selectedAttemptIndex];
  const score = selectedAttempt?.parsedScoreDetails;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={`Detailed Result - Attempt ${selectedAttempt?.quizAttempt?.attempt || ""}`}
      footer={null}
      width={800}
      centered
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Select
          value={selectedAttemptIndex}
          onChange={(value) => setSelectedAttemptIndex(value)}
          style={{ width: 200 }}
        >
          {attempts.map((item, index) => (
            <Option key={index} value={index}>
              Attempt {item.quizAttempt.attempt}
            </Option>
          ))}
        </Select>

        {score && (
          <>
            <Space direction="vertical" size="small">
              <Text><b>Total Score:</b> {score.totalScore}</Text>
              <Text><b>Max Possible Score:</b> {score.maxPossibleScore}</Text>
              <Text><b>Correct Answers:</b> {score.correctAnswers} / {score.totalQuestions}</Text>
              <Text><b>Percentage Score:</b> {score.percentageScore}%</Text>
              <Text><b>Submission Type:</b> {score.submissionType}</Text>
              <Text><b>Submitted At:</b> {new Date(score.submittedAt).toLocaleString()}</Text>
              <Progress
                percent={score.percentageScore}
                status={score.percentageScore >= 50 ? "success" : "exception"}
                strokeColor={score.percentageScore >= 50 ? "#52c41a" : "#ff4d4f"}
              />
            </Space>
            <Divider />
          </>
        )}

        <Space wrap size="middle" style={{ marginBottom: 16, marginTop: 16 }}>
          <Tag color="#52c41a">✅ Selected & Correct</Tag>
          <Tag color="#ff4d4f">❌ Selected & Incorrect</Tag>
          <Tag color="#1890ff">✔ Missed Correct</Tag>
        </Space>

        {(selectedAttempt?.userResponses || []).map((response, index) => {
          const userAnswers = tryParseJSON(response.userAnswer);
          const correctAnswers = tryParseJSON(response.correctAnswer);
          const allOptions = tryParseJSON(response.options || "");
          const isCorrect = response.isCorrect;

          return (
            <div
              key={response.responseId}
              style={{
                marginBottom: "24px",
                padding: "20px",
                borderRadius: "10px",
                backgroundColor: "#fff",
                border: "1px solid #f0f0f0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <Title level={5} style={{ marginBottom: 16 }}>
                {`${index + 1}. ${response.questionText}`}
              </Title>

              {allOptions.length > 0 ? (
                allOptions.map((option, idx) => {
                  const selected = userAnswers.includes(option);
                  const isCorrectAnswer = correctAnswers.includes(option);

                  let bgColor = "#f9f9f9";
                  let borderColor = "#d9d9d9";
                  let icon = null;
                  let fontWeight = 400;

                  if (selected && isCorrectAnswer) {
                    bgColor = "#f6ffed";
                    borderColor = "#b7eb8f";
                    icon = "✅";
                    fontWeight = 600;
                  } else if (selected && !isCorrectAnswer) {
                    bgColor = "#fff1f0";
                    borderColor = "#ffa39e";
                    icon = "❌";
                    fontWeight = 600;
                  } else if (!selected && isCorrectAnswer) {
                    bgColor = "#e6f7ff";
                    borderColor = "#91d5ff";
                    icon = "✔";
                    fontWeight = 600;
                  }

                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: bgColor,
                        border: `1px solid ${borderColor}`,
                        borderRadius: "6px",
                        padding: "10px 16px",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "15px",
                        fontWeight,
                      }}
                    >
                      {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
                      {option}
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #f0f0f0",
                    borderRadius: "6px",
                    padding: "12px 16px",
                    marginBottom: "10px",
                  }}
                >
                  <Text><b>Your Answer:</b> </Text>
                  {userAnswers?.[0] ? (
                    <Text>{userAnswers[0]}</Text>
                  ) : (
                    <Text type="secondary"><i>(No answer provided)</i></Text>
                  )}

                  <div
                    style={{
                      backgroundColor: isCorrect ? "#f6ffed" : "#fff1f0",
                      border: `1px solid ${isCorrect ? "#b7eb8f" : "#ffa39e"}`,
                      borderRadius: "6px",
                      padding: "12px 16px",
                      marginTop: 10,
                    }}
                  >
                    {isCorrect ? (
                      <Text type="success">✅ <b>Correct Answer!</b></Text>
                    ) : (
                      <>
                        <Text type="danger">❌ <b>Your Answer:</b> {userAnswers?.[0]}</Text><br />
                        <Text type="secondary">✔ <b>Correct Answer:</b> {correctAnswers?.[0]}</Text>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Space>
    </Modal>
  );
};

export default QuizAttemptDetailsModal;
