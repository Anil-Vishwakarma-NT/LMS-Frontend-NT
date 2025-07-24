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
  Divider,
  Progress,
  Select,
  Table,
  Tag,
  
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
  const [showResultModal, setShowResultModal] = useState(true);
  const [showDetailedResult, setShowDetailedResult] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(0);

  const [courseContent, setCourseContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [contentIds, setContentIds] = useState([]);

  const auth = useSelector((state) => state.auth);
  const userId = auth?.userId || Number(localStorage.getItem("userId"));

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
  const overallResponse = selectedAttempt?.overallResponse;
  const score = selectedAttempt?.parsedScoreDetails;

  const columns = [
    {
      title: "Question ID",
      dataIndex: "questionId",
      key: "questionId",
    },
    {
      title: "Question",
      dataIndex: "questionText",
      key: "questionText",
      render: (text) => <Text>{text}</Text>,
    },
    {
  title: "Your Answer",
  dataIndex: "userAnswer",
  key: "userAnswer",
  render: (val, record) => {
    const answers = JSON.parse(val);
    const isCorrect = record.pointsEarned > 0;

    const backgroundColor = isCorrect ? "#f6ffed" : "#fff1f0";
    const borderColor = isCorrect ? "#b7eb8f" : "#ffa39e";
    const icon = isCorrect ? "✔" : "✖";
    const tooltipText = isCorrect ? "Correct" : "Wrong";

    return (
      <span>
        {answers.map((ans, idx) => (
          <span key={idx} title={tooltipText}>
            <Tag
              style={{
                backgroundColor,
                borderColor,
                color: "rgba(0, 0, 0, 0.85)",
                marginBottom: "4px",
              }}
            >
              {icon} {ans}
            </Tag>
          </span>
        ))}
      </span>
    );
  },
},
{
  title: "Correct Answer",
  dataIndex: "correctAnswer",
  key: "correctAnswer",
  render: (val) => {
    try {
      const parsed = JSON.parse(val);
      return parsed.map((ans, idx) => (
        <Tag
          key={idx}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #d9d9d9",
            color: "rgba(0, 0, 0, 0.85)",
            marginBottom: "4px",
          }}
        >
          {ans}
        </Tag>
      ));
    } catch {
      return val;
    }
  },
},
    {
      title: "Points Earned",
      dataIndex: "pointsEarned",
      key: "pointsEarned",
    },
  ];

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
          <Button
            onClick={() => {
              fetchDetailedAttempts();     // fetch data if not already
              setShowDetailedResult(true); // open modal
            }}
            icon={<BarChartOutlined />}
          >
          View Attempts
        </Button>
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

      <Modal
        open={showDetailedResult}
        onCancel={() => setShowDetailedResult(false)}
        title={`Detailed Result - Attempt ${selectedAttempt?.quizAttempt?.attempt || ""}`}
        footer={null}
        width="90vw"
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

          {overallResponse && (
            <div>
              <Text strong>Overall Feedback:</Text> <Text>{overallResponse}</Text>
            </div>
          )}

          <Table
            columns={columns}
            dataSource={selectedAttempt?.userResponses || []}
            pagination={false}
            rowKey="responseId"
          />
        </Space>
      </Modal>
    </div>
  );
};

export default UserHOC(CourseContent);
