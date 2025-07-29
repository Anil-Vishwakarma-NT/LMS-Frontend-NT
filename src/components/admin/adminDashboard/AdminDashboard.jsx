import AdminHOC from "../../shared/HOC/AdminHOC";

import React, { useEffect, useState } from 'react';
import { Layout, Typography, Divider } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import {
  getDashboardStats,
  getTotalUsers,
  getTotalCourses,
  getRecentUser,
  getRecentCourse,
  getRecentBundle,
  getTotalBundles,
  getRecentGroups,
  getTotalGroups,
  getTotalEnrollment,
  getRecentCoursesAndBundles
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
      fetchDashboardStats();
      fetchRecentUser();
      fetchRecentCoursesAndBundles();
      // fetchRecentGroup();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Fetch consolidated dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      console.log("Dashboard stats:", response);
      
      setUserCount(response.userCount || 0);
      setCourseCount(response.courseCount || 0);
      setBundleCount(response.bundleCount || 0);
      setGroupCount(response.groupCount || 0);
      setEnrollmentCount(response.totalEnrollments || 0);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Fallback to individual API calls if consolidated API fails
      fetchUserCount();
      fetchCourseCount();
      fetchBundleCount();
      fetchGroupCount();
      fetchEnrollmentCount();
    }
  };

  // New consolidated method for fetching recent courses and bundles
  const fetchRecentCoursesAndBundles = async () => {
    try {
      const response = await getRecentCoursesAndBundles();
      console.log("Recent courses and bundles:", response);
      
      setRecentCourseList(response.recentCourses || []);
      setRecentBundleList(response.recentBundles || []);
    } catch (error) {
      console.error("Error fetching recent courses and bundles:", error);
      // Fallback to individual API calls if consolidated API fails
      fetchRecentCourse();
      fetchRecentBundle();
    }
  };

  // Fallback individual fetch methods (kept for error handling)
  const fetchUserCount = async () => {
    try {
      const response = await getTotalUsers();
      setUserCount(response);
    } catch (error) {
      console.error("Error fetching user count:", error);
    }
  };

  const fetchCourseCount = async () => {
    try {
      const response = await getTotalCourses();
      setCourseCount(response);
    } catch (error) {
      console.error("Error fetching course count:", error);
    }
  };

  const fetchBundleCount = async () => {
    try {
      const response = await getTotalBundles();
      setBundleCount(response);
    } catch (error) {
      console.error("Error fetching bundle count:", error);
    }
  };

  const fetchGroupCount = async () => {
    try {
      const response = await getTotalGroups();
      setGroupCount(response);
    } catch (error) {
      console.error("Error fetching group count:", error);
    }
  };

  const fetchEnrollmentCount = async () => {
    try {
      const response = await getTotalEnrollment();
      if (response && response.totalEnrollments !== undefined) {
        setEnrollmentCount(response.totalEnrollments);
      } else {
        setEnrollmentCount(0);
      }
    } catch (error) {
      console.error("Error fetching enrollment count:", error);
      setEnrollmentCount(0);
    }
  };

  // Fetch recent data
  const fetchRecentUser = async () => {
    try {
      const response = await getRecentUser();
      setRecentUserList(response);
    } catch (error) {
      console.error("Error fetching recent users:", error);
    }
  };

  // Fallback individual methods (kept for error handling)
  const fetchRecentCourse = async () => {
    try {
      const response = await getRecentCourse();
      setRecentCourseList(response);
    } catch (error) {
      console.error("Error fetching recent courses:", error);
    }
  };

  const fetchRecentBundle = async () => {
    try {
      const response = await getRecentBundle();
      setRecentBundleList(response);
    } catch (error) {
      console.error("Error fetching recent bundles:", error);
    }
  };

  const fetchRecentGroup = async () => {
    try {
      const response = await getRecentGroups();
      setRecentGroupList(response);
    } catch (error) {
      console.error("Error fetching recent groups:", error);
    }
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
            <Title level={2} style={{ margin: 0 }}>Admin Dashboard Overview</Title>
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