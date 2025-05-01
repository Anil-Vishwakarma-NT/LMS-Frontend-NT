
import AdminHOC from "../../shared/HOC/AdminHOC";

import React, { useEffect, useState } from 'react';
import { Layout, Typography, Divider } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import {
  getTotalUsers,
  getTotalCourses,
  getRecentUser,
  getRecentCourse,
  getRecentBundle,
  getTotalBundles,
  getRecentGroups,
  getTotalGroups,
  getTotalEnrollment
} from "../../../service/AdminService";
import DashboardStats from './DashboardStats';
import RecentDataTabs from './RecentDataTabs';

const { Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  // State for statistics
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [bundleCount, setBundleCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(5); // Could be replaced with API data
  const [stalledProgress, setStalledProgress] = useState(10); // Could be replaced with API data

  // State for recent data
  const [recentUserList, setRecentUserList] = useState([]);
  const [recentCourseList, setRecentCourseList] = useState([]);
  const [recentBundleList, setRecentBundleList] = useState([]);
  const [recentGroupList, setRecentGroupList] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all data at once
  const fetchAllData = async () => {
    try {
      fetchUserCount();
      fetchCourseCount();
      fetchBundleCount();
      fetchGroupCount();
      fetchEnrollmentCount();
      fetchRecentUser();
      fetchRecentCourse();
      fetchRecentBundle();
      fetchRecentGroup();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Fetch count data
  const fetchUserCount = async () => {
    const response = await getTotalUsers();
    setUserCount(response.message);
  };

  const fetchCourseCount = async () => {
    const response = await getTotalCourses();
    setCourseCount(response.message);
  };

  const fetchBundleCount = async () => {
    const response = await getTotalBundles();
    setBundleCount(response.message);
  };

  const fetchGroupCount = async () => {
    const response = await getTotalGroups();
    setGroupCount(response.message);
  };

  const fetchEnrollmentCount = async () => {
    const response = await getTotalEnrollment();
    setEnrollmentCount(response.totalEnrollments);
  };

  // Fetch recent data
  const fetchRecentUser = async () => {
    const response = await getRecentUser();
    setRecentUserList(response);
  };

  const fetchRecentCourse = async () => {
    const response = await getRecentCourse();
    setRecentCourseList(response);
  };

  const fetchRecentBundle = async () => {
    const response = await getRecentBundle();
    setRecentBundleList(response);
  };

  const fetchRecentGroup = async () => {
    const response = await getRecentGroups();
    setRecentGroupList(response);
  };

  const statProps = {
    userCount,
    courseCount,
    bundleCount,
    groupCount,
    enrollmentCount,
    activeUsers,
    stalledProgress
  };

  const tabsProps = {
    recentUserList,
    recentCourseList,
    recentBundleList,
    recentGroupList
  };

  return (
    <div className="admin-section">
      <Content style={{ margin: '0 16px' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360, backgroundColor: '#f5f7fa' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <DashboardOutlined style={{ fontSize: 28, marginRight: 16, color: '#1890ff' }} />
            <Title level={2} style={{ margin: 0 }}>Dashboard Overview</Title>
          </div>
          <Divider style={{ marginTop: 0 }} />

          {/* Key Metrics Cards */}
          <DashboardStats {...statProps} />

          {/* Activity Timeline / Recent Additions Tabs */}
          <RecentDataTabs {...tabsProps} />
        </div>
      </Content>
    </div>
  );
};

export default AdminHOC(AdminDashboard);