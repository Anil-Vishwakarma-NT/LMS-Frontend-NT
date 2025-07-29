import React, { useEffect, useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import QuizAttemptDetailsModal from "../../user/myCourses/QuizAttemptDetailsModal";
import {
  Tabs,
  Select,
  Typography,
  Spin,
  message,
  Table,
  Button,
} from "antd";
import { app } from "../../../service/serviceLMS";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;

const QuizReportDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [userReport, setUserReport] = useState([]);
  const [courseReport, setCourseReport] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showDetailedResult, setShowDetailedResult] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [selectedAttemptIndex, setSelectedAttemptIndex] = useState(0);

  const fetchDetailedAttempts = async (userId, courseId) => {
    try {
      const response = await app.get(
        `/course/api/client-api/quiz-attempt/user/${userId}/quiz/course/${courseId}`
      );
      const sorted = response.data.data.sort(
        (a, b) => b.quizAttempt.attempt - a.quizAttempt.attempt
      );
      const enriched = sorted.map((item) => ({
        ...item,
        parsedScoreDetails: JSON.parse(item.quizAttempt.scoreDetails),
      }));
      setAttempts(enriched);
      setSelectedAttemptIndex(0);
      setShowDetailedResult(true);
    } catch (error) {
      console.error("Failed to fetch detailed quiz attempts:", error);
      message.error("Could not load detailed quiz results.");
    }
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          app.get("/user/api/client-api/admin/active-employees"),
          app.get("/course/api/client-api/course"),
        ]);
        setUsers(usersRes.data.data);
        setCourses(coursesRes.data.data);
      } catch (err) {
        message.error("Error fetching users or courses");
      }
    };
    fetchFilters();
  }, []);

  const handleUserChange = async (userId) => {
    setSelectedUser(userId);
    if (!userId) {
    setUserReport([]);
    return;
  }
    setLoading(true);
    try {
      const res = await app.get(`/course/api/client-api/quiz-attempt/quiz-attempt-details/${userId}`);
      setUserReport(res.data.data);
    } catch (err) {
      message.error("Failed to load user quiz attempts");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = async (courseId) => {
    setSelectedCourse(courseId);
    setLoading(true);
    try {
      const res = await app.get(`/course/api/client-api/quiz-attempt/quiz-attempt-details/${courseId}`);
      setCourseReport(res.data.data);
    } catch (err) {
      message.error("Failed to load course quiz attempts");
    } finally {
      setLoading(false);
    }
  };

  const levelFilters = [
  { text: "BEGINNER", value: "BEGINNER" },
  { text: "INTERMEDIATE", value: "INTERMEDIATE" },
  { text: "ADVANCED", value: "ADVANCED" },
];

const userReportColumns = [
  {
    title: "Course Title",
    dataIndex: ["courseOutDTO", "title"],
    sorter: (a, b) =>
      a.courseOutDTO.title.localeCompare(b.courseOutDTO.title),
  },
  {
    title: "Level",
    dataIndex: ["courseOutDTO", "level"],
    filters: levelFilters,
    onFilter: (value, record) => record.courseOutDTO.level === value,
    render: (level) => {
      const color =
        level === "BEGINNER"
          ? "green"
          : level === "INTERMEDIATE"
          ? "orange"
          : "red";
      return <span style={{ color }}>{level}</span>;
    },
  },
  {
    title: "Created At",
    dataIndex: ["courseOutDTO", "createdAt"],
    render: (text) => new Date(text).toLocaleDateString(),
    sorter: (a, b) =>
      new Date(a.courseOutDTO.createdAt) - new Date(b.courseOutDTO.createdAt),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Button
       type="/default"
      icon={<EyeOutlined />}
        onClick={() =>
          fetchDetailedAttempts(selectedUser, record.courseOutDTO.courseId)
        }
      >
        View Quiz Details
      </Button>
    ),
  },
];
  return (
    <div style={{ padding: 78 }}>
      <Title level={3}>Quiz Reports</Title>
      <Tabs defaultActiveKey="user">
        {/* --- USER VIEW --- */}
        <TabPane tab="By User" key="user">
          <Select
            showSearch
            allowClear
            placeholder="Select User"
            style={{ width: 300, marginBottom: 16 }}
            onChange={handleUserChange}
            value={selectedUser}
            optionFilterProp="label"
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          >
            {users.map((u) => (
              <Option
                key={u.userId}
                value={u.userId}
                label={`${u.firstName} ${u.lastName}`}
              >
                {u.firstName} {u.lastName}
              </Option>
            ))}
          </Select>

          {loading ? (
            <Spin />
          ) : (
            <Table
                rowKey={(record) => record.courseOutDTO.courseId}
                dataSource={userReport}
                columns={userReportColumns}
                bordered
                pagination={false}
                style={{ marginTop: 16 }}
                />
          )}
        </TabPane>

        {/* --- COURSE VIEW --- */}
        <TabPane tab="By Course" key="course">
          <Select
            showSearch
            allowClear
            placeholder="Select Course"
            style={{ width: 300, marginBottom: 16 }}
            onChange={handleCourseChange}
            value={selectedCourse}
            optionFilterProp="label"
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
          >
            {courses.map((c) => (
              <Option key={c.courseId} value={c.courseId} label={c.title}>
                {c.title}
              </Option>
            ))}
          </Select>

          {loading ? (
            <Spin />
          ) : (
            courseReport.map((report, reportIdx) => (
              <div key={reportIdx}>
                <Typography.Text strong>
                  User: {report.userName || "N/A"}
                </Typography.Text>
                {/* Optional: Add user attempt display here */}
              </div>
            ))
          )}
        </TabPane>
      </Tabs>

      <QuizAttemptDetailsModal
        open={showDetailedResult}
        onClose={() => setShowDetailedResult(false)}
        attempts={attempts}
      />
    </div>
  );
};

export default QuizReportDashboard;
