import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { app } from "../../../service/serviceLMS";
import UserHOC from "../../shared/HOC/UserHOC";
import "../../admin/booksAdmin/BooksAdmin.css";
import { BarChartOutlined } from "@ant-design/icons";

import {
  Button,
  Input,
  Typography,
  Modal,
  Space,
  Select,
  Tag,
  Tooltip,
  message,
  Divider,
  Progress
} from "antd";

import UserCourseContentTable from "../../shared/table/UserCourseContentTable";
import { fetchCourseContentByCourseId, fetchCourseById } from "../../../service/BookService";
import { fetchContentProgress } from "../../../service/UserCourseService";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;
const { Option } = Select;

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const quizResult = location.state?.quizResult;

  const [showResultModal, setShowResultModal] = useState(false);
  const [showDetailedResult, setShowDetailedResult] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(0);
  const [allAttempts, setAllAttempts] = useState([]);

  const [courseContent, setCourseContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [contentIds, setContentIds] = useState([]);

  const auth = useSelector((state) => state.auth);
  const userId = auth?.userId || Number(localStorage.getItem("userId"));

  // Show result modal on first load if quizResult is passed from previous screen
  useEffect(() => {
    if (quizResult) {
      setShowResultModal(true);
    }
  }, [quizResult]);

  useEffect(() => {
    const loadCourseName = async () => {
      try {
        const course = await fetchCourseById(courseId);
        setCourseTitle(course.title);
      } catch (error) {
        setErrorMessage("Failed to fetch course title.");
        console.error("Error fetching course title:", error);
      }
    };
    loadCourseName();
  }, [courseId]);

  useEffect(() => {
    const loadCourseContent = async () => {
      try {
        const contentData = await fetchCourseContentByCourseId(courseId);
        const enrichedData = await Promise.all(
          contentData.map(async (item) => {
            const completion = await fetchContentProgress(userId, courseId, item.courseContentId);
            return {
              contentId: item.courseContentId,
              title: item.title,
              description: item.description,
              resourceLink: item.resourceLink,
              completionPercentage: parseFloat(completion.toFixed(2)),
            };
          })
        );
        setCourseContent(enrichedData);
        setFilteredContent(enrichedData);
        setContentIds(enrichedData.map((item) => item.contentId));
      } catch (error) {
        setErrorMessage("Failed to fetch course content.");
        console.error("Error fetching content:", error);
      }
    };

    loadCourseContent();
  }, [courseId]);

  useEffect(() => {
    let filtered = courseContent;
    if (searchTerm.trim()) {
      filtered = filtered.filter((content) =>
        content.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredContent(filtered);
  }, [searchTerm, courseContent]);

  useEffect(() => {
    const fetchAllAttempts = async () => {
      try {
        const response = await app.get(
          `/course/api/client-api/quiz-attempt/user/${userId}/quiz/course/${courseId}`
        );
        setAllAttempts(response?.data?.data || []);
      } catch (err) {
        console.error("Error fetching previous attempts:", err);
        setAllAttempts([]);
      }
    };

    fetchAllAttempts();
  }, [courseId, userId]);

  const fetchDetailedAttempts = async () => {
    try {
      const response = await app.get(
        `/course/api/client-api/quiz-attempt/user/${userId}/quiz/course/${courseId}`
      );
      const sorted = response.data.data.sort((a, b) => b.quizAttempt.attempt - a.quizAttempt.attempt);

      const enriched = sorted.map((item) => ({
        ...item,
        parsedScoreDetails: JSON.parse(item.quizAttempt.scoreDetails),
      }));

      setAttempts(enriched);
      setSelectedAttemptIndex(0);
      setShowDetailedResult(true);
    } catch (error) {
      console.error("Failed to fetch detailed quiz attempts:", error);
    }
  };


  const selectedAttempt = attempts[selectedAttemptIndex];
  const score = selectedAttempt?.parsedScoreDetails;
  const tryParseJSON = (value) => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return value ? [value] : [];
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-page-mid">
        <Title level={3}>{`Course Content for "${courseTitle}"`}</Title>
        <div className="search-container">
          <Input
            placeholder="Search by title"
            className="searchbar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 300 }}
          />
        </div>
        <div className="action-buttons">
          <Button onClick={() => navigate("/my-courses")} className="common-btn">
            Back to Courses
          </Button>
          <Button
            onClick={() => navigate(`/quiz/${courseId}?userId=${userId}`)}
            className="common-btn"
          >
            Attempt Quiz
          </Button>
          <Tooltip title={allAttempts.length === 0 ? "No attempts yet" : "View previous attempts"}>
            <Button
              onClick={fetchDetailedAttempts}
              icon={<BarChartOutlined />}
              disabled={allAttempts.length === 0}
            >
              View Attempts
            </Button>
          </Tooltip>
        </div>
      </div>

      {filteredContent.length === 0 && !errorMessage ? (
        <div className="no-data-found">No content available for this course.</div>
      ) : (
        <UserCourseContentTable
          fields={[
            { index: 1, title: "Title" },
            { index: 2, title: "Description" },
            { index: 4, title: "Resource Link" },
          ]}
          entries={filteredContent}
          courseId={courseId}
        />
      )}

      {/* ✅ Quiz Result Modal */}
      {quizResult && showResultModal && (
        <Modal
          open={true}
          onCancel={() => setShowResultModal(false)}
          title={
            <Title level={4} style={{ marginBottom: 0 }}>
              {quizResult.percentageScore >= (quizResult.passingScore ?? 50)
                ? "Congratulations! You Passed"
                : "Result Summary"}
            </Title>
          }
          footer={[
            <Button
              key="back"
              onClick={() => {
                setShowResultModal(false);
                navigate(location.pathname, { replace: true });
              }}
            >
              Back to Course
            </Button>,
            <Button key="details" type="primary" onClick={fetchDetailedAttempts}>
              View Detailed Result
            </Button>,
          ]}
          centered
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong>Correct Answers:</Text>{" "}
              <Text type="success">{quizResult.correctAnswers}</Text>
            </div>
            <div>
              <Text strong>Percentage Score:</Text>{" "}
              <Text type="secondary">{quizResult.percentageScore}%</Text>
            </div>
            <div>
              <Text strong>Total Score:</Text>{" "}
              <Text style={{ color: "#d48806" }}>{quizResult.totalScore}</Text>
            </div>
            <Divider style={{ margin: "8px 0" }} />
            <Progress
              percent={quizResult.percentageScore}
              status={quizResult.percentageScore >= (quizResult.passingScore ?? 50) ? "success" : "exception"}
              strokeColor={quizResult.percentageScore >= (quizResult.passingScore ?? 50) ? "#52c41a" : "#ff4d4f"}
              showInfo={true}
            />
          </Space>
        </Modal>
      )}

      {/* ✅ Attempt Details Modal */}
      <Modal
        open={showDetailedResult}
        onCancel={() => setShowDetailedResult(false)}
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
            <div>
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
            </div>
          )}

          <Space wrap size="middle" style={{ marginBottom: 16, marginTop: 16 }}>
            <Tag color="#52c41a">✅ Selected & Correct</Tag>
            <Tag color="#ff4d4f">❌ Selected & Incorrect</Tag>
            <Tag color="#1890ff">✔ Missed Correct</Tag>
          </Space>

          {(selectedAttempt?.userResponses || []).map((response, index) => {
            const userAnswers = tryParseJSON(response.userAnswer);
            const correctAnswers = tryParseJSON(response.correctAnswer);
            const allOptions = tryParseJSON(response.options || []);
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

                <div>
                  {allOptions.length > 0 ? (
                    allOptions.map((option, idx) => {
                      const selected = userAnswers.includes(option);
                      const isCorrectAnswer = correctAnswers.includes(option);

                      let bgColor = "#f9f9f9";
                      let borderColor = "#d9d9d9";
                      let icon = null;
                      let fontWeight = 400;

                      if (selected && isCorrectAnswer) {
                        bgColor = "#f6ffed"; borderColor = "#b7eb8f"; icon = "✅"; fontWeight = 600;
                      } else if (selected && !isCorrectAnswer) {
                        bgColor = "#fff1f0"; borderColor = "#ffa39e"; icon = "❌"; fontWeight = 600;
                      } else if (!selected && isCorrectAnswer) {
                        bgColor = "#e6f7ff"; borderColor = "#91d5ff"; icon = "✔"; fontWeight = 600;
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
                            fontWeight: fontWeight,
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
                      <Text>
                        <b>Your Answer:</b>{" "}
                        {userAnswers?.[0] ? (
                          <span>{userAnswers[0]}</span>
                        ) : (
                          <i>(No answer provided)</i>
                        )}
                      </Text>
                      <div
                        style={{
                          backgroundColor: isCorrect ? "#f6ffed" : "#fff1f0",
                          border: `1px solid ${isCorrect ? "#b7eb8f" : "#ffa39e"}`,
                          borderRadius: "6px",
                          padding: "12px 16px",
                          marginBottom: "10px",
                        }}
                      >
                        <Text>
                          {isCorrect ? (
                            <>
                              ✅ <b>Correct Answer:</b> {userAnswers?.[0] || <i>(No answer provided)</i>}
                            </>
                          ) : (
                            <>
                              ❌ <b>Your Answer:</b> {userAnswers?.[0] || <i>(No answer provided)</i>}
                              <br />
                              ✔ <b>Correct Answer:</b> {correctAnswers?.[0]}
                            </>
                          )}
                        </Text>
                      </div>
                    </div>
                  )}
                </div>

                {isCorrect && (
                  <div style={{ marginTop: 12 }}>
                    <Text type="success">✅ <b>Correct Answer!</b></Text>
                  </div>
                )}
              </div>
            );
          })}
        </Space>
      </Modal>
    </div>
  );
};

export default UserHOC(CourseContent);
