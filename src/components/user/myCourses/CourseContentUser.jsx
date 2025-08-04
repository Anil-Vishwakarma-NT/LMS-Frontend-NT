import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { app } from "../../../service/serviceLMS";
import UserHOC from "../../shared/HOC/UserHOC";
import "../../admin/booksAdmin/BooksAdmin.css";
import QuizAttemptDetailsModal from "./QuizAttemptDetailsModal";
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

  useEffect(() => {
    if (quizResult) setShowResultModal(true);
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

  return (
    <div className="admin-section">
      <div className="admin-page-mid">
        <Title level={3}>{`Course Content for "${courseTitle}"`}</Title>
        <div className="action-buttons">
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
            className="add-btn"
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
      <QuizAttemptDetailsModal
        open={showDetailedResult}
        onClose={() => setShowDetailedResult(false)}
        attempts={attempts}
      />
    </div>
  );
};

export default UserHOC(CourseContent);
