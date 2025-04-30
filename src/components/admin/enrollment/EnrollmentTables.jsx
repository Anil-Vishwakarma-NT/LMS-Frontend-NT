import React from 'react';
import {
  Space,
  Table,
  Typography,
  Tag,
  Progress,
  Button,
  Badge,
  Tabs
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Text } = Typography;
const { TabPane } = Tabs;

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

// Course table columns
export const getCourseColumns = (onViewDetails) => [
  {
    title: 'Course',
    dataIndex: 'courseName',
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
    dataIndex: 'active',
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
      <Button type="link" size="small" onClick={() => onViewDetails('course', record.courseId)}>View Details</Button>
    ),
  },
];

// Bundle table columns
export const getBundleColumns = (onViewDetails) => [
  {
    title: 'Bundle',
    dataIndex: 'bundleName',
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
      <Button type="link" size="small" onClick={() => onViewDetails('bundle', record.bundleId)}>View Details</Button>
    ),
  },
];

// User enrollment columns for expanded rows
export const userEnrollmentColumns = [
  { 
    title: 'Name', 
    dataIndex: 'userName',
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
export const getEntityColumns = (viewType, onViewDetails) => [
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
      <Button type="link" size="small" onClick={() => onViewDetails(viewType === 'users' ? 'user' : 'group', record.entityId)}>View Details</Button>
    ),
  },
];

// Expanded row renderers
export const expandCourseRow = (record) => {
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

export const expandBundleRow = (record) => {
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

export const expandEntityRow = (record) => {
  return (
    <div style={{ margin: 0 }}>
      <Tabs defaultActiveKey="enrolled-courses">
        <TabPane tab="Enrolled Courses" key="enrolled-courses">
          <Table 
            columns={[
              { title: 'Name', dataIndex: 'courseName', key: 'courseName' },
              { title: 'Progress', dataIndex: 'progress', key: 'progress', render: (progress) => <Progress percent={progress || 0} size="small" /> },
              { title: 'Enrollment Date', dataIndex: 'enrollmentDate', key: 'enrollmentDate' },
              { title: 'Deadline', dataIndex: 'deadline', key: 'deadline', render: (deadline) => renderDeadlineStatus(deadline) }
            ]}
            dataSource={record.enrolledCoursesList || []}
            pagination={false}
            size="small"
            rowKey="courseId"
          />
        </TabPane>
        <TabPane tab="Enrolled Bundles" key="enrolled-bundles">
          <Table 
            columns={[
              { title: 'Name', dataIndex: 'bundleName', key: 'bundleName' },
              { title: 'Progress', dataIndex: 'progress', key: 'progress', render: (progress) => <Progress percent={progress || 0} size="small" /> },
              { title: 'Enrollment Date', dataIndex: 'enrollmentDate', key: 'enrollmentDate' },
              { title: 'Deadline', dataIndex: 'deadline', key: 'deadline', render: (deadline) => renderDeadlineStatus(deadline) }
            ]}
            dataSource={record.enrolledBundlesList || []}
            pagination={false}
            size="small"
            rowKey="bundleId"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};