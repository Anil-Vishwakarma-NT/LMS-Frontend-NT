// import React, { useEffect, useState } from "react";
// import "./AdminDashboard.css";
// import AdminHOC from "../../shared/HOC/AdminHOC";
// import DashCard from "../../shared/dashCard/DashCard";
// import book from "../../../assets/bookshelf.png";
// import users from "../../../assets/group.png";
// import inHouse from "../../../assets/reading.png";
// import category from "../../../assets/category.png";
// import { useNavigate } from "react-router-dom";
// import { fetchAllUsers } from "../../../service/UserService";
// import { fetchAllCategories } from "../../../service/CategoryService";
// import { fetchAllBooks } from "../../../service/BookService";
// import BookCard from "../../shared/bookCard/BookCard";
// import Table from "../../shared/table/Table";
// import { useSelector } from "react-redux";
// import { dashStats } from "../../../service/dashboardService";

// const AdminDashboard = ({ setLoading }) => {

//   const auth = useSelector(state => state.auth);
//   const [pageNumber, setPageNumber] = useState(0)
//   const [pageSize, setPageSize] = useState(5)
//   const [categoryDashList, setCategoryDashList] = useState([])
//   const [userDashList, setUserDashList] = useState([])
//   const [bookDashList, setBookDashList] = useState([])
//   const [dashStatsData, setDashStatsData] = useState({
//     totalBooks: 0,
//     totalCategories: 0,
//     currentIssuances: 0,
//     totalUsers: 0
//   })

//   const date = new Date();

//   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//   const dayName = daysOfWeek[date.getDay()];
//   const monthName = monthsOfYear[date.getMonth()];
//   const year = date.getFullYear();
//   const todayDate = date.getDate();


//   const navigate = useNavigate();

//   const loadCount = async () => {
//     const statsData = await dashStats()
//     setDashStatsData(statsData)
//   }

//   useEffect(() => {
//     loadCount();
//   }, [])

