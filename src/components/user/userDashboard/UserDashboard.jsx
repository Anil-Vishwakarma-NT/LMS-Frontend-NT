import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import UserHOC from "../../shared/HOC/UserHOC";
import './UserDashboard.css';
import { Tag, Progress, Row, Card, Statistic, Typography } from 'antd';
import {
  SolutionOutlined,
  TeamOutlined,
  BookOutlined,
  PieChartOutlined,
  ExclamationOutlined
} from '@ant-design/icons';
import { userStats } from "../../../service/UserService";
import { getUserEnrolledCourseDetails } from "../../../service/UserCourseService";
import DonutChart from './DonutChart';
import './UserDashboard.css';
import DeadlineTable from './DeadlinesTable';

const { Text, Title } = Typography;


const UserDashboard = ({ setLoading }) => {


  const location = useLocation();
  const [id, setId] = useState(null);
  const [userName, setUserName] = useState("N/A");
  const auth = useSelector((state) => state.auth)

  const [pageSize, setPageSize] = useState(() => (window.innerHeight >= 1024 ? 11 : 10));
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [dashStatsData, setDashStatsData] = useState({ enrollments: 0, groups: 0 });
  const [completed, setCompleted] = useState(0);
  const [inprogress, setInprogress] = useState(0);
  const [defaulters, setDefaulters] = useState(0);
  const [notStarted, setNotStarted] = useState(0);
  const [completionFailed, setCompletionFailed] = useState(0);


  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
<<<<<<< HEAD



  // const fetchUserId = async () => {
  //   try {
  //     const response = await fetch(`user/api/client-api/users/getUserDetails`, {
  //       method: "GET",
  //       headers: {
  //         "Authorization": `Bearer ${localStorage.getItem("authtoken")}`,
  //         "Content-Type": "application/json"
  //       }
  //     });
  //     const userData = await response.json();
  //     console.log("Parsed JSON response:", userData);
  //     return userData;
  //   } catch (error) {
  //     console.error("Error fetching user ID:", error);
  //     return null;
  //   }
  // };
=======
>>>>>>> 33f99b9047ad3af3e8c3ac367f486128af1b61c1


  const loadData = async () => {
    console.log("userId", id)
    console.log("userHistory ", userName);
    setLoading(true);
    try {
<<<<<<< HEAD
      
      const statsData = await userStats(id, auth.accessToken)
=======
      const statsData = await userStats(id)
>>>>>>> 33f99b9047ad3af3e8c3ac367f486128af1b61c1
      console.log("userHIstory", statsData.data);
      setDashStatsData(statsData.data);
      const courses = await getUserEnrolledCourseDetails();
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


  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerHeight >= 1024 ? 11 : 10);
    };

    const getUser = async () => {
      try {
        const {
<<<<<<< HEAD
        roles,
        email,
        userId,
        fullName
      } = parseJwt(auth.accessToken);
        setId(userId);
        setUserName(fullName||"N/A");
=======
          roles,
          email,
          userId,
          fullName
        } = parseJwt(auth.accessToken);

        setId(userId);
        setUserName(fullName);
        // alert("FETCHING USER DATA")
>>>>>>> 33f99b9047ad3af3e8c3ac367f486128af1b61c1
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

<<<<<<< HEAD
  
  useEffect(() => {
    if (!id) return;              // guard: wait until we actually have an id
    // const loadData = async () => {
    //   setLoading(true);
    //   try {
    //     alert("User ID: " + id);
    //     const stats = await userStats(id);
        
    //     setDashStatsData(stats.data);
        
    //     const courses = await getUserEnrolledCourseDetails(id);
    //     setCourseList(courses);
    //     setFilteredCourses(courses);

    //     setCompleted(courses.filter(c => c.status === 'Completed').length);
    //     setInprogress(courses.filter(c => c.status === 'In Progress').length);
    //     setDefaulters(courses.filter(c => c.status === 'Defaulter').length);
    //     setNotStarted(courses.filter(c => c.status === 'Not Started').length);
    //     setCompletionFailed(
    //       courses.filter(c => c.status === 'Completion Failed').length
    //     );
    //   } catch (err) {
    //     console.error('Error loading user data:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    loadData();
  }, [id]);   //  ← add every value that should retrigger the effect



  // useEffect(() => {
  //   const loadUserHistory = async () => {
  //     setLoading(true);
  //     try {
  //       loadData();
  //       const data = await userHistory(id);
  //       setUserHistoryData(data?.content || []);
  //       setTotalPages(data?.totalPages || 0);
  //     } catch (error) {
  //       console.error('Error loading user history:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadUserHistory();
  // }, [setLoading]);

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
=======

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);
>>>>>>> 33f99b9047ad3af3e8c3ac367f486128af1b61c1

  const dashData = [
    {
      id: 1,
      title: 'Total Enrollments',
      number: dashStatsData.enrollments,
      color: '#7FB3D5',
      icon: <SolutionOutlined style={{ color: '#7FB3D5' }} />,
    },
    {
      id: 2,
      title: 'Total Groups',
      number: dashStatsData.groups,
      color: '#76D7C4',
      icon: <TeamOutlined style={{ color: '#76D7C4' }} />,
    }, {
      id: 3,
      title: 'Total Bundles',
      number: dashStatsData.bundles || 0,
      color: '#F7DC6F',
      icon: <BookOutlined style={{ color: '#F7DC6F' }} />,
    },
  ];


  const piedata = [
    {
      title: 'Total Completed Courses',
      number: completed,
    },
    {
      title: 'Incomplete Courses',
      number: inprogress,
    },
    {
      title: 'Defaulters',
      number: defaulters,
    },
    {
      title: 'Not Started',
      number: notStarted,
    },
    {
      title: 'Completion Failed',
      number: completionFailed,
    },
  ]


  return (
    <div className="user-dashboard-section" >
      <Title level={2} className="user-dashboard-header" style={{ marginTop: 80 }} justify="start">
        Welcome {userName}
      </Title>
      <Row gutter={[16, 16]} justify="start" style={{ marginBottom: 12, }} >
        {dashData.map((data) => (
          <Card
            key={data.id}
            bordered
            style={{ width: 350, margin: 5 }}
          >
            <Statistic
              title={<Text strong>{data.title}</Text>}
              value={data.number}
              valueStyle={{ color: data.color }}
              prefix={data.icon}
            />
          </Card>
        ))}
      </Row>
      <Row gutter={[16, 16]} justify="start" style={{ marginBottom: 32, height: 400 }}>

        <Card title={
          <span>
            <PieChartOutlined style={{ color: '#F7DC6F', marginRight: 8 }} />
            Course Status Overview
          </span>
        } bordered style={{ width: 530, margin: 5 }}
        >
          <DonutChart data={piedata} />
        </Card>
        <Card title={
          <span>
            <ExclamationOutlined style={{ color: '#FF4D4F', marginRight: 8 }} />
            Deadlines this week
          </span>
        } bordered style={{ width: 550, margin: 5 }}>
          <DeadlineTable />
        </Card>


      </Row>
    </div>

  );
};

export default UserHOC(UserDashboard);
