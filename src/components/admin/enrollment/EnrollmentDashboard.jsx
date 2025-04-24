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
import AdminDashboard from '../adminDashboard/AdminDashboard';

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
  const [form] = Form.useForm();
  const [enrollmentType, setEnrollmentType] = useState('user');
  const [contentType, setContentType] = useState('course');
  
  // State for data
  const [enrollmentData, setEnrollmentData] = useState({
    courses: [],
    bundles: [],
    users: [],
    groups: []
  });
  
  // Mock API call - replace with actual API calls
  const fetchData = (filters) => {
    setIsLoading(true);
    console.log('Fetching data with filters:', filters);
    
    // Simulate API delay
    setTimeout(() => {
      setEnrollmentData({
        courses: mockCourses,
        bundles: mockBundles,
        users: mockUsers,
        groups: mockGroups
      });
      setIsLoading(false);
    }, 800);
  };
  
  // Fetch data on filter change
  useEffect(() => {
    fetchData({
      viewType,
      timeRange,
      status,
      searchTerm
    });
  }, [viewType, timeRange, status, searchTerm]);
  
  // Handle filter changes
  const handleViewTypeChange = (value) => setViewType(value);
  const handleTimeRangeChange = (value) => setTimeRange(value);
  const handleStatusChange = (value) => setStatus(value);
  const handleSearch = (value) => setSearchTerm(value);
  
  // Handle modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEnrollmentTypeChange = (e) => {
    setEnrollmentType(e.target.value);
  };

  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
  };

  const handleSubmit = (values) => {
    console.log('Creating new enrollment with values:', values);
    // Here you would make an API call to create the enrollment
    message.success(`New ${values.contentType} enrollment created successfully!`);
    setIsModalVisible(false);
    form.resetFields();
  };
  
  // Calculate top course by enrollments
  const getTopCourse = () => {
    if (mockCourses && mockCourses.length > 0) {
      const sorted = [...mockCourses].sort((a, b) => b.totalEnrollments - a.totalEnrollments);
      return sorted[0].name;
    }
    return "N/A";
  };
  
  // Calculate upcoming deadlines
  const getUpcomingDeadlines = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    let deadlinesCount = 0;
    
    // Count course deadlines in the next 7 days
    mockCourses.forEach(course => {
      if (course.deadline) {
        const deadlineDate = new Date(course.deadline);
        if (deadlineDate >= today && deadlineDate <= nextWeek) {
          deadlinesCount++;
        }
      }
    });
    
    // Count bundle deadlines in the next 7 days
    mockBundles.forEach(bundle => {
      if (bundle.deadline) {
        const deadlineDate = new Date(bundle.deadline);
        if (deadlineDate >= today && deadlineDate <= nextWeek) {
          deadlinesCount++;
        }
      }
    });
    
    return deadlinesCount;
  };
  
  // Overview statistics - UPDATED WITH DEADLINES
  const stats = {
    totalEnrollments: 256,
    courseCompletions: 187,
    usersEnrolled: mockUsers.length,
    groupsEnrolled: mockGroups.length,
    topCourse: getTopCourse(),
    completionRate: "73%",
    upcomingDeadlines: getUpcomingDeadlines()
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
  
  // Course table columns with deadline
  const courseColumns = [
    {
      title: 'Course',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <BookOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
          {record.isFeatured && <Tag color="gold">Featured</Tag>}
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
          <span>{count}</span>
        </Space>
      ),
    },
    {
      title: 'Group Enrollments',
      dataIndex: 'groupEnrollments',
      key: 'groupEnrollments',
      render: (count) => (
        <Space>
          <TeamOutlined />
          <span>{count}</span>
        </Space>
      ),
    },
    {
      title: 'Total Enrollments',
      dataIndex: 'totalEnrollments',
      key: 'totalEnrollments',
      sorter: (a, b) => a.totalEnrollments - b.totalEnrollments,
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (rate) => <Progress percent={rate} size="small" />,
      sorter: (a, b) => a.completionRate - b.completionRate,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline) => renderDeadlineStatus(deadline),
      sorter: (a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'active' ? 'green' : 'default';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" size="small">View Details</Button>
      ),
    },
  ];
  
  // Bundle table columns with deadline
  const bundleColumns = [
    {
      title: 'Bundle',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <AppstoreOutlined style={{ color: '#722ed1' }} />
          <Text strong>{text}</Text>
          <Tag color="purple">{record.courseCount} Courses</Tag>
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
          <span>{count}</span>
        </Space>
      ),
    },
    {
      title: 'Group Enrollments',
      dataIndex: 'groupEnrollments',
      key: 'groupEnrollments',
      render: (count) => (
        <Space>
          <TeamOutlined />
          <span>{count}</span>
        </Space>
      ),
    },
    {
      title: 'Total Enrollments',
      dataIndex: 'totalEnrollments',
      key: 'totalEnrollments',
      sorter: (a, b) => a.totalEnrollments - b.totalEnrollments,
    },
    {
      title: 'Avg. Completion',
      dataIndex: 'avgCompletion',
      key: 'avgCompletion',
      render: (rate) => <Progress percent={rate} size="small" />,
      sorter: (a, b) => a.avgCompletion - b.avgCompletion,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline) => renderDeadlineStatus(deadline),
      sorter: (a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'active' ? 'green' : 'default';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" size="small">View Details</Button>
      ),
    },
  ];
  
  // User/Group enrollment columns with deadline
  const enrollmentColumns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name' 
    },
    { 
      title: 'Progress', 
      dataIndex: 'progress', 
      key: 'progress', 
      render: (progress) => <Progress percent={progress} size="small" /> 
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
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {viewType === 'users' ? <UserOutlined /> : <TeamOutlined />}
          <Text strong>{text}</Text>
          {viewType === 'groups' && <Tag color="blue">{record.memberCount} Members</Tag>}
        </Space>
      ),
    },
    {
      title: 'Course Enrollments',
      dataIndex: 'courseEnrollments',
      key: 'courseEnrollments',
      render: (courses) => <Tag color="blue">{courses.length}</Tag>,
    },
    {
      title: 'Bundle Enrollments',
      dataIndex: 'bundleEnrollments',
      key: 'bundleEnrollments',
      render: (bundles) => <Tag color="purple">{bundles.length}</Tag>,
    },
    {
      title: 'Total Courses',
      dataIndex: 'totalCourses',
      key: 'totalCourses',
    },
    {
      title: 'Average Completion',
      dataIndex: 'avgCompletion',
      key: 'avgCompletion',
      render: (rate) => <Progress percent={rate} size="small" />,
      sorter: (a, b) => a.avgCompletion - b.avgCompletion,
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
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'active' ? 'green' : 'default';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" size="small">View Details</Button>
      ),
    },
  ];
  
  return (
    <div className = 'admin-section'>
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
            >
              <Option value="users">Users</Option>
              <Option value="groups">Groups</Option>
            </Select>
            <Select
              defaultValue="30days"
              style={{ width: 140 }}
              onChange={handleTimeRangeChange}
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
            {/* UPDATED STATS SECTION WITH DEADLINES */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Total Enrollments"
                    value={stats.totalEnrollments}
                    prefix={<BookOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Users Enrolled"
                    value={stats.usersEnrolled}
                    prefix={<UserOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Groups Enrolled"
                    value={stats.groupsEnrolled}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic 
                    title="Overall Completion Rate"
                    value={stats.completionRate}
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
                    value={stats.topCourse}
                    prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="Course Completions"
                    value={stats.courseCompletions}
                    prefix={<BarChartOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="Upcoming Deadlines (7 days)"
                    value={stats.upcomingDeadlines}
                    prefix={<ClockCircleOutlined style={{ color: '#fa541c' }} />}
                    valueStyle={{ color: stats.upcomingDeadlines > 3 ? '#cf1322' : '#fa8c16' }}
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
                    dataSource={mockCourses}
                    rowKey="id"
                    expandable={{
                      expandedRowRender: record => (
                        <div style={{ margin: 0 }}>
                          <Text strong>Enrolled {viewType === 'users' ? 'Users' : 'Groups'}:</Text>
                          <Table 
                            columns={enrollmentColumns} 
                            dataSource={record.enrolledEntities}
                            pagination={false}
                            size="small"
                          />
                        </div>
                      ),
                    }}
                  />
                </TabPane>
                
                <TabPane tab="Bundles" key="3">
                  <Table 
                    columns={bundleColumns} 
                    dataSource={mockBundles}
                    rowKey="id"
                    expandable={{
                      expandedRowRender: record => (
                        <div style={{ margin: 0 }}>
                          <Text strong>Courses in Bundle:</Text>
                          <Table 
                            columns={[
                              { title: 'Course Name', dataIndex: 'name', key: 'name' },
                              { title: 'Enrollments', dataIndex: 'enrollments', key: 'enrollments' },
                              { 
                                title: 'Deadline', 
                                dataIndex: 'deadline', 
                                key: 'deadline',
                                render: (deadline) => renderDeadlineStatus(deadline)
                              }
                            ]} 
                            dataSource={record.courses}
                            pagination={false}
                            size="small"
                          />
                        </div>
                      ),
                    }}
                  />
                </TabPane>
                
                <TabPane tab={viewType === 'users' ? 'Users' : 'Groups'} key="4">
                  <Table 
                    columns={entityColumns} 
                    dataSource={viewType === 'users' ? mockUsers : mockGroups}
                    rowKey="id"
                    expandable={{
                      expandedRowRender: record => (
                        <div style={{ margin: 0 }}>
                          <Tabs defaultActiveKey="enrolled-courses">
                            <TabPane tab="Enrolled Courses" key="enrolled-courses">
                              <Table 
                                columns={enrollmentColumns}
                                dataSource={record.courseEnrollments}
                                pagination={false}
                                size="small"
                              />
                            </TabPane>
                            <TabPane tab="Enrolled Bundles" key="enrolled-bundles">
                              <Table 
                                columns={enrollmentColumns}
                                dataSource={record.bundleEnrollments}
                                pagination={false}
                                size="small"
                              />
                            </TabPane>
                          </Tabs>
                        </div>
                      ),
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
    <Modal
      title="Add New Enrollment"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        initialValues={{ enrollmentType: 'user', contentType: 'course' }}
      >
        {/* Enrollment Type Selection */}
        <Form.Item
          name="enrollmentType"
          label="Enrollment Type"
          rules={[{ required: true, message: 'Please select an enrollment type!' }]}
        >
          <Radio.Group onChange={handleEnrollmentTypeChange} value={enrollmentType}>
            <Radio value="user">User</Radio>
            <Radio value="group">Group</Radio>
          </Radio.Group>
        </Form.Item>
        
        {/* User/Group Selection */}
        <Form.Item
          name="entityId"
          label={enrollmentType === 'user' ? 'Select User' : 'Select Group'}
          rules={[{ required: true, message: `Please select a ${enrollmentType}!` }]}
        >
          <Select placeholder={`Select a ${enrollmentType}`}>
            {enrollmentType === 'user' ? 
              mockUsers.map(user => (
                <Option key={user.id} value={user.id}>{user.name}</Option>
              )) : 
              mockGroups.map(group => (
                <Option key={group.id} value={group.id}>{group.name}</Option>
              ))
            }
          </Select>
        </Form.Item>
        
        {/* Content Type Selection */}
        <Form.Item
          name="contentType"
          label="Content Type"
          rules={[{ required: true, message: 'Please select a content type!' }]}
        >
          <Radio.Group onChange={handleContentTypeChange} value={contentType}>
            <Radio value="course">Course</Radio>
            <Radio value="bundle">Bundle</Radio>
          </Radio.Group>
        </Form.Item>
        
        {/* Course/Bundle Selection */}
        <Form.Item
          name="contentId"
          label={contentType === 'course' ? 'Select Course' : 'Select Bundle'}
          rules={[{ required: true, message: `Please select a ${contentType}!` }]}
        >
          <Select placeholder={`Select a ${contentType}`}>
            {contentType === 'course' ? 
              mockCourses.map(course => (
                <Option key={course.id} value={course.id}>{course.name}</Option>
              )) : 
              mockBundles.map(bundle => (
                <Option key={bundle.id} value={bundle.id}>{bundle.name}</Option>
              ))
            }
          </Select>
        </Form.Item>
        
        {/* Deadline Selection */}
        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: 'Please select a deadline!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        
        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Create Enrollment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    </div>
    
  );
};

// Mock data for demonstration - UPDATED WITH DEADLINES
const mockCourses = [
  {
    id: 1,
    name: 'Introduction to React',
    individualEnrollments: 45,
    groupEnrollments: 12,
    totalEnrollments: 57,
    completionRate: 78,
    status: 'active',
    isFeatured: true,
    deadline: '2025-05-15',
    enrolledEntities: [
      { name: 'John Doe', progress: 85, enrollmentDate: '2025-03-15', deadline: '2025-05-15' },
      { name: 'Engineering Team', progress: 62, enrollmentDate: '2025-03-10', deadline: '2025-05-15' }
    ]
  },
  {
    id: 2,
    name: 'Advanced JavaScript',
    individualEnrollments: 38,
    groupEnrollments: 5,
    totalEnrollments: 43,
    completionRate: 65,
    status: 'active',
    isFeatured: false,
    deadline: '2025-04-28',
    enrolledEntities: [
      { name: 'Jane Smith', progress: 92, enrollmentDate: '2025-03-12', deadline: '2025-04-28' },
      { name: 'Frontend Team', progress: 75, enrollmentDate: '2025-03-08', deadline: '2025-04-28' }
    ]
  },
  {
    id: 3,
    name: 'Python for Data Science',
    individualEnrollments: 52,
    groupEnrollments: 8,
    totalEnrollments: 60,
    completionRate: 82,
    status: 'active',
    isFeatured: true,
    deadline: '2025-05-30',
    enrolledEntities: [
      { name: 'Robert Johnson', progress: 68, enrollmentDate: '2025-03-05', deadline: '2025-05-30' },
      { name: 'Data Science Team', progress: 90, enrollmentDate: '2025-02-28', deadline: '2025-05-30' }
    ]
  },
  {
    id: 4,
    name: 'UX Design Fundamentals',
    individualEnrollments: 29,
    groupEnrollments: 3,
    totalEnrollments: 32,
    completionRate: 55,
    status: 'inactive',
    isFeatured: false,
    deadline: '2025-04-25',
    enrolledEntities: [
      { name: 'Emily Chen', progress: 48, enrollmentDate: '2025-03-20', deadline: '2025-04-25' },
      { name: 'Design Team', progress: 63, enrollmentDate: '2025-03-15', deadline: '2025-04-25' }
    ]
  }
];

const mockBundles = [
  {
    id: 1,
    name: 'Web Development Path',
    individualEnrollments: 32,
    groupEnrollments: 7,
    totalEnrollments: 39,
    avgCompletion: 71,
    status: 'active',
    courseCount: 5,
    deadline: '2025-06-30',
    courses: [
      { name: 'Introduction to HTML/CSS', enrollments: 39, deadline: '2025-05-15' },
      { name: 'JavaScript Fundamentals', enrollments: 36, deadline: '2025-05-30' },
      { name: 'Introduction to React', enrollments: 35, deadline: '2025-06-15' },
      { name: 'Node.js Basics', enrollments: 33, deadline: '2025-06-30' },
      { name: 'Building Full-Stack Applications', enrollments: 31, deadline: '2025-06-30' }
    ]
  },
  {
    id: 2,
    name: 'Data Science Essentials',
    individualEnrollments: 28,
    groupEnrollments: 4,
    totalEnrollments: 32,
    avgCompletion: 65,
    status: 'active',
    courseCount: 4,
    deadline: '2025-07-15',
    courses: [
      { name: 'Python for Data Science', enrollments: 32, deadline: '2025-05-30' },
      { name: 'Data Visualization with Matplotlib', enrollments: 29, deadline: '2025-06-15' },
      { name: 'Introduction to Machine Learning', enrollments: 26, deadline: '2025-07-01' },
      { name: 'Statistical Analysis', enrollments: 28, deadline: '2025-07-15' }
    ]
  },
  {
    id: 3,
    name: 'UI/UX Design Bundle',
    individualEnrollments: 21,
    groupEnrollments: 2,
    totalEnrollments: 23,
    avgCompletion: 58,
    status: 'inactive',
    courseCount: 3,
    deadline: '2025-05-01',
    courses: [
      { name: 'UX Design Fundamentals', enrollments: 23, deadline: '2025-04-25' },
      { name: 'UI Design Principles', enrollments: 20, deadline: '2025-05-01' },
      { name: 'Prototyping with Figma', enrollments: 18, deadline: '2025-05-01' }
    ]
  }
];

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    courseEnrollments: [
      { name: 'Introduction to React', progress: 85, enrollmentDate: '2025-03-15', deadline: '2025-05-15' },
      { name: 'Advanced JavaScript', progress: 60, enrollmentDate: '2025-03-10', deadline: '2025-04-28' }
    ],
    bundleEnrollments: [
      { name: 'Web Development Path', progress: 75, enrollmentDate: '2025-03-01', deadline: '2025-06-30' }
    ],
    totalCourses: 7,
    avgCompletion: 68,
    status: 'active',
    upcomingDeadlines: 1
  },
  {
    id: 2,
    name: 'Jane Smith',
    courseEnrollments: [
      { name: 'Python for Data Science', progress: 92, enrollmentDate: '2025-03-12', deadline: '2025-05-30' }
    ],
    bundleEnrollments: [
      { name: 'Data Science Essentials', progress: 88, enrollmentDate: '2025-03-05', deadline: '2025-07-15' }
    ],
    totalCourses: 5,
    avgCompletion: 90,
    status: 'active',
    upcomingDeadlines: 0
  },
  {
    id: 3,
    name: 'Robert Johnson',
    courseEnrollments: [
      { name: 'UX Design Fundamentals', progress: 45, enrollmentDate: '2025-03-20', deadline: '2025-04-25' }
    ],
    bundleEnrollments: [
      { name: 'UI/UX Design Bundle', progress: 40, enrollmentDate: '2025-03-18', deadline: '2025-05-01' }
    ],
    totalCourses: 4,
    avgCompletion: 42,
    status: 'active',
    upcomingDeadlines: 2
  }
];

const mockGroups = [
  {
    id: 1,
    name: 'Engineering Team',
    memberCount: 12,
    courseEnrollments: [
      { name: 'Introduction to React', progress: 62, enrollmentDate: '2025-03-10', deadline: '2025-05-15' },
      { name: 'Advanced JavaScript', progress: 55, enrollmentDate: '2025-03-05', deadline: '2025-04-28' }
    ],
    bundleEnrollments: [
      { name: 'Web Development Path', progress: 58, enrollmentDate: '2025-02-28', deadline: '2025-06-30' }
    ],
    totalCourses: 7,
    avgCompletion: 60,
    status: 'active',
    upcomingDeadlines: 1
  },
  {
    id: 2,
    name: 'Data Science Team',
    memberCount: 8,
    courseEnrollments: [
      { name: 'Python for Data Science', progress: 90, enrollmentDate: '2025-02-28', deadline: '2025-05-30' }
    ],
    bundleEnrollments: [
      { name: 'Data Science Essentials', progress: 85, enrollmentDate: '2025-02-20', deadline: '2025-07-15' }
    ],
    totalCourses: 5,
    avgCompletion: 88,
    status: 'active',
    upcomingDeadlines: 0
  },
  {
    id: 3,
    name: 'Design Team',
    memberCount: 6,
    courseEnrollments: [
      { name: 'UX Design Fundamentals', progress: 63, enrollmentDate: '2025-03-15', deadline: '2025-04-25' }
    ],
    bundleEnrollments: [
      { name: 'UI/UX Design Bundle', progress: 58, enrollmentDate: '2025-03-10', deadline: '2025-05-01' }
    ],
    totalCourses: 4,
    avgCompletion: 60,
    status: 'active',
    upcomingDeadlines: 2
  }
];

export default EnrollmentDashboard;










// import React, { useState, useEffect } from 'react';
// import {
//   Layout,
//   Menu,
//   Card,
//   Table,
//   Tabs,
//   Select,
//   DatePicker,
//   Input,
//   Typography,
//   Tag,
//   Statistic,
//   Badge,
//   Space,
//   Button,
//   Progress,
//   Divider,
//   Spin,
//   Alert,
//   Row,
//   Col,
//   Modal,
//   Form,
//   Radio,
//   message,
// } from 'antd';
// import {
//   UserOutlined,
//   TeamOutlined,
//   BookOutlined,
//   AppstoreOutlined,
//   FilterOutlined,
//   SearchOutlined,
//   CalendarOutlined,
//   BarChartOutlined,
//   TrophyOutlined,
//   RiseOutlined,
//   ClockCircleOutlined,
//   PlusOutlined,
// } from '@ant-design/icons';
// import AdminDashboard from '../adminDashboard/AdminDashboard';
// import EnrollmentService from './enrollmentService';

// const { Header, Content, Sider } = Layout;
// const { Title, Text } = Typography;
// const { TabPane } = Tabs;
// const { Option } = Select;
// const { RangePicker } = DatePicker;

// const EnrollmentDashboard = () => {
//   // State for filters
//   const [viewType, setViewType] = useState('users'); // 'users' or 'groups'
//   const [timeRange, setTimeRange] = useState('30days');
//   const [status, setStatus] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   // State for add enrollment modal
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();
//   const [enrollmentType, setEnrollmentType] = useState('user');
//   const [contentType, setContentType] = useState('course');
  
//   // State for data
//   const [dashboardData, setDashboardData] = useState({
//     courses: [],
//     bundles: [],
//     users: [],
//     groups: [],
//     statistics: {
//       totalEnrollments: 0,
//       usersEnrolled: 0,
//       groupsEnrolled: 0,
//       completionRate: "0%",
//       courseCompletions: 0,
//       topCourse: "N/A",
//       upcomingDeadlines: 0
//     }
//   });
  
//   // State for dropdown options
//   const [availableCourses, setAvailableCourses] = useState([]);
//   const [availableBundles, setAvailableBundles] = useState([]);
//   const [availableUsers, setAvailableUsers] = useState([]);
//   const [availableGroups, setAvailableGroups] = useState([]);
  
//   // Prepare filters for API calls
//   const getFilters = () => {
//     return {
//       viewType,
//       timeRange,
//       status,
//       searchTerm 
//     };
//   };
  
//   // Fetch all data needed for the dashboard
//   const fetchDashboardData = async () => {
//     console.log("line no. 1091")
//     setIsLoading(true);
//     try {
//       const filters = getFilters();

//       console.log("filters", filters)
      
//       // Fetch all data in parallel
//       const [
//         dashboardResponse,
//         coursesResponse,
//         bundlesResponse,
//         usersResponse, 
//         groupsResponse,
//         statisticsResponse
//       ] = await Promise.all([
//         EnrollmentService.fetchDashboardData(filters),
//         EnrollmentService.fetchCourses(filters),
//         EnrollmentService.fetchBundles(filters),
//         EnrollmentService.fetchUsers(filters),
//         EnrollmentService.fetchGroups(filters),
//         EnrollmentService.fetchStatistics()
//       ]);
//     console.log("Test111",dashboardResponse)   
      
//       setDashboardData({
//         courses: coursesResponse,
//         bundles: bundlesResponse,
//         users: usersResponse,
//         groups: groupsResponse,
//         statistics: statisticsResponse
//       });
//       console.log("Test11111111111")
//     } catch (error) {
//         console.log("Abhishek 23")
//       message.error('Failed to fetch enrollment data');
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   // Fetch data for enrollment modal
//   const fetchEnrollmentOptions = async () => {
//     try {
//       const [courses, bundles, users, groups] = await Promise.all([
//         EnrollmentService.fetchAvailableCourses(),
//         EnrollmentService.fetchAvailableBundles(),
//         EnrollmentService.fetchAvailableUsers(),
//         EnrollmentService.fetchAvailableGroups()
//       ]);
      
//       setAvailableCourses(courses);
//       setAvailableBundles(bundles);
//       setAvailableUsers(users);
//       setAvailableGroups(groups);
//     } catch (error) {
//       message.error('Failed to fetch enrollment options');
//       console.error('Error fetching enrollment options:', error);
//     }
//   };
  
//   // Fetch data on filter change
//   useEffect(() => {
//     console.log("line no, 1153")
//     fetchDashboardData();
//   }, [viewType, timeRange, status, searchTerm]);
  
//   // Handle filter changes
//   const handleViewTypeChange = (value) => setViewType(value);
//   const handleTimeRangeChange = (value) => setTimeRange(value);
//   const handleStatusChange = (value) => setStatus(value);
//   const handleSearch = (value) => setSearchTerm(value);
  
//   // Handle modal
//   const showModal = () => {
//     fetchEnrollmentOptions(); // Fetch options when modal opens
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   const handleEnrollmentTypeChange = (e) => {
//     setEnrollmentType(e.target.value);
//   };

//   const handleContentTypeChange = (e) => {
//     setContentType(e.target.value);
//   };

//   const handleSubmit = async (values) => {
//     try {
//       // Format enrollment data
//       const enrollmentData = {
//         entityType: values.enrollmentType,
//         entityId: values.entityId,
//         contentType: values.contentType,
//         contentId: values.contentId,
//         deadline: values.deadline.format('YYYY-MM-DD')
//       };
      
//       await EnrollmentService.createEnrollment(enrollmentData);
//       message.success(`New ${values.contentType} enrollment created successfully!`);
//       fetchDashboardData(); // Refresh dashboard data
//       setIsModalVisible(false);
//       form.resetFields();
//     } catch (error) {
//       message.error('Failed to create enrollment');
//       console.error('Error creating enrollment:', error);
//     }
//   };
  
//   // Helper function to render deadline status with color
//   const renderDeadlineStatus = (deadline) => {
//     if (!deadline) return <Tag color="default">No deadline</Tag>;
    
//     const today = new Date();
//     const deadlineDate = new Date(deadline);
//     const daysUntilDeadline = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    
//     if (deadlineDate < today) {
//       return <Tag color="red">Overdue</Tag>;
//     } else if (daysUntilDeadline <= 7) {
//       return <Tag color="orange">Due in {daysUntilDeadline} days</Tag>;
//     } else {
//       return <Tag color="green">{deadline}</Tag>;
//     }
//   };
  
//   // Course table columns with deadline
//   const courseColumns = [
//     {
//       title: 'Course',
//       dataIndex: 'name',
//       key: 'name',
//       render: (text, record) => (
//         <Space>
//           <BookOutlined style={{ color: '#1890ff' }} />
//           <Text strong>{text}</Text>
//           {record.isFeatured && <Tag color="gold">Featured</Tag>}
//         </Space>
//       ),
//     },
//     {
//       title: 'Individual Enrollments',
//       dataIndex: 'individualEnrollments',
//       key: 'individualEnrollments',
//       render: (count) => (
//         <Space>
//           <UserOutlined />
//           <span>{count}</span>
//         </Space>
//       ),
//     },
//     {
//       title: 'Group Enrollments',
//       dataIndex: 'groupEnrollments',
//       key: 'groupEnrollments',
//       render: (count) => (
//         <Space>
//           <TeamOutlined />
//           <span>{count}</span>
//         </Space>
//       ),
//     },
//     {
//       title: 'Total Enrollments',
//       dataIndex: 'totalEnrollments',
//       key: 'totalEnrollments',
//       sorter: (a, b) => a.totalEnrollments - b.totalEnrollments,
//     },
//     {
//       title: 'Completion Rate',
//       dataIndex: 'completionRate',
//       key: 'completionRate',
//       render: (rate) => <Progress percent={rate} size="small" />,
//       sorter: (a, b) => a.completionRate - b.completionRate,
//     },
//     {
//       title: 'Deadline',
//       dataIndex: 'deadline',
//       key: 'deadline',
//       render: (deadline) => renderDeadlineStatus(deadline),
//       sorter: (a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'),
//     },
//     {
//       title: 'Status',
//       key: 'status',
//       dataIndex: 'status',
//       render: (status) => {
//         let color = status === 'active' ? 'green' : 'default';
//         return <Tag color={color}>{status.toUpperCase()}</Tag>;
//       },
//       filters: [
//         { text: 'Active', value: 'active' },
//         { text: 'Inactive', value: 'inactive' },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <Button type="link" size="small" onClick={() => viewEntityDetails('course', record.id)}>View Details</Button>
//       ),
//     },
//   ];
  
//   // Bundle table columns with deadline
//   const bundleColumns = [
//     {
//       title: 'Bundle',
//       dataIndex: 'name',
//       key: 'name',
//       render: (text, record) => (
//         <Space>
//           <AppstoreOutlined style={{ color: '#722ed1' }} />
//           <Text strong>{text}</Text>
//           <Tag color="purple">{record.courseCount} Courses</Tag>
//         </Space>
//       ),
//     },
//     {
//       title: 'Individual Enrollments',
//       dataIndex: 'individualEnrollments',
//       key: 'individualEnrollments',
//       render: (count) => (
//         <Space>
//           <UserOutlined />
//           <span>{count}</span>
//         </Space>
//       ),
//     },
//     {
//       title: 'Group Enrollments',
//       dataIndex: 'groupEnrollments',
//       key: 'groupEnrollments',
//       render: (count) => (
//         <Space>
//           <TeamOutlined />
//           <span>{count}</span>
//         </Space>
//       ),
//     },
//     {
//       title: 'Total Enrollments',
//       dataIndex: 'totalEnrollments',
//       key: 'totalEnrollments',
//       sorter: (a, b) => a.totalEnrollments - b.totalEnrollments,
//     },
//     {
//       title: 'Avg. Completion',
//       dataIndex: 'avgCompletion',
//       key: 'avgCompletion',
//       render: (rate) => <Progress percent={rate} size="small" />,
//       sorter: (a, b) => a.avgCompletion - b.avgCompletion,
//     },
//     {
//       title: 'Deadline',
//       dataIndex: 'deadline',
//       key: 'deadline',
//       render: (deadline) => renderDeadlineStatus(deadline),
//       sorter: (a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'),
//     },
//     {
//       title: 'Status',
//       key: 'status',
//       dataIndex: 'status',
//       render: (status) => {
//         let color = status === 'active' ? 'green' : 'default';
//         return <Tag color={color}>{status.toUpperCase()}</Tag>;
//       },
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <Button type="link" size="small" onClick={() => viewEntityDetails('bundle', record.id)}>View Details</Button>
//       ),
//     },
//   ];
  
//   // User/Group enrollment columns with deadline
//   const enrollmentColumns = [
//     { 
//       title: 'Name', 
//       dataIndex: 'name', 
//       key: 'name' 
//     },
//     { 
//       title: 'Progress', 
//       dataIndex: 'progress', 
//       key: 'progress', 
//       render: (progress) => <Progress percent={progress} size="small" /> 
//     },
//     { 
//       title: 'Enrollment Date', 
//       dataIndex: 'enrollmentDate', 
//       key: 'enrollmentDate' 
//     },
//     {
//       title: 'Deadline',
//       dataIndex: 'deadline',
//       key: 'deadline',
//       render: (deadline) => renderDeadlineStatus(deadline)
//     }
//   ];
  
//   // User/Group table columns
//   const entityColumns = [
//     {
//       title: viewType === 'users' ? 'User' : 'Group',
//       dataIndex: 'name',
//       key: 'name',
//       render: (text, record) => (
//         <Space>
//           {viewType === 'users' ? <UserOutlined /> : <TeamOutlined />}
//           <Text strong>{text}</Text>
//           {viewType === 'groups' && <Tag color="blue">{record.memberCount} Members</Tag>}
//         </Space>
//       ),
//     },
//     {
//       title: 'Course Enrollments',
//       dataIndex: 'courseEnrollments',
//       key: 'courseEnrollments',
//       render: (courses) => <Tag color="blue">{Array.isArray(courses) ? courses.length : 0}</Tag>,
//     },
//     {
//       title: 'Bundle Enrollments',
//       dataIndex: 'bundleEnrollments',
//       key: 'bundleEnrollments',
//       render: (bundles) => <Tag color="purple">{Array.isArray(bundles) ? bundles.length : 0}</Tag>,
//     },
//     {
//       title: 'Total Courses',
//       dataIndex: 'totalCourses',
//       key: 'totalCourses',
//     },
//     {
//       title: 'Average Completion',
//       dataIndex: 'avgCompletion',
//       key: 'avgCompletion',
//       render: (rate) => <Progress percent={rate} size="small" />,
//       sorter: (a, b) => a.avgCompletion - b.avgCompletion,
//     },
//     {
//       title: 'Upcoming Deadlines',
//       dataIndex: 'upcomingDeadlines',
//       key: 'upcomingDeadlines',
//       render: (count) => count > 0 ? <Badge count={count} style={{ backgroundColor: count > 2 ? '#f5222d' : '#faad14' }} /> : '0',
//     },
//     {
//       title: 'Status',
//       key: 'status',
//       dataIndex: 'status',
//       render: (status) => {
//         let color = status === 'active' ? 'green' : 'default';
//         return <Tag color={color}>{status.toUpperCase()}</Tag>;
//       },
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <Button type="link" size="small" onClick={() => viewEntityDetails(viewType === 'users' ? 'user' : 'group', record.id)}>View Details</Button>
//       ),
//     },
//   ];
  
//   // View details handler
//   const viewEntityDetails = (type, id) => {
//     message.info(`Viewing details for ${type} ID: ${id}`);
//     // Implementation for viewing details would go here
//     // Could navigate to a detail page or open a modal with more info
//   };
  
//   // Function to handle expanded row rendering for courses and bundles
//   const expandCourseRow = async (record) => {
//     try {
//       const entityType = viewType === 'users' ? 'user' : 'group';
//       const enrolledEntities = await EnrollmentService.fetchEnrolledEntities('course', record.id, entityType);
      
//       return (
//         <div style={{ margin: 0 }}>
//           <Text strong>Enrolled {viewType === 'users' ? 'Users' : 'Groups'}:</Text>
//           <Table 
//             columns={enrollmentColumns} 
//             dataSource={enrolledEntities}
//             pagination={false}
//             size="small"
//           />
//         </div>
//       );
//     } catch (error) {
//       console.error('Error fetching enrolled entities:', error);
//       return <Alert message="Failed to load enrolled entities" type="error" />;
//     }
//   };
  
//   // Function to handle expanded row rendering for bundles
//   const expandBundleRow = async (record) => {
//     try {
//       const bundleDetails = await EnrollmentService.fetchEntityDetails('bundle', record.id);
      
//       return (
//         <div style={{ margin: 0 }}>
//           <Text strong>Courses in Bundle:</Text>
//           <Table 
//             columns={[
//               { title: 'Course Name', dataIndex: 'name', key: 'name' },
//               { title: 'Enrollments', dataIndex: 'enrollments', key: 'enrollments' },
//               { 
//                 title: 'Deadline', 
//                 dataIndex: 'deadline', 
//                 key: 'deadline',
//                 render: (deadline) => renderDeadlineStatus(deadline)
//               }
//             ]} 
//             dataSource={bundleDetails.courses}
//             pagination={false}
//             size="small"
//           />
//         </div>
//       );
//     } catch (error) {
//       console.error('Error fetching bundle details:', error);
//       return <Alert message="Failed to load bundle details" type="error" />;
//     }
//   };
  
//   // Function to handle expanded row rendering for users/groups
//   const expandEntityRow = async (record) => {
//     try {
//       const entityType = viewType === 'users' ? 'user' : 'group';
//       const entityDetails = await EnrollmentService.fetchEntityDetails(entityType, record.id);
      
//       return (
//         <div style={{ margin: 0 }}>
//           <Tabs defaultActiveKey="enrolled-courses">
//             <TabPane tab="Enrolled Courses" key="enrolled-courses">
//               <Table 
//                 columns={enrollmentColumns}
//                 dataSource={entityDetails.courseEnrollments}
//                 pagination={false}
//                 size="small"
//               />
//             </TabPane>
//             <TabPane tab="Enrolled Bundles" key="enrolled-bundles">
//               <Table 
//                 columns={enrollmentColumns}
//                 dataSource={entityDetails.bundleEnrollments}
//                 pagination={false}
//                 size="small"
//               />
//             </TabPane>
//           </Tabs>
//         </div>
//       );
//     } catch (error) {
//       console.error('Error fetching entity details:', error);
//       return <Alert message="Failed to load enrolled content" type="error" />;
//     }
//   };
  
//   return (
//     <div className="admin-section">
//       <Layout style={{ minHeight: '100vh' }}>
//         <Header style={{ background: '#fff', padding: '0 20px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Title level={3} style={{ margin: '16px 0' }}>
//               Enrollment Dashboard
//             </Title>
//             <Space>
//               <Button 
//                 type="primary" 
//                 icon={<PlusOutlined />} 
//                 onClick={showModal}
//               >
//                 Add Enrollment
//               </Button>
//               <Select
//                 defaultValue="users"
//                 style={{ width: 120 }}
//                 onChange={handleViewTypeChange}
//                 value={viewType}
//               >
//                 <Option value="users">Users</Option>
//                 <Option value="groups">Groups</Option>
//               </Select>
//               <Select
//                 defaultValue="30days"
//                 style={{ width: 140 }}
//                 onChange={handleTimeRangeChange}
//                 value={timeRange}
//               >
//                 <Option value="7days">Last 7 days</Option>
//                 <Option value="30days">Last 30 days</Option>
//                 <Option value="quarter">Last quarter</Option>
//                 <Option value="custom">Custom range</Option>
//               </Select>
//               <Select
//                 defaultValue="all"
//                 style={{ width: 120 }}
//                 onChange={handleStatusChange}
//                 value={status}
//               >
//                 <Option value="all">All Status</Option>
//                 <Option value="active">Active</Option>
//                 <Option value="completed">Completed</Option>
//                 <Option value="inactive">Inactive</Option>
//               </Select>
//               <Input
//                 placeholder="Search"
//                 prefix={<SearchOutlined />}
//                 style={{ width: 200 }}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 value={searchTerm}
//               />
//             </Space>
//           </div>
//         </Header>
        
//         <Content style={{ margin: '16px' }}>
//           {isLoading ? (
//             <div style={{ textAlign: 'center', margin: '50px 0' }}>
//               <Spin size="large" />
//             </div>
//           ) : (
//             <>
//               {/* UPDATED STATS SECTION WITH DEADLINES */}
//               <Row gutter={16} style={{ marginBottom: 16 }}>
//                 <Col span={6}>
//                   <Card>
//                     <Statistic 
//                       title="Total Enrollments"
//                       value={dashboardData.statistics.totalEnrollments}
//                       prefix={<BookOutlined />}
//                     />
//                   </Card>
//                 </Col>
//                 <Col span={6}>
//                   <Card>
//                     <Statistic 
//                       title="Users Enrolled"
//                       value={dashboardData.statistics.usersEnrolled}
//                       prefix={<UserOutlined />}
//                     />
//                   </Card>
//                 </Col>
//                 <Col span={6}>
//                   <Card>
//                     <Statistic 
//                       title="Groups Enrolled"
//                       value={dashboardData.statistics.groupsEnrolled}
//                       prefix={<TeamOutlined />}
//                     />
//                   </Card>
//                 </Col>
//                 <Col span={6}>
//                   <Card>
//                     <Statistic 
//                       title="Overall Completion Rate"
//                       value={dashboardData.statistics.completionRate}
//                       prefix={<RiseOutlined />}
//                       valueStyle={{ color: '#3f8600' }}
//                     />
//                   </Card>
//                 </Col>
//               </Row>
              
//               {/* Second row with Top Course and Upcoming Deadlines */}
//               <Row gutter={16} style={{ marginBottom: 16 }}>
//                 <Col span={8}>
//                   <Card>
//                     <Statistic 
//                       title="Top Enrolled Course"
//                       value={dashboardData.statistics.topCourse}
//                       prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
//                     />
//                   </Card>
//                 </Col>
//                 <Col span={8}>
//                   <Card>
//                     <Statistic 
//                       title="Course Completions"
//                       value={dashboardData.statistics.courseCompletions}
//                       prefix={<BarChartOutlined />}
//                       valueStyle={{ color: '#3f8600' }}
//                     />
//                   </Card>
//                 </Col>
//                 <Col span={8}>
//                   <Card>
//                     <Statistic 
//                       title="Upcoming Deadlines (7 days)"
//                       value={dashboardData.statistics.upcomingDeadlines}
//                       prefix={<ClockCircleOutlined style={{ color: '#fa541c' }} />}
//                       valueStyle={{ 
//                         color: dashboardData.statistics.upcomingDeadlines > 3 ? '#cf1322' : '#fa8c16' 
//                       }}
//                     />
//                   </Card>
//                 </Col>
//               </Row>
              
//               <Card>
//                 <Tabs defaultActiveKey="1">
//                   <TabPane tab="Overview" key="1">
//                     <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                       <Text type="secondary">Charts and visualizations would appear here</Text>
//                     </div>
//                   </TabPane>
                  
//                   <TabPane tab="Courses" key="2">
//                     <Table 
//                       columns={courseColumns} 
//                       dataSource={dashboardData.courses}
//                       rowKey="id"
//                       expandable={{
//                         expandedRowRender: expandCourseRow,
//                       }}
//                     />
//                   </TabPane>
                  
//                   <TabPane tab="Bundles" key="3">
//                     <Table 
//                       columns={bundleColumns} 
//                       dataSource={dashboardData.bundles}
//                       rowKey="id"
//                       expandable={{
//                         expandedRowRender: expandBundleRow,
//                       }}
//                     />
//                   </TabPane>
                  
//                   <TabPane tab={viewType === 'users' ? 'Users' : 'Groups'} key="4">
//                     <Table 
//                       columns={entityColumns} 
//                       dataSource={viewType === 'users' ? dashboardData.users : dashboardData.groups}
//                       rowKey="id"
//                       expandable={{
//                         expandedRowRender: expandEntityRow,
//                       }}
//                     />
//                   </TabPane>
//                 </Tabs>
//               </Card>
//             </>
//           )}
//         </Content>
//       </Layout>

//       {/* Add Enrollment Modal */}
//       <Modal
//         title="Add New Enrollment"
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//         destroyOnClose={true}
//       >
//         <Form 
//           form={form} 
//           layout="vertical" 
//           onFinish={handleSubmit}
//           initialValues={{ enrollmentType: 'user', contentType: 'course' }}
//         >
//           {/* Enrollment Type Selection */}
//           <Form.Item
//             name="enrollmentType"
//             label="Enrollment Type"
//             rules={[{ required: true, message: 'Please select an enrollment type!' }]}
//           >
//             <Radio.Group onChange={handleEnrollmentTypeChange} value={enrollmentType}>
//               <Radio value="user">User</Radio>
//               <Radio value="group">Group</Radio>
//             </Radio.Group>
//           </Form.Item>
          
//           {/* User/Group Selection */}
//           <Form.Item
//             name="entityId"
//             label={enrollmentType === 'user' ? 'Select User' : 'Select Group'}
//             rules={[{ required: true, message: `Please select a ${enrollmentType}!` }]}
//           >
//             <Select placeholder={`Select a ${enrollmentType}`}>
//               {enrollmentType === 'user' ? 
//                 availableUsers.map(user => (
//                   <Option key={user.id} value={user.id}>{user.name}</Option>
//                 )) : 
//                 availableGroups.map(group => (
//                   <Option key={group.id} value={group.id}>{group.name}</Option>
//                 ))
//               }
//             </Select>
//           </Form.Item>
          
//           {/* Content Type Selection */}
//           <Form.Item
//             name="contentType"
//             label="Content Type"
//             rules={[{ required: true, message: 'Please select a content type!' }]}
//           >
//             <Radio.Group onChange={handleContentTypeChange} value={contentType}>
//               <Radio value="course">Course</Radio>
//               <Radio value="bundle">Bundle</Radio>
//             </Radio.Group>
//           </Form.Item>
          
//           {/* Course/Bundle Selection */}
//           <Form.Item
//             name="contentId"
//             label={contentType === 'course' ? 'Select Course' : 'Select Bundle'}
//             rules={[{ required: true, message: `Please select a ${contentType}!` }]}
//           >
//             <Select placeholder={`Select a ${contentType}`}>
//               {contentType === 'course' ? 
//                 availableCourses.map(course => (
//                   <Option key={course.id} value={course.id}>{course.name}</Option>
//                 )) : 
//                 availableBundles.map(bundle => (
//                   <Option key={bundle.id} value={bundle.id}>{bundle.name}</Option>
//                 ))
//               }
//             </Select>
//           </Form.Item>
          
//           {/* Deadline Selection */}
//           <Form.Item
//             name="deadline"
//             label="Deadline"
//             rules={[{ required: true, message: 'Please select a deadline!' }]}
//           >
//             <DatePicker style={{ width: '100%' }} />
//           </Form.Item>
          
//           {/* Submit Button */}
//           <Form.Item>
//             <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
//               Create Enrollment
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default EnrollmentDashboard;