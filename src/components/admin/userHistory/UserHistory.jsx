import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Progress, Card, Empty, Statistic, Typography, Button, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  SolutionOutlined,
  TeamOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';

import AdminHOC from '../../shared/HOC/AdminHOC';
import { userHistory } from '../../../service/IssuanceService';
import { userStats } from '../../../service/UserService';
import { fetchUserEnrolledCoursesById } from '../../../service/AdminService';
import './UserHistory.css';

const { Text, Title } = Typography;


const UserHistory = ({ setLoading }) => {
  const { id } = useParams();
  const location = useLocation();
  const userName = location.state?.name || 'N/A';
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
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
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [coursesByBundle, setCoursesByBundle] = useState({});


  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerHeight >= 1024 ? 11 : 10);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      console.log("userHistory ", userName);
      setLoading(true);
      try {
        const statsData = await userStats(id, auth.accessToken)

        console.log("userHIstory", statsData.data);
        setDashStatsData(statsData.data);
        const courses = await fetchUserEnrolledCoursesById(id);
        console.log("COURSES HISTORY", courses)
        setCourseList(courses);
        setFilteredCourses(courses);
        console.log(Array.isArray(courses))
        setCompleted(courses.filter(course => course.status === "Completed").length);
        setInprogress(courses.filter(course => course.status === "In Progress").length);
        setDefaulters(courses.filter(course => course.status === "Defaulter").length);
        setNotStarted(courses.filter(course => course.status === "Not Started").length);

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
      dataIndex: 'courseLevel',
      key: 'level',
      render: (level) => {
        const levelColor = {
          "beginner": 'blue',
          "intermediate": 'orange',
          "advanced": 'purple',
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
          type="circle"
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
          'in progress': 'blue',
          'not started': 'orange',
          'defaulter': 'red'
        }[status?.toLowerCase()] || 'gray';
        return <Tag style={{ color }}>{status}</Tag>;
      },
    },
  ];

  const dashData = [
    {
      id: 1,
      title: 'Total Enrollments',
      number: dashStatsData.enrollments,
      color: '#36cfc9',
      icon: <SolutionOutlined style={{ color: '#36cfc9' }} />,
    },
    {
      id: 2,
      title: 'Total Groups',
      number: dashStatsData.groups,
      color: '#ffc53d',
      icon: <TeamOutlined style={{ color: '#ffc53d' }} />,
    },
    {
      id: 3,
      title: 'Total Completed Courses',
      number: completed,
      color: '#73d13d',
      icon: <CheckCircleOutlined style={{ color: '#73d13d' }} />,
    },
    {
      id: 4,
      title: 'Incomplete Courses',
      number: inprogress,
      color: '#ffec3d',
      icon: <SyncOutlined style={{ color: '#ffec3d' }} />,
    },
    {
      id: 5,
      title: 'Defaulters',
      number: defaulters,
      color: '#ff4d4f',
      icon: <ClockCircleOutlined style={{ color: '#ff4d4f' }} />,
    },
    {
      id: 6,
      title: 'Not Started',
      number: notStarted,
      color: '#ffa940',
      icon: <ClockCircleOutlined style={{ color: '#ffa940' }} />,
    },
  ];


  return (
    <div className="admin-container">
      <div className="admin-header">
        <Tooltip title="Back to users">
          <Button
            icon={<ArrowLeftOutlined style={{ fontSize: 20 }} />}
            className="admin-back-btn"
            onClick={() => navigate("/users")}
          />
        </Tooltip>
        <Title level={3} className="admin-page-title">{userName} Details</Title>
      </div>

      <div className="admin-dashboard-cards">
        {dashData.map((data) => (
          <Card key={data.id} className="admin-dashboard-card">
            <Statistic
              title={<Text strong>{data.title}</Text>}
              value={data.number}
              valueStyle={{ color: data.color }}
              prefix={data.icon}
            />
          </Card>
        ))}
      </div>
      <div className='table-subtitle'>
        User course progress history
      </div>
      <div className="admin-table-container">
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

export default AdminHOC(UserHistory);