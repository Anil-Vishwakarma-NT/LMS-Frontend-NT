import React from 'react';
import { Card, Row, Col, Statistic, Typography, Alert } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  AppstoreOutlined,
  TeamOutlined,
  SolutionOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const DashboardStats = ({
  userCount,
  courseCount,
  bundleCount,
  groupCount,
  enrollmentCount,
  activeUsers,
  stalledProgress
}) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
          <Statistic
            title={<Text strong style={{ fontSize: 16 }}>Total Users</Text>}
            value={userCount}
            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
          <Statistic
            title={<Text strong style={{ fontSize: 16 }}>Total Courses</Text>}
            value={courseCount}
            prefix={<BookOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
          <Statistic
            title={<Text strong style={{ fontSize: 16 }}>Total Bundles</Text>}
            value={bundleCount}
            prefix={<AppstoreOutlined style={{ color: '#722ed1' }} />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
          <Statistic
            title={<Text strong style={{ fontSize: 16 }}>Total Groups</Text>}
            value={groupCount}
            prefix={<TeamOutlined style={{ color: '#fa8c16' }} />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
          <Statistic
            title={<Text strong style={{ fontSize: 16 }}>Total Enrollments</Text>}
            value={enrollmentCount}
            prefix={<SolutionOutlined style={{ color: '#13c2c2' }} />}
            valueStyle={{ color: '#13c2c2' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Card hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
          <Statistic
            title={<Text strong style={{ fontSize: 16 }}>Active Users</Text>}
            value={activeUsers}
            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={16} lg={12}>
        <Card hoverable style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
          <Statistic
            title={<Text strong style={{ fontSize: 16 }}>Stalled Progress</Text>}
            value={stalledProgress}
            prefix={<WarningOutlined style={{ color: '#faad14' }} />}
            valueStyle={{ color: '#faad14' }}
            suffix="users/groups"
          />
          <Alert
            message={<Text strong>Attention Required</Text>}
            description={`${stalledProgress} users or groups have inactive learning paths for over 30 days.`}
            type="warning"
            showIcon
            style={{ marginTop: 16, borderRadius: 4 }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardStats;