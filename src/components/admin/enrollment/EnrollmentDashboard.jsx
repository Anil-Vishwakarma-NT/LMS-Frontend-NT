import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Table,
  Select,
  Input,
  Space,
  Statistic,
  Progress,
  Tag,
  Tabs,
  DatePicker,
  message,
  Spin,
  Empty,
  Typography,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  SearchOutlined,
  FilterOutlined,
  ExpandAltOutlined,
  ContainerOutlined
} from '@ant-design/icons';

import { Layout } from 'antd';
import enrollmentService from './enrollmentService';
import AdminHOC from '../../shared/HOC/AdminHOC';
import AddEnrollmentModal from './AddEnrollmentModal';

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const EnrollmentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [coursesLoading, setCourseLoading] = useState(false);
  const [bundlesLoading, setBundlesLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Main data states
  const [statistics, setStatistics] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [employees, setEmployees] = useState([]);

  
  // Filter states
  const [viewType, setViewType] = useState('users'); // 'users' or 'groups'
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    fetchEnrollmentData();
  }, [viewType]);

  const initializeData = async () => {
    await Promise.all([
      fetchStatistics(),
      fetchCourses(),
      fetchBundles(),
      fetchEmployees(),
      fetchEnrollmentData()
    ]);
  };

  const fetchEmployees = async () => {
  try {
    const response = await enrollmentService.getAllEmployees();
    
    if (enrollmentService.isSuccess(response)) {
      const employeesData = enrollmentService.extractData(response) || [];
      console.log('Employees Data:', employeesData);
      setEmployees(employeesData);
    } else {
      console.warn('Failed to fetch employees:', enrollmentService.getMessage(response));
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};

  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);
      const response = await enrollmentService.getEnrollmentStatistics();
      
      if (enrollmentService.isSuccess(response)) {
        setStatistics(enrollmentService.extractData(response));
      } else {
        message.error(enrollmentService.getMessage(response) || 'Failed to fetch statistics');
      }
    } catch (error) {
      const errorMessage = enrollmentService.formatErrorMessage(error);
      message.error(errorMessage);
      console.error('Error fetching statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchEnrollmentData = async () => {
    try {
      setLoading(true);
      let response;
      
      if (viewType === 'users') {
        response = await enrollmentService.getAllUserEnrollments();
      } else {
        // For groups - you might need to implement a separate API endpoint
        // For now, we'll use empty data
        response = { status: 'SUCCESS', data: [] };
      }
      
      if (enrollmentService.isSuccess(response)) {
        const data = enrollmentService.extractData(response) || [];
        setEnrollmentData(data);
        setFilteredData(data);
      } else {
        message.error(enrollmentService.getMessage(response) || 'Failed to fetch enrollment data');
      }
    } catch (error) {
      const errorMessage = enrollmentService.formatErrorMessage(error);
      message.error(errorMessage);
      console.error('Error fetching enrollment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setCourseLoading(true);
      const response = await enrollmentService.getAllCourses();
      
      if (enrollmentService.isSuccess(response)) {
        const coursesData = enrollmentService.extractData(response) || [];
        console.log('Courses Data:', coursesData);
        setCourses(enrollmentService.filterActiveCourses(coursesData));
      } else {
        console.warn('Failed to fetch courses:', enrollmentService.getMessage(response));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setCourseLoading(false);
    }
  };

  const fetchBundles = async () => {
    try {
      setBundlesLoading(true);
      const response = await enrollmentService.getAllBundles();
      
      if (enrollmentService.isSuccess(response)) {
        const bundlesData = enrollmentService.extractData(response) || [];
        setBundles(enrollmentService.filterActiveBundles(bundlesData));
      } else {
        console.warn('Failed to fetch bundles:', enrollmentService.getMessage(response));
      }
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setBundlesLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    filterData(value, selectedUser, selectedCourse, selectedBundle, dateRange);
  };

const filterData = (search, user, course, bundle, dates) => {
  let filtered = [...enrollmentData];

  // Filter by search text (username or full name)
  if (search) {
    filtered = filtered.filter(item => {
      const employee = employees.find(emp => emp.userId === item.userId);
      const fullName = employee ? `${employee.firstName} ${employee.lastName}` : '';
      const username = employee ? employee.username : '';
      
      return item.userName?.toLowerCase().includes(search.toLowerCase()) ||
             fullName.toLowerCase().includes(search.toLowerCase()) ||
             username.toLowerCase().includes(search.toLowerCase());
    });
  }

  // Filter by specific user
  if (user) {
    filtered = filtered.filter(item => item.userId === user);
  }

  // Filter by course - check if user is enrolled in specific course
  if (course) {
    filtered = filtered.filter(item => {
      const hasCourse = item.enrolledCoursesList?.some(c => c.courseId === course);
      const hasCourseInBundle = item.enrolledBundlesList?.some(bundle => 
        bundle.enrolledCoursesList?.some(c => c.courseId === course)
      );
      return hasCourse || hasCourseInBundle;
    });
  }

  // Filter by bundle - check if user is enrolled in specific bundle
  if (bundle) {
    filtered = filtered.filter(item => 
      item.enrolledBundlesList?.some(b => b.bundleId === bundle)
    );
  }

  // Filter by date range - check enrollment dates
  if (dates && dates.length === 2) {
    const [startDate, endDate] = dates;
    filtered = filtered.filter(item => {
      const hasEnrollmentInRange = item.enrolledCoursesList?.some(course => {
        const enrollmentDate = new Date(course.enrollmentDate);
        return enrollmentDate >= startDate && enrollmentDate <= endDate;
      }) || item.enrolledBundlesList?.some(bundle => {
        const enrollmentDate = new Date(bundle.enrollmentDate);
        return enrollmentDate >= startDate && enrollmentDate <= endDate;
      });
      return hasEnrollmentInRange;
    });
  }

  setFilteredData(filtered);
};

const handleFilterChange = (filterType, value) => {
  switch (filterType) {
    case 'user':
      setSelectedUser(value);
      filterData(searchText, value, selectedCourse, selectedBundle, dateRange);
      break;
    case 'course':
      setSelectedCourse(value);
      filterData(searchText, selectedUser, value, selectedBundle, dateRange);
      break;
    case 'bundle':
      setSelectedBundle(value);
      filterData(searchText, selectedUser, selectedCourse, value, dateRange);
      break;
    case 'date':
      setDateRange(value);
      filterData(searchText, selectedUser, selectedCourse, selectedBundle, value);
      break;
  }
};

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'processing',
      'COMPLETED': 'success',
      'PENDING': 'warning',
      'EXPIRED': 'error',
      'IN_PROGRESS': 'processing'
    };
    return colors[status] || 'default';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#52c41a';
    if (progress >= 50) return '#faad14';
    return '#ff4d4f';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDateOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const expandedRowRender = (record) => {
    const courseColumns = [
      {
        title: 'Course Name',
        dataIndex: 'courseName',
        key: 'courseName',
        render: (text) => (
          <Space>
            <BookOutlined />
            <Text strong>{text}</Text>
          </Space>
        ),
      },
      {
        title: 'Progress',
        dataIndex: 'progress',
        key: 'progress',
        render: (progress) => (
          <Progress
            percent={progress}
            size="small"
            strokeColor={getProgressColor(progress)}
            format={(percent) => `${percent?.toFixed(1)}%`}
          />
        ),
      },
      {
        title: 'Enrollment Date',
        dataIndex: 'enrollmentDate',
        key: 'enrollmentDate',
        render: (date) => formatDate(date),
      },
      {
        title: 'Deadline',
        dataIndex: 'deadline',
        key: 'deadline',
        render: (date) => (
          <Text type={isDateOverdue(date) ? 'danger' : 'default'}>
            {formatDate(date)}
            {isDateOverdue(date) && (
              <Tooltip title="Overdue">
                <ClockCircleOutlined style={{ color: '#ff4d4f', marginLeft: 4 }} />
              </Tooltip>
            )}
          </Text>
        ),
      },
    ];

    const bundleColumns = [
      {
        title: 'Bundle Name',
        dataIndex: 'bundleName',
        key: 'bundleName',
        render: (text) => (
          <Space>
            <ContainerOutlined />
            <Text strong>{text}</Text>
          </Space>
        ),
      },
      {
        title: 'Progress',
        dataIndex: 'progress',
        key: 'progress',
        render: (progress) => (
          <Progress
            percent={progress}
            size="small"
            strokeColor={getProgressColor(progress)}
            format={(percent) => `${percent?.toFixed(1)}%`}
          />
        ),
      },
      {
        title: 'Enrollment Date',
        dataIndex: 'enrollmentDate',
        key: 'enrollmentDate',
        render: (date) => formatDate(date),
      },
      {
        title: 'Deadline',
        dataIndex: 'deadline',
        key: 'deadline',
        render: (date) => (
          <Text type={isDateOverdue(date) ? 'danger' : 'default'}>
            {formatDate(date)}
            {isDateOverdue(date) && (
              <Tooltip title="Overdue">
                <ClockCircleOutlined style={{ color: '#ff4d4f', marginLeft: 4 }} />
              </Tooltip>
            )}
          </Text>
        ),
      },
    ];

    const tabItems = [
      {
        key: 'courses',
        label: `Individual Courses (${record.enrolledCoursesList?.length || 0})`,
        children: (
          <Table
            columns={courseColumns}
            dataSource={record.enrolledCoursesList || []}
            pagination={false}
            size="small"
            rowKey="courseId"
            locale={{
              emptyText: <Empty description="No individual course enrollments" size="small" />
            }}
          />
        ),
      },
      {
        key: 'bundles',
        label: `Bundles (${record.enrolledBundlesList?.length || 0})`,
        children: (
          <Table
            columns={bundleColumns}
            dataSource={record.enrolledBundlesList || []}
            pagination={false}
            size="small"
            rowKey="bundleId"
            expandable={{
              expandedRowRender: (bundleRecord) => (
                <div style={{ marginLeft: 24 }}>
                  <Text strong>Courses in this bundle:</Text>
                  <Table
                    columns={courseColumns}
                    dataSource={bundleRecord.enrolledCoursesList || []}
                    pagination={false}
                    size="small"
                    rowKey="courseId"
                    showHeader={false}
                  />
                </div>
              ),
              rowExpandable: (bundleRecord) => bundleRecord.enrolledCoursesList?.length > 0,
            }}
            locale={{
              emptyText: <Empty description="No bundle enrollments" size="small" />
            }}
          />
        ),
      },
    ];

    return <Tabs items={tabItems} size="small" />;
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          <div>
            <div><Text strong>{text}</Text></div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ID: {record.userId}
            </Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: 'Individual Courses',
      dataIndex: 'courseEnrollments',
      key: 'courseEnrollments',
      render: (count) => (
        <Tag icon={<BookOutlined />} color="blue">
          {count || 0}
        </Tag>
      ),
      sorter: (a, b) => (a.courseEnrollments || 0) - (b.courseEnrollments || 0),
    },
    {
      title: 'Bundle Enrollments',
      dataIndex: 'bundleEnrollments',
      key: 'bundleEnrollments',
      render: (count) => (
        <Tag icon={<ContainerOutlined />} color="purple">
          {count || 0}
        </Tag>
      ),
      sorter: (a, b) => (a.bundleEnrollments || 0) - (b.bundleEnrollments || 0),
    },
    {
      title: 'Total Courses',
      dataIndex: 'totalCourses',
      key: 'totalCourses',
      render: (count) => <Text strong>{count || 0}</Text>,
      sorter: (a, b) => (a.totalCourses || 0) - (b.totalCourses || 0),
    },
    {
      title: 'Avg Completion',
      dataIndex: 'averageCompletion',
      key: 'averageCompletion',
      render: (progress) => (
        <Progress
          percent={progress || 0}
          size="small"
          strokeColor={getProgressColor(progress)}
          format={(percent) => `${percent?.toFixed(1)}%`}
        />
      ),
      sorter: (a, b) => (a.averageCompletion || 0) - (b.averageCompletion || 0),
    },
    {
      title: 'Upcoming Deadlines',
      dataIndex: 'upcomingDeadlines',
      key: 'upcomingDeadlines',
      render: (count) => (
        <Tag 
          icon={<ClockCircleOutlined />} 
          color={count > 5 ? 'red' : count > 2 ? 'orange' : 'green'}
        >
          {count || 0}
        </Tag>
      ),
      sorter: (a, b) => (a.upcomingDeadlines || 0) - (b.upcomingDeadlines || 0),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'success' : 'error'}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  const StatCard = ({ title, value, icon, color, suffix = '', loading = false }) => (
    <Card>
      <Statistic
        title={title}
        value={value || 0}
        prefix={React.cloneElement(icon, { style: { color } })}
        suffix={suffix}
        loading={loading}
      />
    </Card>
  );

return (
  <div className="admin-section" style={{ 
    padding: '20px', 
    background: '#f5f5f5', 
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
    marginTop: '54px'
  }}>
    <Content style={{ 
      margin: '0 16px', 
      maxWidth: '100%',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={16}>
          <Title level={2} style={{ margin: 0, fontSize: '1.5rem' }}>
            <BarChartOutlined /> Enrollment Dashboard
          </Title>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Select
              style={{ minWidth: 100, width: '100%', maxWidth: 120 }}
              value={viewType}
              onChange={setViewType}
            >
              <Option value="users">Users</Option>
              <Option value="groups">Groups</Option>
            </Select>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              style={{ minWidth: 'auto' }}
              onClick={() => setShowAddModal(true)}
>
  <span className="btn-text">Add Enrollment</span>
</Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Total Enrollments"
            value={statistics?.totalEnrollments}
            icon={<UserOutlined />}
            color="#1890ff"
            loading={statsLoading}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Users Enrolled"
            value={statistics?.totalUniqueUsers}
            icon={<TeamOutlined />}
            color="#52c41a"
            loading={statsLoading}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Courses"
            value={statistics?.totalUniqueCourses}
            icon={<BookOutlined />}
            color="#faad14"
            loading={statsLoading}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <StatCard
            title="Completion Rate"
            value={statistics?.overallCompletionRate}
            icon={<TrophyOutlined />}
            color="#722ed1"
            suffix="%"
            loading={statsLoading}
          />
        </Col>
      </Row>

      {/* Secondary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={24} md={8}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Recent Enrollments (7 days)"
              value={statistics?.recentEnrollments}
              prefix={<ClockCircleOutlined style={{ color: '#13c2c2' }} />}
              loading={statsLoading}
            />
            <div style={{ marginTop: '12px' }}>
              <Progress
                percent={statistics?.totalEnrollments ? 
                  ((statistics?.recentEnrollments || 0) / statistics.totalEnrollments) * 100 : 0}
                size="small"
                strokeColor="#13c2c2"
                showInfo={false}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Recent activity trend
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Completed"
              value={statistics?.completedEnrollments}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              loading={statsLoading}
            />
            <div style={{ marginTop: '12px' }}>
              <Progress
                percent={statistics?.totalEnrollments ? 
                  ((statistics?.completedEnrollments || 0) / statistics.totalEnrollments) * 100 : 0}
                size="small"
                strokeColor="#52c41a"
                showInfo={false}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Completion progress
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Bundles"
              value={statistics?.totalUniqueBundles}
              prefix={<ContainerOutlined style={{ color: '#eb2f96' }} />}
              loading={statsLoading}
            />
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Bundle-based learning
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card style={{ position: 'relative', zIndex: 1 }}>
        <Row gutter={[8, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={24} md={24} lg={6}>
            <Search
              placeholder={`Search ${viewType === 'users' ? 'users' : 'groups'}...`}
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={12} lg={4}>
            <Select
              placeholder="Filter by User"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('user', value)}
              disabled={viewType !== 'users'}
              loading={loading}
              showSearch
              dropdownStyle={{ zIndex: 1050 }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {employees.map(employee => (
                <Option key={employee.userId} value={employee.userId}>
                  {`${employee.firstName} ${employee.lastName} - ${employee.username}`}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={4}>
            <Select
              placeholder="Filter by Course"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('course', value)}
              loading={coursesLoading}
              showSearch
              dropdownStyle={{ zIndex: 1050 }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {courses.map(course => (
                <Option key={course.courseId} value={course.courseId}>
                  {course.title}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={4}>
            <Select
              placeholder="Filter by Bundle"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => handleFilterChange('bundle', value)}
              loading={bundlesLoading}
              showSearch
              dropdownStyle={{ zIndex: 1050 }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {bundles.map(bundle => (
                <Option key={bundle.bundleId} value={bundle.bundleId}>
                  {bundle.bundleName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => handleFilterChange('date', dates)}
              placeholder={['Start Date', 'End Date']}
              dropdownClassName="custom-date-picker"
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            />
          </Col>
        </Row>

        <div style={{ overflowX: 'auto', position: 'relative', zIndex: 1 }}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="userId"
            loading={loading}
            scroll={{ x: 'max-content' }}
            expandable={{
              expandedRowRender,
              expandIcon: ({ expanded, onExpand, record }) => (
                <Button
                  type="text"
                  size="small"
                  icon={<ExpandAltOutlined />}
                  onClick={(e) => onExpand(record, e)}
                  style={{
                    transform: expanded ? 'rotate(45deg)' : 'none',
                    transition: 'transform 0.2s',
                    zIndex: 1
                  }}
                />
              ),
            }}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} ${viewType}`,
              responsive: true,
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={`No ${viewType} enrollments found`}
                />
              ),
            }}
          />
        </div>
      </Card>
    </Content>
    <AddEnrollmentModal
  visible={showAddModal}
  onCancel={() => setShowAddModal(false)}
  onSuccess={() => {
    setShowAddModal(false);
    // Refresh the dashboard data
    initializeData();
    message.success('Enrollment added successfully!');
  }}
/>
  </div>
);
};

export default AdminHOC(EnrollmentDashboard);