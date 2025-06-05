import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Progress, Card, Empty, Statistic, Typography } from 'antd';
import {
  CheckCircleOutlined,
  SolutionOutlined,
  TeamOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import AdminHOC from '../../shared/HOC/AdminHOC';
import { userHistory } from '../../../service/IssuanceService';
import { userStats } from '../../../service/UserService';
import { getUserEnrolledCourseDetails } from '../../../service/UserCourseService';
import './UserHistory.css';

const { Text, Title } = Typography;


const UserHistory = ({ setLoading }) => {
  const { id } = useParams();
  const location = useLocation();
  const userName = location.state?.name || 'N/A';
  const auth = useSelector((state) => state.auth);

  const [userHistoryData, setUserHistoryData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(() => (window.innerHeight >= 1024 ? 11 : 10));
  const [totalPages, setTotalPages] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [dashStatsData, setDashStatsData] = useState({ enrollments: 0, groups: 0 });

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerHeight >= 1024 ? 11 : 10);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [statsData, courses] = await Promise.all([
          userStats(id, auth.accessToken),
          getUserEnrolledCourseDetails(id),
        ]);
        setDashStatsData(statsData);
        setCourseList(courses);
        setFilteredCourses(courses);
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
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedById',
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
          strokeColor={
            progress >= 95 ? '#52c41a' : progress >= 50 ? '#1890ff' : '#69c0ff'
          }
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        { text: 'Completed', value: 'Completed' },
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Not Started', value: 'Not Started' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color = {
          completed: 'purple',
          'in progress': 'orange',
          'not started': 'red',
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
    {
      id: 3,
      title: 'Total Completed Courses',
      number: 6,
      color: '#52c41a',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    },
    {
      id: 4,
      title: 'Incomplete Courses',
      number: 3,
      color: '#faad14',
      icon: <SyncOutlined style={{ color: '#faad14' }} />,
    },
    {
      id: 5,
      title: 'Defaulters',
      number: 1,
      color: '#f5222d',
      icon: <ClockCircleOutlined style={{ color: '#f5222d' }} />,
    },
  ];

  return (
    <div className="user-history-section">
      <Title level={1} className="user-history-header" style={{ marginBottom: 16 }}>
        {userName} Details
      </Title>
      <div className="user-history-stats">
        {dashData.map((data) => (
          <Card
            key={data.id}
            style={{
              width: 220,
              height: 130,
              border: '1px solid #e0e0e0',
            }}>
            <Statistic
              title={<Text strong>{data.title}</Text>}
              value={data.number}
              valueStyle={{ color: data.color }}
              prefix={data.icon}
            />
          </Card>
        ))}
      </div>

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
            scroll={{ x: '100%' }}
            locale={{ emptyText: 'No courses found for this user.' }}
            rowKey={(record) => record.id}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
};

export default AdminHOC(UserHistory);