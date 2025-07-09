import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tabs, Table, Button, Space, Tag, Avatar, Typography, Badge } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  AppstoreOutlined,
  TeamOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const RecentDataTabs = ({
  recentUserList,
  recentCourseList,
  recentBundleList,
  // recentGroupList
}) => {
  const navigate = useNavigate();

  // Navigation handlers
  const handleViewUserDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleViewCourseDetails = (courseId) => {
    navigate(`/admin/courses/${courseId}`);
  };

  const handleViewBundleDetails = (bundleId) => {
    navigate(`/admin/bundles/${bundleId}`);
  };

  // const handleViewGroupDetails = (groupId) => {
  //   navigate(`/admin/groups/${groupId}`);
  // };

  // Table column definitions
  const usersColumns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name) => (
        <Space>
          <Avatar style={{ backgroundColor: '#87d068' }}>
            {name?.charAt(0)}
          </Avatar>
          {name}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        let color = 'blue';
        if (role?.toLowerCase() === 'admin') color = 'red';
        if (role?.toLowerCase() === 'manager') color = 'green';
        return <Tag color={color}>{role?.charAt(0).toUpperCase() + role?.slice(1)}</Tag>;
      },
    },
    {
      title: 'Manager',
      dataIndex: 'managerName',
      key: 'managerName',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {new Date(date).toLocaleString()}
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewUserDetails(record.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const coursesColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => (
        <Space>
          <BookOutlined style={{ color: '#1890ff' }} />
          <Text strong>{title}</Text>
        </Space>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        if (!level) return <Tag color="default">Unknown</Tag>;

        const normalized = level.toLowerCase();
        let color = 'green';
        let label = 'Beginner';

        if (normalized === 'intermediate') {
          color = 'blue';
          label = 'Intermediate';
        } else if (normalized === 'professional') {
          color = 'purple';
          label = 'Professional';
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {new Date(date).toLocaleString()}
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewCourseDetails(record.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const bundlesColumns = [
    {
      title: 'Title',
      dataIndex: 'bundleName',
      key: 'bundleName',
      render: (bundleName) => (
        <Space>
          <AppstoreOutlined style={{ color: '#722ed1' }} />
          <Text strong>{bundleName}</Text>
        </Space>
      ),
    },
    {
      title: 'Courses',
      dataIndex: 'courseCount',
      key: 'courseCount',
      render: (count) => (
        <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Space>
          <CalendarOutlined />
          {new Date(date).toLocaleString()}
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewBundleDetails(record.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  // const groupsColumns = [
  //   { 
  //     title: 'Name', 
  //     dataIndex: 'name', 
  //     key: 'name',
  //     render: (name) => (
  //       <Space>
  //         <TeamOutlined style={{ color: '#fa8c16' }} />
  //         <Text strong>{name}</Text>
  //       </Space>
  //     )
  //   },
  //   { title: 'Created By', dataIndex: 'createdBy', key: 'createdBy' },
  //   { 
  //     title: 'Members', 
  //     dataIndex: 'memberCount', 
  //     key: 'memberCount',
  //     render: (count) => (
  //       <Badge count={count} style={{ backgroundColor: '#1890ff' }} />
  //     )
  //   },
  //   { 
  //     title: 'Created At', 
  //     dataIndex: 'createdAt', 
  //     key: 'createdAt',
  //     render: (date) => (
  //       <Space>
  //         <CalendarOutlined />
  //         {new Date(date).toLocaleString()}
  //       </Space>
  //     )
  //   },
  //   {
  //     title: 'Action',
  //     key: 'action',
  //     render: (_, record) => (
  //       <Button 
  //         type="link" 
  //         onClick={() => handleViewGroupDetails(record.id)}
  //       >
  //         View Details
  //       </Button>
  //     ),
  //   },
  // ];

  return (
    <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
      <Tabs defaultActiveKey="1" type="card" style={{ marginTop: -8 }}>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Recent Users
            </span>
          }
          key="1"
        >
          <div style={{ marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Recently Added Users</Title>
          </div>
          <Table
            columns={usersColumns}
            dataSource={recentUserList}
            pagination={false}
            style={{ backgroundColor: 'white' }}
            bordered
            rowKey="id"
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <BookOutlined />
              Recent Courses
            </span>
          }
          key="2"
        >
          <div style={{ marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Recently Added Courses</Title>
          </div>
          <Table
            columns={coursesColumns}
            dataSource={recentCourseList}
            pagination={false}
            style={{ backgroundColor: 'white' }}
            bordered
            rowKey="id"
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <AppstoreOutlined />
              Recent Bundles
            </span>
          }
          key="3"
        >
          <div style={{ marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Recently Added Bundles</Title>
          </div>
          <Table
            columns={bundlesColumns}
            dataSource={recentBundleList}
            pagination={false}
            style={{ backgroundColor: 'white' }}
            bordered
            rowKey="id"
          />
        </TabPane>

        {/* <TabPane 
          tab={
            <span>
              <TeamOutlined />
              Recent Groups
            </span>
          } 
          key="4"
        >
          <div style={{ marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>Recently Added Groups</Title>
          </div>
          <Table 
            columns={groupsColumns} 
            dataSource={recentGroupList} 
            pagination={false}
            style={{ backgroundColor: 'white' }}
            bordered
            rowKey="id"
          />
        </TabPane> */}
      </Tabs>
    </Card>
  );
};

export default RecentDataTabs;