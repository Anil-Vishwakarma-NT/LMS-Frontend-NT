import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Card,
  Table,
  Tabs,
  Select,
  DatePicker,
  Input,
  Typography,
  Tag,
  Statistic,
  Badge,
  Space,
  Button,
  Progress,
  Divider,
  Spin,
  Alert,
  Row,
  Col,
  Modal,
  Form,
  Radio,
  message,
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  AppstoreOutlined,
  FilterOutlined,
  SearchOutlined,
  CalendarOutlined,
  BarChartOutlined,
  TrophyOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import AddEnrollmentModal from './AddEnrollmentModal';
import AdminDashboard from '../adminDashboard/AdminDashboard';
import EnrollmentService from './enrollmentService';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const EnrollmentDashboard = () => {
  // State for filters
  const [viewType, setViewType] = useState('users'); // 'users' or 'groups'
  const [timeRange, setTimeRange] = useState('30days');
  const [status, setStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for add enrollment modal
  const [isModalVisible, setIsModalVisible] = useState(false);  
  // State for data
  const [dashboardData, setDashboardData] = useState({
    courses: [],
    bundles: [],
    users: [],
    groups: [],
    statistics: {
      totalEnrollments: 0,
      usersEnrolled: 0,
      groupsEnrolled: 0,
      completionRate: "0%",
      courseCompletions: 0,
      topCourse: "N/A",
      upcomingDeadlines: 0
    }
  });
  
  // Prepare filters for API calls
  const getFilters = () => {
    return {
      timeRange,
      status,
      searchTerm 
    };
  };
  
  // Fetch all data needed for the dashboard
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const filters = getFilters();
      
      // Fetch all data in parallel based on updated API structure
      const [
        statsResponse,
        userCoursesResponse,
        userBundlesResponse,
        userEnrollmentsResponse
      ] = await Promise.all([
        EnrollmentService.fetchStats(),
        EnrollmentService.fetchUserCourses(filters),
        EnrollmentService.fetchUserBundles(filters),
        EnrollmentService.fetchUserEnrollments(filters)
      ]);
      
      // Process user enrollments to format for users & groups views
      const users = userEnrollmentsResponse?.filter(item => item.entityType === 'user') || [];
      const groups = userEnrollmentsResponse?.filter(item => item.entityType === 'group') || [];
      
      setDashboardData({
        courses: userCoursesResponse || [],
        bundles: userBundlesResponse || [],
        users: users,
        groups: groups,
        statistics: statsResponse || {
          totalEnrollments: 0,
          usersEnrolled: 0,
          groupsEnrolled: 0,
          completionRate: "0%",
          topEnrolledCourse: "N/A",
          upcomingDeadlines: 0,
          courseCompletions: 0
        }
      });
    } catch (error) {
      message.error('Failed to fetch enrollment data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data on filter change
  useEffect(() => {
    fetchDashboardData();
  }, [viewType, timeRange, status, searchTerm]);
  
  // Handle filter changes
  const handleViewTypeChange = (value) => setViewType(value);
  const handleTimeRangeChange = (value) => setTimeRange(value);
  const handleStatusChange = (value) => setStatus(value);
  const handleSearch = (value) => setSearchTerm(value);
  
  const showModal = () => {
    setIsModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  // Helper function to render deadline status with color
  const renderDeadlineStatus = (deadline) => {
    if (!deadline) return <Tag color="default">No deadline</Tag>;
    
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
    if (deadlineDate < today) {
      return <Tag color="red">Overdue</Tag>;
    } else if (daysUntilDeadline <= 7) {
      return <Tag color="orange">Due in {daysUntilDeadline} days</Tag>;
    } else {
      return <Tag color="green">{deadline}</Tag>;
    }
  };
  
  // Updated Course table columns
  const courseColumns = [
    {
      title: 'Course',
      dataIndex: 'courseName', // Updated field name based on API
      key: 'courseName',
      render: (text, record) => (
        <Space>
          <BookOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
          {record.featured && <Tag color="gold">Featured</Tag>}
        </Space>
      ),
    },
    {
      title: 'Individual Enrollments',
      dataIndex: 'individualEnrollments',
      key: 'individualEnrollments',
      render: (count) => (
        <Space>
          <UserOutlined />
          <span>{count || 0}</span>
        </Space>
      ),
    },
    {
      title: 'Owner Name',
      dataIndex: 'ownerName',
      key: 'ownerName',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'active', // Updated field name based on API
      render: (active) => {
        let status = active ? 'active' : 'inactive';
        let color = active ? 'green' : 'default';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.active === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => viewEntityDetails('course', record.courseId)}>View Details</Button>
      ),
    },
  ];
  
  // Updated Bundle table columns
  const bundleColumns = [
    {
      title: 'Bundle',
      dataIndex: 'bundleName', // Updated field name based on API
      key: 'bundleName',
      render: (text, record) => (
        <Space>
          <AppstoreOutlined style={{ color: '#722ed1' }} />
          <Text strong>{text}</Text>
          <Tag color="purple">{record.totalCourses} Courses</Tag>
        </Space>
      ),
    },
    {
      title: 'Individual Enrollments',
      dataIndex: 'individualEnrollments',
      key: 'individualEnrollments',
      render: (count) => (
        <Space>
          <UserOutlined />
          <span>{count || 0}</span>
        </Space>
      ),
    },
    {
      title: 'Avg. Completion',
      dataIndex: 'averageCompletion',
      key: 'averageCompletion',
      render: (rate) => <Progress percent={rate || 0} size="small" />,
      sorter: (a, b) => (a.averageCompletion || 0) - (b.averageCompletion || 0),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'active', // Updated field name based on API
      render: (active) => {
        let status = active ? 'active' : 'inactive';
        let color = active ? 'green' : 'default';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => viewEntityDetails('bundle', record.bundleId)}>View Details</Button>
      ),
    },
  ];
  
  // Updated user enrollment columns for expanded rows
  const userEnrollmentColumns = [
    { 
      title: 'Name', 
      dataIndex: 'userName', // Updated field name based on API
      key: 'userName' 
    },
    { 
      title: 'Progress', 
      dataIndex: 'progress', 
      key: 'progress', 
      render: (progress) => <Progress percent={progress || 0} size="small" /> 
    },
    { 
      title: 'Assigned By', 
      dataIndex: 'assignedBy', 
      key: 'assignedBy' 
    },
    { 
      title: 'Enrollment Date', 
      dataIndex: 'enrollmentDate', 
      key: 'enrollmentDate' 
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline) => renderDeadlineStatus(deadline)
    }
  ];
  
  // User/Group table columns
  const entityColumns = [
    {
      title: viewType === 'users' ? 'User' : 'Group',
      dataIndex: 'entityName',
      key: 'entityName',
      render: (text, record) => (
        <Space>
          {viewType === 'users' ? <UserOutlined /> : <TeamOutlined />}
          <Text strong>{text}</Text>
          {viewType === 'groups' && record.memberCount && <Tag color="blue">{record.memberCount} Members</Tag>}
        </Space>
      ),
    },
    {
      title: 'Course Enrollments',
      dataIndex: 'courseEnrollments',
      key: 'courseEnrollments',
      render: (courses) => <Tag color="blue">{Array.isArray(courses) ? courses.length : (courses || 0)}</Tag>,
    },
    {
      title: 'Bundle Enrollments',
      dataIndex: 'bundleEnrollments',
      key: 'bundleEnrollments',
      render: (bundles) => <Tag color="purple">{Array.isArray(bundles) ? bundles.length : (bundles || 0)}</Tag>,
    },
    {
      title: 'Total Courses',
      dataIndex: 'totalCourses',
      key: 'totalCourses',
    },
    {
      title: 'Average Completion',
      dataIndex: 'averageCompletion',
      key: 'averageCompletion',
      render: (rate) => <Progress percent={rate || 0} size="small" />,
      sorter: (a, b) => (a.averageCompletion || 0) - (b.averageCompletion || 0),
    },
    {
      title: 'Upcoming Deadlines',
      dataIndex: 'upcomingDeadlines',
      key: 'upcomingDeadlines',
      render: (count) => count > 0 ? <Badge count={count} style={{ backgroundColor: count > 2 ? '#f5222d' : '#faad14' }} /> : '0',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'active',
      render: (active) => {
        let status = active ? 'active' : 'inactive';
        let color = active ? 'green' : 'default';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => viewEntityDetails(viewType === 'users' ? 'user' : 'group', record.entityId)}>View Details</Button>
      ),
    },
  ];
  
  // View details handler
  const viewEntityDetails = (type, id) => {
    message.info(`Viewing details for ${type} ID: ${id}`);
    // Implementation for viewing details would go here
    // Could navigate to a detail page or open a modal with more info
  };
  
  // Render enrolled users for a course
  const expandCourseRow = (record) => {
    // With the updated API structure, we'll use the enrolledUserDTOList if available
    const enrolledUsers = record.enrolledUserDTOList || [];
    
    return (
      <div style={{ margin: 0 }}>
        <Text strong>Enrolled Users:</Text>
        <Table 
          columns={userEnrollmentColumns} 
          dataSource={enrolledUsers.map(user => ({
            key: user.userId,
            userName: user.userName,
            progress: user.progress || 0,
            enrollmentDate: user.enrollmentDate || 'N/A',
            deadline: user.deadline || 'N/A',
            assignedBy: user.assignedBy || 'System'
          }))}
          pagination={false}
          size="small"
        />
      </div>
    );
  };
  
  // Render enrolled users for a bundle
  const expandBundleRow = (record) => {
    // With the updated API structure, we'll use the enrolledUserDTOList if available
    const enrolledUsers = record.enrolledUserDTOList || [];
    
    return (
      <div style={{ margin: 0 }}>
        <Text strong>Enrolled Users:</Text>
        <Table 
          columns={userEnrollmentColumns}
          dataSource={enrolledUsers.map(user => ({
            key: user.userId,
            userName: user.userName,
            progress: user.progress || 0,
            enrollmentDate: user.enrollmentDate || 'N/A',
            deadline: user.deadline || 'N/A',
            assignedBy: user.assignedBy || 'System'
          }))}
          pagination={false}
          size="small"
        />
      </div>
    );
  };
  
  // Function to handle expanded row rendering for users/groups
  const expandEntityRow = (record) => {
    // Since we don't have direct API for entity details with the updated API structure,
    // We'll use the available data from the record
    
    return (
      <div style={{ margin: 0 }}>
        <Tabs defaultActiveKey="enrolled-courses">
          <TabPane tab="Enrolled Courses" key="enrolled-courses">
            <Table 
              columns={[
                { title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Progress', dataIndex: 'progress', key: 'progress', render: (progress) => <Progress percent={progress || 0} size="small" /> },
                { title: 'Enrollment Date', dataIndex: 'enrollmentDate', key: 'enrollmentDate' },
                { title: 'Deadline', dataIndex: 'deadline', key: 'deadline', render: (deadline) => renderDeadlineStatus(deadline) }
              ]}
              dataSource={record.courseEnrollments || []}
              pagination={false}
              size="small"
            />
          </TabPane>
          <TabPane tab="Enrolled Bundles" key="enrolled-bundles">
            <Table 
              columns={[
                { title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Progress', dataIndex: 'progress', key: 'progress', render: (progress) => <Progress percent={progress || 0} size="small" /> },
                { title: 'Enrollment Date', dataIndex: 'enrollmentDate', key: 'enrollmentDate' },
                { title: 'Deadline', dataIndex: 'deadline', key: 'deadline', render: (deadline) => renderDeadlineStatus(deadline) }
              ]}
              dataSource={record.bundleEnrollments || []}
              pagination={false}
              size="small"
            />
          </TabPane>
        </Tabs>
      </div>
    );
  };
  
  return (
    <div className="admin-section">
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ margin: '16px 0' }}>
              Enrollment Dashboard
            </Title>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={showModal}
              >
                Add Enrollment
              </Button>
              <Select
                defaultValue="users"
                style={{ width: 120 }}
                onChange={handleViewTypeChange}
                value={viewType}
              >
                <Option value="users">Users</Option>
                <Option value="groups">Groups</Option>
              </Select>
              <Select
                defaultValue="30days"
                style={{ width: 140 }}
                onChange={handleTimeRangeChange}
                value={timeRange}
              >
                <Option value="7days">Last 7 days</Option>
                <Option value="30days">Last 30 days</Option>
                <Option value="quarter">Last quarter</Option>
                <Option value="custom">Custom range</Option>
              </Select>
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                onChange={handleStatusChange}
                value={status}
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="completed">Completed</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                onChange={(e) => handleSearch(e.target.value)}
                value={searchTerm}
              />
            </Space>
          </div>
        </Header>
        
        <Content style={{ margin: '16px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', margin: '50px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* STATS SECTION */}
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Card>
                    <Statistic 
                      title="Total Enrollments"
                      value={dashboardData.statistics.totalEnrollments}
                      prefix={<BookOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic 
                      title="Users Enrolled"
                      value={dashboardData.statistics.usersEnrolled}
                      prefix={<UserOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic 
                      title="Groups Enrolled"
                      value={dashboardData.statistics.groupsEnrolled}
                      prefix={<TeamOutlined />}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic 
                      title="Overall Completion Rate"
                      value={dashboardData.statistics.completionRate}
                      prefix={<RiseOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
              </Row>
              
              {/* Second row with Top Course and Upcoming Deadlines */}
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                  <Card>
                    <Statistic 
                      title="Top Enrolled Course"
                      value={dashboardData.statistics.topEnrolledCourse || 'N/A'}
                      prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic 
                      title="Course Completions"
                      value={dashboardData.statistics.courseCompletions}
                      prefix={<BarChartOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic 
                      title="Upcoming Deadlines (7 days)"
                      value={dashboardData.statistics.upcomingDeadlines}
                      prefix={<ClockCircleOutlined style={{ color: '#fa541c' }} />}
                      valueStyle={{ 
                        color: dashboardData.statistics.upcomingDeadlines > 3 ? '#cf1322' : '#fa8c16' 
                      }}
                    />
                  </Card>
                </Col>
              </Row>
              
              <Card>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Overview" key="1">
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Text type="secondary">Charts and visualizations would appear here</Text>
                    </div>
                  </TabPane>
                  
                  <TabPane tab="Courses" key="2">
                    <Table 
                      columns={courseColumns} 
                      dataSource={dashboardData.courses}
                      rowKey="courseId"
                      expandable={{
                        expandedRowRender: expandCourseRow,
                      }}
                    />
                  </TabPane>
                  
                  <TabPane tab="Bundles" key="3">
                    <Table 
                      columns={bundleColumns} 
                      dataSource={dashboardData.bundles}
                      rowKey="bundleId"
                      expandable={{
                        expandedRowRender: expandBundleRow,
                      }}
                    />
                  </TabPane>
                  
                  <TabPane tab={viewType === 'users' ? 'Users' : 'Groups'} key="4">
                    <Table 
                      columns={entityColumns} 
                      dataSource={viewType === 'users' ? dashboardData.users : dashboardData.groups}
                      rowKey="entityId"
                      expandable={{
                        expandedRowRender: expandEntityRow,
                      }}
                    />
                  </TabPane>
                </Tabs>
              </Card>
            </>
          )}
        </Content>
      </Layout>

      {/* Add Enrollment Modal */}
      <AddEnrollmentModal 
        visible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={() => {
          setIsModalVisible(false);
          fetchDashboardData(); // Refresh dashboard data after successful enrollment
          }
        }
      />
    </div>
  );
};

export default EnrollmentDashboard;