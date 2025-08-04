<<<<<<< HEAD
import AdminHOC from "../../shared/HOC/AdminHOC";

=======
>>>>>>> origin/latest-dev
import React, { useEffect, useState } from 'react';
import { Typography, Divider } from 'antd';
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
import AdminHOC from "../../shared/HOC/AdminHOC";
import './AdminDashboard.css'; // New CSS file we'll create

const { Title } = Typography;

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [bundleCount, setBundleCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(5);
  const [stalledProgress, setStalledProgress] = useState(10);

  const [recentUserList, setRecentUserList] = useState([]);
  const [recentCourseList, setRecentCourseList] = useState([]);
  const [recentBundleList, setRecentBundleList] = useState([]);
  const [recentGroupList, setRecentGroupList] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
<<<<<<< HEAD
      fetchDashboardStats();
      fetchRecentUser();
      fetchRecentCoursesAndBundles();
      // fetchRecentGroup();
=======
      const [
        users, courses, bundles, groups, enrollments,
        recentUsers, recentCourses, recentBundles, recentGroups
      ] = await Promise.all([
        getTotalUsers(),
        getTotalCourses(),
        getTotalBundles(),
        getTotalGroups(),
        getTotalEnrollment(),
        getRecentUser(),
        getRecentCourse(),
        getRecentBundle(),
        getRecentGroups()
      ]);

      setUserCount(users);
      setCourseCount(courses);
      setBundleCount(bundles);
      setGroupCount(groups);
      setEnrollmentCount(enrollments?.totalEnrollments ?? 0);

      setRecentUserList(recentUsers);
      setRecentCourseList(recentCourses);
      setRecentBundleList(recentBundles);
      setRecentGroupList(recentGroups);
>>>>>>> origin/latest-dev
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

<<<<<<< HEAD
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

=======
>>>>>>> origin/latest-dev
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
    <div className="dashboard-container">
      <div className="dashboard-header">

        <Title level={2} className="dashboard-title"><DashboardOutlined className="dashboard-icon" />Admin Dashboard Overview</Title>
      </div>
      <Divider className='header-divider' />
      <DashboardStats {...statProps} />
      <RecentDataTabs {...tabsProps} />
    </div>
  );
};

export default AdminHOC(AdminDashboard);
