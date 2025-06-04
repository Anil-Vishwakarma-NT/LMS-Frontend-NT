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
  Empty
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
import {
  getCourseColumns,
  getBundleColumns,
  getEntityColumns,
  userEnrollmentColumns,
  expandCourseRow,
  expandBundleRow,
  expandEntityRow
} from './EnrollmentTables';
import AddEnrollmentModal from './AddEnrollmentModal';
import EnrollmentService from './enrollmentService';
import AdminHOC from '../../shared/HOC/AdminHOC';

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
  
  // State for expanded rows
  const [expandedCourseRows, setExpandedCourseRows] = useState([]);
  const [expandedBundleRows, setExpandedBundleRows] = useState([]);
  const [expandedEntityRows, setExpandedEntityRows] = useState([]);
  
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
       
        userEnrollmentsResponse
      ] = await Promise.all([
        EnrollmentService.fetchStats(),
        EnrollmentService.fetchUserCourses(filters),
       
        EnrollmentService.fetchUserEnrollments(filters)
      ]);
      
      // Process user enrollments to format for users & groups views
      // Process user enrollments to format for users & groups views
      const users = userEnrollmentsResponse || [];
      const groups = []; // Currently not implementing groups view correctly
      
      // Process courses to ensure they have unique keys
      const processedCourses = (userCoursesResponse || []).map(course => ({
        ...course,
        key: `course-${course.courseId || Math.random().toString(36).substring(2, 11)}`
      }));
      
      // Process bundles to ensure they have unique keys
      // const processedBundles = (userBundlesResponse || []).map(bundle => ({
      //   ...bundle,
      //   key: `bundle-${bundle.bundleId || Math.random().toString(36).substring(2, 11)}`
      // }));
      
      setDashboardData({
        courses: processedCourses,
        // bundles: processedBundles,
        users: users.map(user => ({
          key: `user-${user.userId || Math.random().toString(36).substring(2, 11)}`,
          entityId: user.userId,
          entityName: user.userName,
          courseEnrollments: user.courseEnrollments || 0,
          bundleEnrollments: user.bundleEnrollments || 0,
          totalCourses: user.totalCourses || 0,
          averageCompletion: user.averageCompletion || 0,
          upcomingDeadlines: user.upcomingDeadlines || 0,
          active: user.status !== false, // Convert to boolean if it's not already
          enrolledCoursesList: user.enrolledCoursesList || [],
          enrolledBundlesList: user.enrolledBundlesList || []
        })),
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
    // Reset expanded rows when filters change
    setExpandedCourseRows([]);
    setExpandedBundleRows([]);
    setExpandedEntityRows([]);
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
  
  // Handle row expansion for courses
  const onCourseExpand = (expanded, record) => {
    setExpandedCourseRows(expanded ? [record.key] : []);
  };
  
  // Handle row expansion for bundles
  const onBundleExpand = (expanded, record) => {
    setExpandedBundleRows(expanded ? [record.key] : []);
  };
  
  // Handle row expansion for entities (users/groups)
  const onEntityExpand = (expanded, record) => {
    setExpandedEntityRows(expanded ? [record.key] : []);
  };
  
  return (
    <div className="admin-section">
      <Content style={{ margin: '0 16px' }}>
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
                      columns={getCourseColumns()} 
                      dataSource={dashboardData.courses}
                      expandable={{
                        expandedRowRender: expandCourseRow,
                        onExpand: onCourseExpand,
                        expandedRowKeys: expandedCourseRows
                      }}
                      rowKey="key"
                    />
                  </TabPane>
                  
                  <TabPane tab="Bundles" key="3">
                    <Table 
                      columns={getBundleColumns()} 
                      dataSource={dashboardData.bundles}
                      expandable={{
                        expandedRowRender: expandBundleRow,
                        onExpand: onBundleExpand,
                        expandedRowKeys: expandedBundleRows
                      }}
                      rowKey="key"
                    />
                  </TabPane>
                  
                  <TabPane tab={viewType === 'users' ? 'Users' : 'Groups'} key="4">
                    <Table 
                      columns={getEntityColumns(viewType)} 
                      dataSource={viewType === 'users' ? dashboardData.users : dashboardData.groups}
                      expandable={{
                        expandedRowRender: expandEntityRow,
                        onExpand: onEntityExpand,
                        expandedRowKeys: expandedEntityRows
                      }}
                      rowKey="key"
                    />
                  </TabPane>
                </Tabs>
              </Card>
            </>
          )}
        </Content>
      </Layout>
      </Content>
      

      {/* Add Enrollment Modal */}
      <AddEnrollmentModal 
        visible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={() => {
          setIsModalVisible(false);
          fetchDashboardData(); // Refresh dashboard data after successful enrollment
        }}
      />
    </div>
  );
};

export default AdminHOC(EnrollmentDashboard);