//   const loadCategories = async () => {
//     try {
//       setLoading(true)
//       const data = await fetchAllCategories(pageNumber, pageSize);
//       setCategoryDashList(data?.content)
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false)
//     }
//   }
//   const loadUsers = async () => {
//     try {
//       setLoading(true)
//       const data = await fetchAllUsers(pageNumber, pageSize);
//       setUserDashList(data?.content)
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadBooks = async () => {
//     try {
//       setLoading(true)
//       const data = await fetchAllBooks(pageNumber, pageSize)
//       setBookDashList(data?.content)
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadCategories();
//     loadUsers();
//     loadBooks();
//   }, [pageNumber, pageSize]);



//   const data = [
//     { id: 1, title: "Total Employees", number: dashStatsData?.totalUsers, logo: users },
//     { id: 2, title: "Total Unique Books", number: dashStatsData?.totalBooks, logo: book },
//     { id: 3, title: "Total Categories", number: dashStatsData?.totalCategories, logo: category },
//     { id: 4, title: "Active Issuances", number: dashStatsData?.currentIssuances, logo: inHouse },
//   ];

//   const userFields = [
//     {
//       index: 1,
//       title: "Sr. No."
//     },
//     {
//       index: 2,
//       title: "Name"
//     },
//     {
//       index: 3,
//       title: "Email"
//     },
//     {
//       index: 4,
//       title: "Mobile"
//     },
//   ]

//   const categoryFields = [
//     {
//       index: 1,
//       title: "Index"
//     },
//     {
//       index: 1,
//       title: "Name"
//     }
//   ]

//   const handleCategorySeeMoreClick = () => {
//     navigate("/categories");
//   };

//   const handleUserSeeMoreClick = () => {
//     navigate("/users");
//   };

//   return (
//     <div className="admin-section">
//       <div className="welcome-admin">
//         <div className="welcome-parent">
//           <p className="welcome">Welcome</p>
//           <p className="admin-name">{auth?.name}!</p>
//         </div>
//         <p className="admin-date">{dayName}, {monthName} {todayDate}, {year}</p>
//       </div>
//       <div className="main-content">
//         {data?.map((data) => (
//           <DashCard key={data.id} data={data} />
//         ))}
//       </div>
//       <div className="dash-tables">
//         <div className="user-dash-table">
//           <p className="user-dash-table-header">Recently Added Users</p>
//           <Table fields={userFields} entries={userDashList} type={'dash-user'} pageNumber={0} pageSize={5} />
//           <div className="see-more-container">
//             <button className="see-more" onClick={handleUserSeeMoreClick}>
//               See more
//             </button>
//           </div>
//         </div>
//         <div className="user-dash-table">
//           <p className="user-dash-table-header">Recently Added Categories</p>
//           <Table fields={categoryFields} entries={categoryDashList} type={'dash-category'} pageNumber={0} pageSize={5} />
//           <div className="see-more-container">
//             <button className="see-more" onClick={handleCategorySeeMoreClick}>
//               See more
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="book-title-parent">
//         <div className="book-title">Recently Added Books</div>
//         <div className="book-line"></div>
//       </div>
//       <div className="main-content">
//         {bookDashList?.map((data) => (
//           <BookCard key={data.id} data={data} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminHOC(AdminDashboard);









import React, { useState } from 'react';
import { 
  Layout, 
  Menu, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Button, 
  Dropdown, 
  Space, 
  Tag,
  Tabs,
  Select,
  Alert
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  AppstoreOutlined,
  SolutionOutlined,
  DashboardOutlined,
  WarningOutlined,
  EllipsisOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

const AdminDashboard = () => {
  const [mockStats, setMockStats] = useState({
    users: 543,
    courses: 87,
    bundles: 24,
    groups: 38,
    enrollments: 1247,
    activeUsers: 431,
    stalledProgress: 32
  });

  // Mock data for tables
  const usersData = [
    { 
      key: '1', 
      name: 'John Doe', 
      email: 'john.doe@example.com', 
      role: 'User', 
      manager: 'Sarah Wilson', 
      createdAt: '2025-04-20' 
    },
    { 
      key: '2', 
      name: 'Emily Johnson', 
      email: 'emily.j@example.com', 
      role: 'Manager', 
      manager: 'Alex Green', 
      createdAt: '2025-04-19' 
    },
    { 
      key: '3', 
      name: 'Robert Smith', 
      email: 'robert.s@example.com', 
      role: 'User', 
      manager: 'Sarah Wilson', 
      createdAt: '2025-04-18' 
    },
  ];

  const coursesData = [
    { 
      key: '1', 
      title: 'Introduction to React', 
      level: 'Beginner', 
      userEnroll: 45, 
      groupEnroll: 3,
      createdAt: '2025-03-15'
    },
    { 
      key: '2', 
      title: 'Advanced SQL', 
      level: 'Intermediate', 
      userEnroll: 28, 
      groupEnroll: 2,
      createdAt: '2025-03-18'
    },
    { 
      key: '3', 
      title: 'Cloud Architecture', 
      level: 'Professional', 
      userEnroll: 17, 
      groupEnroll: 1,
      createdAt: '2025-04-05'
    },
  ];

  const bundlesData = [
    { 
      key: '1', 
      title: 'Web Development Fundamentals', 
      userEnroll: 32, 
      groupEnroll: 4,
      courseCount: 5,
      createdAt: '2025-03-10'
    },
    { 
      key: '2', 
      title: 'Digital Marketing Essentials', 
      userEnroll: 28, 
      groupEnroll: 3,
      courseCount: 4,
      createdAt: '2025-03-25'
    },
    { 
      key: '3', 
      title: 'Data Science Bootcamp', 
      userEnroll: 15, 
      groupEnroll: 2,
      courseCount: 8,
      createdAt: '2025-04-02'
    },
  ];

  const groupsData = [
    { 
      key: '1', 
      name: 'Marketing Team', 
      createdBy: 'Alex Green',
      memberCount: 12,
      createdAt: '2025-02-15'
    },
    { 
      key: '2', 
      name: 'Engineering - Frontend', 
      createdBy: 'Sarah Wilson',
      memberCount: 8,
      createdAt: '2025-03-05'
    },
    { 
      key: '3', 
      name: 'Sales Department', 
      createdBy: 'Robert Smith',
      memberCount: 15,
      createdAt: '2025-03-20'
    },
  ];

  // Table column definitions
  const usersColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { 
      title: 'Role', 
      dataIndex: 'role', 
      key: 'role',
      render: (role) => {
        let color = 'blue';
        if (role === 'Admin') color = 'red';
        if (role === 'Manager') color = 'green';
        return <Tag color={color}>{role}</Tag>;
      }
    },
    { title: 'Manager', dataIndex: 'manager', key: 'manager' },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'View Details' },
              { key: '2', label: 'Edit User' },
              { key: '3', label: 'Delete User' },
            ]
          }}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const coursesColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { 
      title: 'Level', 
      dataIndex: 'level', 
      key: 'level',
      render: (level) => {
        let color = 'green';
        if (level === 'Intermediate') color = 'blue';
        if (level === 'Professional') color = 'purple';
        return <Tag color={color}>{level}</Tag>;
      }
    },
    { title: 'User Enrollments', dataIndex: 'userEnroll', key: 'userEnroll' },
    { title: 'Group Enrollments', dataIndex: 'groupEnroll', key: 'groupEnroll' },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'View Details' },
              { key: '2', label: 'Edit Course' },
              { key: '3', label: 'Archive Course' },
            ]
          }}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const bundlesColumns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Courses', dataIndex: 'courseCount', key: 'courseCount' },
    { title: 'User Enrollments', dataIndex: 'userEnroll', key: 'userEnroll' },
    { title: 'Group Enrollments', dataIndex: 'groupEnroll', key: 'groupEnroll' },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'View Details' },
              { key: '2', label: 'Edit Bundle' },
              { key: '3', label: 'Archive Bundle' },
            ]
          }}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const groupsColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
    { title: 'Members', dataIndex: 'memberCount', key: 'memberCount' },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: '1', label: 'View Members' },
              { key: '2', label: 'Edit Group' },
              { key: '3', label: 'Delete Group' },
            ]
          }}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="admin-section">
      <Content style={{ margin: '0 16px' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
          <h1>Dashboard Overview</h1>
          
          {/* Key Metrics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={mockStats.users}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Total Courses"
                  value={mockStats.courses}
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Total Bundles"
                  value={mockStats.bundles}
                  prefix={<AppstoreOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Total Groups"
                  value={mockStats.groups}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Total Enrollments"
                  value={mockStats.enrollments}
                  prefix={<SolutionOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Statistic
                  title="Active Users"
                  value={mockStats.activeUsers}
                  prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={12}>
              <Card>
                <Statistic
                  title="Stalled Progress"
                  value={mockStats.stalledProgress}
                  prefix={<WarningOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#faad14' }}
                  suffix="users/groups"
                />
                <Alert
                  message="Attention Required"
                  description="32 users or groups have inactive learning paths for over 30 days."
                  type="warning"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              </Card>
            </Col>
          </Row>
          
          {/* Activity Timeline / Recent Additions Tabs - Removed Recent Enrollments Tab */}
          <Tabs defaultActiveKey="1">
            <TabPane tab="Recent Users" key="1">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3>Recently Added Users</h3>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => console.log('Manage Users')}>
                  Manage Users
                </Button>
              </div>
              <Table columns={usersColumns} dataSource={usersData} />
            </TabPane>
            
            <TabPane tab="Recent Courses" key="2">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3>Recently Added Courses</h3>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => console.log('Manage Courses')}>
                  Manage Courses
                </Button>
              </div>
              <Table columns={coursesColumns} dataSource={coursesData} />
            </TabPane>
            
            <TabPane tab="Recent Bundles" key="3">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3>Recently Added Bundles</h3>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => console.log('Manage Bundles')}>
                  Manage Bundles
                </Button>
              </div>
              <Table columns={bundlesColumns} dataSource={bundlesData} />
            </TabPane>
            
            <TabPane tab="Recent Groups" key="4">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3>Recently Added Groups</h3>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => console.log('Manage Groups')}>
                  Manage Groups
                </Button>
              </div>
              <Table columns={groupsColumns} dataSource={groupsData} />
            </TabPane>
          </Tabs>
        </div>
      </Content>
    </div>
  );
};

export default AdminDashboard;