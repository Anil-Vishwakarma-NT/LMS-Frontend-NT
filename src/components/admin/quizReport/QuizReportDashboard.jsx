

import React, { useEffect, useState } from "react";
import { Tabs, Select, Table, Typography, Collapse, Spin, message } from "antd";
import { app } from "../../../service/serviceLMS";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;
const { Panel } = Collapse;

const QuizReportDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [userReport, setUserReport] = useState([]);
  const [courseReport, setCourseReport] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all users and courses on mount
    const fetchFilters = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          app.get("/user/api/client-api/admin/active-employees"),
          app.get("/course/api/client-api/course")
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
    setLoading(true);
    try {
      const res = await app.get(`/course/api/admin/quiz-attempts/user/${userId}`);
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
      const res = await app.get(`/course/api/admin/quiz-attempts/course/${courseId}`);
      setCourseReport(res.data.data);
    } catch (err) {
      message.error("Failed to load course quiz attempts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 78 }}>
      <Title level={3}>Quiz Reports</Title>
      <Tabs defaultActiveKey="user">
        <TabPane tab="By User" key="user">
          <Select
            showSearch
            placeholder="Select User"
            style={{ width: 300, marginBottom: 16 }}
            onChange={handleUserChange}
            value={selectedUser}
            optionFilterProp="label" // 👈 Key part
            filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
            }
            >
            {users.map((u) => (
                <Option
                key={u.userId}
                value={u.userId}
                label={`${u.firstName} ${u.lastName}`} // 👈 define label here
                >
                {u.firstName} {u.lastName}
                </Option>
            ))}
        </Select>

          {loading ? (
            <Spin />
          ) : (
            userReport.map((report) => (
              <Collapse key={report.courseId} style={{ marginBottom: 16 }}>
                <Panel header={`Course: ${report.courseTitle}`}>
                  {report.attempts.map((attempt, idx) => (
                    <div key={attempt.id} style={{ marginBottom: 8 }}>
                      <strong>Attempt #{idx + 1}:</strong>
                      <pre style={{ backgroundColor: "#f5f5f5", padding: 12 }}>
                        {JSON.stringify(attempt, null, 2)}
                      </pre>
                    </div>
                  ))}
                </Panel>
              </Collapse>
            ))
          )}
        </TabPane>

        <TabPane tab="By Course" key="course">
          <Select
            showSearch
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
                <Option
                key={c.courseId}
                value={c.courseId}
                label={c.title}
                >
                {c.title}
                </Option>
            ))}
        </Select>


          {loading ? (
            <Spin />
          ) : (
            courseReport.map((report) => (
              <Collapse key={report.userId} style={{ marginBottom: 16 }}>
                <Panel header={`User: ${report.userName}`}>
                  {report.attempts.map((attempt, idx) => (
                    <div key={attempt.id} style={{ marginBottom: 8 }}>
                      <strong>Attempt #{idx + 1}:</strong>
                      <pre style={{ backgroundColor: "#f5f5f5", padding: 12 }}>
                        {JSON.stringify(attempt, null, 2)}
                      </pre>
                    </div>
                  ))}
                </Panel>
              </Collapse>
            ))
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default QuizReportDashboard;
