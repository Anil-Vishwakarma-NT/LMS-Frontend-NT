import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation  } from "react-router-dom";
import UserHOC from "../../shared/HOC/UserHOC"; 
import "../../admin/booksAdmin/BooksAdmin.css";
import { Button, Input, Typography, Modal  } from "antd";
import UserCourseContentTable from "../../shared/table/UserCourseContentTable";
import { fetchCourseContentByCourseId, fetchCourseById, } from "../../../service/BookService";
import { fetchContentProgress } from "../../../service/UserCourseService";
import { useSelector } from "react-redux";

const { Title } = Typography;

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseContent, setCourseContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [contentIds, setContentIds] = useState([]);
  const location = useLocation();
  const quizResult = location.state?.quizResult;


  const auth = useSelector((state) => state.auth);
  const userId = auth?.userId || Number(localStorage.getItem("userId"));
  console.log(userId);

  // Load Course Name
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

  // Load Course Content
  useEffect(() => {
    const loadCourseContent = async () => {
      try {
        const contentData = await fetchCourseContentByCourseId(courseId);
  
        const enrichedData = await Promise.all(
          contentData.map(async (item) => {
            const completion = await fetchContentProgress(userId, courseId, item.courseContentId);
            console.log("➡️ Completion raw response:", completion);
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
        setContentIds(enrichedData.map(item => item.contentId));
      } catch (error) {
        setErrorMessage("Failed to fetch course content.");
        console.error("Error fetching content:", error);
      }
    };
  
    loadCourseContent();
  }, [courseId]);
  

  // Apply search filter
  useEffect(() => {
    let filtered = courseContent;
    if (searchTerm.trim()) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredContent(filtered);
  }, [searchTerm, courseContent]);

  useEffect(() => {
  if (quizResult) {
    console.log("ooooooooooooooooooo", quizResult?.passingScore)
    const passingScore = quizResult?.passingScore ?? 50;
    const isPassed = quizResult.percentageScore >= passingScore;

    Modal.success({
      title: isPassed ? "🎉 You Passed!" : "😓 Better Luck Next Time!",
      content: (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "16px", marginBottom: "12px" }}>
            <strong>✅ Correct Answers:</strong> <span style={{ color: "#52c41a" }}>{quizResult.correctAnswers}</span>
          </p>
          <p style={{ fontSize: "16px", marginBottom: "12px" }}>
            <strong>📊 Percentage Score:</strong> <span style={{ color: "#1890ff" }}>{quizResult.percentageScore}%</span>
          </p>
          <p style={{ fontSize: "16px", marginBottom: "12px" }}>
            <strong>🏆 Total Score:</strong> <span style={{ color: "#faad14" }}>{quizResult.totalScore}</span>
          </p>

          <div style={{ marginTop: 20 }}>
            <progress
              value={quizResult.percentageScore}
              max="100"
              style={{ width: "80%", height: "16px", borderRadius: "8px" }}
            />
          </div>
        </div>
      ),
      okText: "Back to Course",
      centered: true,
      onOk: () => {
        navigate(location.pathname, { replace: true }); // clear state after OK
      },
    });
  }
}, [quizResult, location.pathname, navigate]);


  const contentFields = [
    { index: 1, title: "Title" },
    { index: 2, title: "Description" },
    { index: 4, title: "Resource Link" },
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
            style={{  maxWidth: 300 }}
          />
        </div>
        <div className="action-buttons">
          <Button
            onClick={() => navigate("/my-courses")}
            className="common-btn"
          >
            Back to Courses
          </Button>
          <Button
            onClick={() => navigate(`/quiz/${courseId}?userId=${userId}`)}
            className="common-btn"
          >
            Attempt Quiz
          </Button>
        </div>
      </div>

      {filteredContent.length === 0 && !errorMessage ? (
        <div className="no-data-found">No content available for this course.</div>
      ) : (
        <UserCourseContentTable fields={contentFields} entries={filteredContent} courseId={courseId} />
      )}
    </div>
  );
};

export default UserHOC(CourseContent);
