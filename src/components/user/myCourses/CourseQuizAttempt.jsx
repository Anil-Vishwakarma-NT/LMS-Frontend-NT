import { app, appCourse } from "../../../service/serviceLMS";
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Typography, Spin, Alert, Card, Tag,
  Button, Input, Radio, Checkbox, Space, message, Modal 
} from "antd";
import axios from "axios";
import {
  InfoCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const CourseQuizAttempt = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const userId = location.state?.userId || Number(localStorage.getItem("userId"));

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const [quizAttemptId, setQuizAttemptId] = useState(null);
  const [currentAttemptNumber, setAttempt] = useState(null);
  const navigate = useNavigate();

  // Load quiz metadata
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const quizRes = await app.get(`course/api/service-api/quizzes/course/${courseId}`);
        const quizData = quizRes.data?.data?.[0];

        if (!quizData?.quizId) {
          setError("No quiz available for this course.");
          return;
        }

        const fullQuizRes = await app.get(`course/api/service-api/quizzes/${quizData.quizId}`);
        setQuiz(fullQuizRes.data?.data || null);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading the quiz.");
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [courseId]);

  // Timer logic
  useEffect(() => {
    if (!start || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          message.warning("Time's up! Submitting quiz.");
          handleSubmit();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [start, timeLeft]);

  const handleStartQuiz = async () => {
    try {
      if (!quiz || !quiz.quizId) return;

      const payload = {
        quizId: quiz.quizId,
        userId: userId,
      };

      const attemptRes = await app.post("course/api/service-api/quiz-attempt", payload);
      console.log("attemptRes", attemptRes)
      const attemptId = attemptRes.data?.quizAttemptId;
      const currentAttempt = attemptRes.data?.attempt;
      console.log("attemptId", attemptId)
      setQuizAttemptId(attemptId);
      setAttempt(currentAttempt)
      const attemptData = attemptRes.data;
      const attemptsLeft = attemptData?.attemptsLeft ?? 0;
      if (attemptsLeft === 0) {
        Modal.warning({
          title: "No Attempts Left",
          content: "You have exhausted all your quiz attempts.",
        });
        return;
      }

      // Load questions
      const questionsRes = await app.get(`course/api/service-api/quiz-questions/quiz/${quiz.quizId}`);
      setQuestions(questionsRes.data?.data || []);

      // Start quiz
      setStart(true);
      setTimeLeft(quiz.timeLimit * 60);
    } catch (err) {
      console.error(err);
      message.error("Failed to load quiz questions.");
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const toggleMarkForReview = (questionId) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const confirmSubmit = () => {
    Modal.confirm({
      title: "Submit Quiz?",
      content: "Are you sure you want to submit your quiz? You won't be able to change your answers after this.",
      okText: "Yes, Submit",
      cancelText: "No, Review Again",
      onOk: () => handleSubmit(),
      centered: true,
    });
  };

const handleSubmit = async () => {
  if (!quizAttemptId || !quiz?.quizId) {
    message.error("Missing quiz attempt information.");
    return;
  }

  try {
    const now = new Date().toISOString().split(".")[0]; 

    const userResponses = questions.map((question) => {
      let userAnswer = userAnswers[question.questionId] || [];
      
      // Normalize all answers to array format
      if (question.questionType === "MCQ_MULTIPLE") {
        // Already an array, keep as is
        userAnswer = userAnswer;
      } else if (question.questionType === "MCQ_SINGLE") {
        // Convert single value to array
        userAnswer = userAnswer ? [userAnswer] : [];
      } else if (question.questionType === "SHORT_ANSWER") {
        // Convert string to array
        userAnswer = userAnswer ? [userAnswer] : [];
      }

      return {
        userId,
        quizId: quiz.quizId,
        questionId: question.questionId,
        attempt: currentAttemptNumber, 
        userAnswer: JSON.stringify(userAnswer), // Now always an array
        answeredAt: now,
      };
    });

    const submissionPayload = {
      userResponses,
      notes: "SUBMITTED",
      timeSpent: quiz.timeLimit * 60 - timeLeft, // total time spent in seconds
    };

    const submitUrl = `course/api/service-api/quiz-submissions/${quizAttemptId}`;
    const res = await app.post(submitUrl, submissionPayload);

    message.success("Quiz submitted successfully!");

    const result = res.data?.data;
    const scoreDetails = result?.scoreDetails
      ? JSON.parse(result.scoreDetails)
      : {
          correctAnswers: result.correctAnswers,
          percentageScore: result.percentageScore,
          totalScore: result.totalScore,
        };
    navigate(`/course-content-user/${courseId}`, {
      state: {
        quizResult: {
          correctAnswers: scoreDetails.correctAnswers,
          percentageScore: scoreDetails.percentageScore,
          totalScore: scoreDetails.totalScore,
          passingScore: quiz.passingScore
        },
      },
    });

    setStart(false);
    setUserAnswers({});
    setMarkedForReview({});
    setCurrentIndex(0);
    setQuizAttemptId(null);
    setAttempt(null);
    setQuestions([]);
    setTimeLeft(0);
  } catch (error) {
    console.error("Quiz submission error:", error);
    message.error("Failed to submit quiz.");
  }
};


  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (loading) return <Spin fullscreen tip="Loading quiz..." />;
  if (error) return <Alert type="error" message={error} showIcon />;
  if (!quiz) return <Alert type="info" message="No quiz found." showIcon />;

  const currentQuestion = questions[currentIndex];

  return (
    <div style={{ padding: 24 }}>
      <Card title={`🎯 Attempt Quiz - ${quiz.title}`} bordered>
        {!start ? (
          <>
            <Paragraph><InfoCircleOutlined /> <strong>Description:</strong> {quiz.description}</Paragraph>
            <Paragraph><strong>📘 Quiz Title:</strong> {quiz.title}</Paragraph>
            <Paragraph><ClockCircleOutlined /> <strong>Time Limit:</strong> {quiz.timeLimit} minutes</Paragraph>
            <Paragraph><SyncOutlined /> <strong>Attempts Allowed:</strong> {quiz.attemptsAllowed}</Paragraph>
            <Paragraph><CheckCircleOutlined /> <strong>Passing Score:</strong> {quiz.passingScore}%</Paragraph>
            <Paragraph><strong>Status:</strong>{" "}
              <Tag color={quiz.isActive ? "green" : "red"}>
                {quiz.isActive ? "Active" : "Inactive"}
              </Tag>
            </Paragraph>
            <Button type="primary" onClick={handleStartQuiz}>
              Start Quiz
            </Button>
          </>
        ) : (
          <>
            {/* Timer */}
            <div style={{ marginBottom: 12, textAlign: "right" }}>
              ⏳ Time Left: <Tag color={timeLeft < 60 ? "red" : "blue"}>{formatTime(timeLeft)}</Tag>
            </div>

            {/* Navigation */}
            <div style={{ marginBottom: 12 }}>
              {questions.map((q, index) => (
                <Button
                  key={q.questionId}
                  type={index === currentIndex ? "primary" : "default"}
                  style={{ margin: 4 }}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                  {markedForReview[q.questionId] && (
                    <Tag color="purple" style={{ marginLeft: 4 }}>⚑</Tag>
                  )}
                </Button>
              ))}
            </div>

            {/* Question */}
            <div style={{ marginBottom: 12 }}>
              <Title level={5} style={{ display: "inline-block", marginRight: 12 }}>
                {`Q${currentIndex + 1}: ${currentQuestion?.questionText}`}
              </Title>

              <Tag color={
                currentQuestion?.questionType === "SHORT_ANSWER" ? "blue" :
                currentQuestion?.questionType === "MCQ_SINGLE" ? "green" :
                currentQuestion?.questionType === "MCQ_MULTIPLE" ? "orange" :
                "default"
              }>
                <strong>
                  {currentQuestion?.questionType === "SHORT_ANSWER" && "Short Answer"}
                  {currentQuestion?.questionType === "MCQ_SINGLE" && "Single Choice"}
                  {currentQuestion?.questionType === "MCQ_MULTIPLE" && "Multiple Choice"}
                </strong>
              </Tag>

              {markedForReview[currentQuestion?.questionId] && (
                <Tag color="purple" style={{ marginLeft: 8 }}>Marked for Review</Tag>
              )}
            </div>

            {/* Answer Input */}
            {currentQuestion?.questionType === "SHORT_ANSWER" && (
              <Input.TextArea
                rows={4}
                value={userAnswers[currentQuestion.questionId] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.questionId, e.target.value)}
              />
            )}

            {currentQuestion?.questionType === "MCQ_SINGLE" && (
              <Radio.Group
                onChange={(e) => handleAnswerChange(currentQuestion.questionId, e.target.value)}
                value={userAnswers[currentQuestion.questionId]}
              >
                <Space direction="vertical">
                  {JSON.parse(currentQuestion.options || "[]").map((opt) => (
                    <Radio key={opt} value={opt}>
                      {opt}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            )}

            {currentQuestion?.questionType === "MCQ_MULTIPLE" && (
              <Checkbox.Group
                onChange={(checked) => handleAnswerChange(currentQuestion.questionId, checked)}
                value={userAnswers[currentQuestion.questionId] || []}
              >
                <Space direction="vertical">
                  {JSON.parse(currentQuestion.options || "[]").map((opt) => (
                    <Checkbox key={opt} value={opt}>
                      {opt}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            )}

            {/* Actions */}
            <div style={{ marginTop: 24 }}>
              <Button onClick={handleBack} disabled={currentIndex === 0}>Back</Button>{" "}
              <Button onClick={handleNext} disabled={currentIndex === questions.length - 1} type="primary">Next</Button>{" "}
              <Button
                type={markedForReview[currentQuestion?.questionId] ? "dashed" : "default"}
                onClick={() => toggleMarkForReview(currentQuestion.questionId)}
              >
                {markedForReview[currentQuestion?.questionId] ? "Unmark Review" : "Mark for Review"}
              </Button>{" "}
              {currentIndex === questions.length - 1 && (
                <Button danger onClick={confirmSubmit}>Submit Quiz</Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default CourseQuizAttempt;
