import React, { useEffect, useState } from 'react';
import { Typography, Divider } from 'antd';
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
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
