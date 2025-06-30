import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import UserHOC from "../../shared/HOC/UserHOC";
import './UserDashboard.css';
import { Table, Tag, Progress, Col, Row, Card, Empty, Statistic, Typography } from 'antd';
import {
  CheckCircleOutlined,
  SolutionOutlined,
  TeamOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { userStats } from "../../../service/UserService";
import { userHistory } from '../../../service/IssuanceService';
import { getUserEnrolledCourseDetails } from "../../../service/UserCourseService";
import DonutChart from './DonutChart';
// import { setBrushSettings } from 'recharts/types/state/brushSlice';


const { Text, Title } = Typography;


const UserDashboard = ({ setLoading }) => {


  const location = useLocation();
  const [id, setId] = useState(null);
  const [userName, setUserName] = useState("N/A");
  const auth = useSelector((state) => state.auth)

  const [userHistoryData, setUserHistoryData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(() => (window.innerHeight >= 1024 ? 11 : 10));
  const [totalPages, setTotalPages] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [dashStatsData, setDashStatsData] = useState({ enrollments: 0, groups: 0 });
  const [completed, setCompleted] = useState(0);
  const [inprogress, setInprogress] = useState(0);
  const [defaulters, setDefaulters] = useState(0);
  const [notStarted, setNotStarted] = useState(0);
  const [completionFailed, setCompletionFailed] = useState(0);




  const fetchUserId = async (email) => {
    try {
      const response = await fetch(`http://localhost:8081/api/users/getUserId?email=${email}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authtoken")}`,
          "Content-Type": "application/json"
        }
      });
      const userData = await response.json();
      console.log("Parsed JSON response:", userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };


  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerHeight >= 1024 ? 11 : 10);
    };
    console.log("Email for user", auth)
    const data = fetchUserId(auth.email)
    console.log("User data ", data)
    setId(data.userId);
    setUserName(data.firstName + data.lastName);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      console.log("userId", id)
      console.log("userHistory ", userName);
      setLoading(true);
      try {
        const statsData = await userStats(id, auth.accessToken)

        console.log("userHIstory", statsData.data);
        setDashStatsData(statsData.data);
        const courses = await getUserEnrolledCourseDetails(id);
        console.log("COURSES HISTORY", courses)
        setCourseList(courses);
        setFilteredCourses(courses);
        console.log(Array.isArray(courses))
        setCompleted(courses.filter(course => course.status === "Completed").length);
        console.log("COMPLETED", completed);
        setInprogress(courses.filter(course => course.status === "In Progress").length);
        console.log("Inprogress", inprogress);
        setDefaulters(courses.filter(course => course.status === "Defaulter").length);
        console.log("defaulter", courses.filter(course => course.status === "Defaulter").length);
        setNotStarted(courses.filter(course => course.status === "Not Started").length);
        console.log("NotStarted", notStarted)
        setCompletionFailed(courses.filter(course => course.status === "Completion Failed").length);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, auth.accessToken, setLoading]);

  useEffect(() => {
    const loadUserHistory = async () => {
      setLoading(true);
      try {
        const data = await userHistory(id);
        setUserHistoryData(data?.content || []);
        setTotalPages(data?.totalPages || 0);
      } catch (error) {
        console.error('Error loading user history:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserHistory();
  }, [id, pageNumber, pageSize, setLoading]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        const levelColor = {
          beginner: 'green',
          intermediate: 'blue',
          professional: 'purple',
        }[level?.toLowerCase()] || 'gray';
        return <Tag color={levelColor}>{level || 'Not Defined'}</Tag>;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedById',
      key: 'assignedById',
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'enrollmentDate',
      render: (date) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      render: (date) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Completion %',
      dataIndex: 'roundedCompletion',
      render: (progress) => (
        <Progress
          percent={progress}
          size="small"
          // type="circle"
          strokeColor={
            progress >= 95 ? '#52c41a' : progress >= 50 ? '#1890ff' : '#69c0ff'
          }
          wrap />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        { text: 'Completed', value: 'Completed' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Not Started', value: 'Not Started' },
        { text: 'Defaulter', value: 'Defaulter' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color = {
          completed: 'green',
          'in progress': 'orange',
          'not started': 'purple',
          'defaulter': 'red'
        }[status?.toLowerCase()] || 'gray';
        return <span style={{ color }}>{status}</span>;
      },
    },
  ];

  const dashData = [
    {
      id: 1,
      title: 'Total Enrollments',
      number: dashStatsData.enrollments,
      color: '#13c2c2',
      icon: <SolutionOutlined style={{ color: '#13c2c2' }} />,
    },
    {
      id: 2,
      title: 'Total Groups',
      number: dashStatsData.groups,
      color: '#fa8c16',
      icon: <TeamOutlined style={{ color: '#fa8c16' }} />,
    },
    // {
    //   id: 3,
    //   title: 'Total Completed Courses',
    //   number: completed,
    //   color: '#52c41a',
    //   icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    // },
    // {
    //   id: 4,
    //   title: 'Incomplete Courses',
    //   number: inprogress,
    //   color: '#faad14',
    //   icon: <SyncOutlined style={{ color: '#faad14' }} />,
    // },
    // {
    //   id: 5,
    //   title: 'Defaulters',
    //   number: defaulters,
    //   color: '#f5222d',
    //   icon: <ClockCircleOutlined style={{ color: '#f5222d' }} />,
    // },
    // {
    //   id: 5,
    //   title: 'Not Started',
    //   number: notStarted,
    //   color: '#fa8c16',
    //   icon: <ClockCircleOutlined style={{ color: '#fa8c16' }} />,
    // },
  ];


  const piedata = [
    {
      id: 3,
      title: 'Total Completed Courses',
      number: 5,
      // color: '#52c41a',
      // icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    },
    {
      id: 4,
      title: 'Incomplete Courses',
      number: 3,
      // color: '#faad14',
      // icon: <SyncOutlined style={{ color: '#faad14' }} />,
    },
    {
      id: 5,
      title: 'Defaulters',
      number: 2,
      // color: '#f5222d',
      // icon: <ClockCircleOutlined style={{ color: '#f5222d' }} />,
    },
    {
      id: 5,
      title: 'Not Started',
      number: 1,
      // color: '#fa8c16',
      // icon: <ClockCircleOutlined style={{ color: '#fa8c16' }} />,
    },
    {
      id: 6,
      title: 'Completion Failed',
      number: completionFailed,
      // color: '#fa8c16',
      // icon: <ClockCircleOutlined style={{ color: '#fa8c16' }} />,
    },
  ]


  return (
    <div className="user-history-section">
      <Title level={1} className="user-history-header" style={{ marginBottom: 16 }}>
        {userName} Details
      </Title>

      {/* Stats Cards + Donut Chart */}
      <Row gutter={[16, 16]} justify="start" style={{ marginBottom: 32, marginLeft: 50 }}>
        {dashData.map((data) => (
          <Col key={data.id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card className="user-history-card" bordered>
              <Statistic
                title={<Text strong>{data.title}</Text>}
                value={data.number}
                valueStyle={{ color: data.color }}
                prefix={data.icon}
              />
            </Card>
          </Col>
        ))}

        {/* Donut Chart occupies full width or half depending on screen */}
        <Col xs={24} md={12} lg={8}>
          <Card title="Course Status Overview" bordered>
            <DonutChart data={piedata} />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <div className="user-history-table">
        {filteredCourses.length > 0 ? (
          <Table
            dataSource={filteredCourses}
            columns={columns}
            pagination={{
              current: pageNumber + 1,
              pageSize,
              total: totalPages * pageSize,
              onChange: (page) => setPageNumber(page - 1),
              showSizeChanger: false,
            }}
            scroll={{ x: '100%', y: '100%' }}
            locale={{ emptyText: 'No courses found for this user.' }}
            rowKey={(record) => record.courseId}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>

  );
};

export default UserHOC(UserDashboard);
