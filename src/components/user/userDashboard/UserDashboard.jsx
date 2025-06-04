import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import UserHOC from "../../shared/HOC/UserHOC";
import './UserDashboard.css';
import Table from '../../shared/table/Table';
import Paginate from '../../shared/pagination/Paginate';
import DashCard from "../../shared/dashCard/DashCard";
import book from "../../../assets/bookshelf.png";
import users from "../../../assets/group.png";
import inHouse from "../../../assets/reading.png";
import category from "../../../assets/category.png";
import UserCourseTable from "../../shared/table/UserCourseTable";

import { userStats } from "../../../service/UserService";
import { userHistory } from '../../../service/IssuanceService';
import { getUserEnrolledCourseDetails } from "../../../service/UserCourseService";

const UserDashboard = () => {
  const auth = useSelector(state => state.auth);

  const [userHistoryData, setUserHistoryData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [dashStatsData, setDashStatsData] = useState({
    enrollments: 0,
    groups: 0,
  });

  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const pageSizeByHeight = () => {
    const height = window.innerHeight;
    return height >= 1024 ? 11 : 10;
  };

  const [pageSize, setPageSize] = useState(pageSizeByHeight());

  const handleResize = () => {
    setPageSize(pageSizeByHeight());
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch userId and set it
  useEffect(() => {
    const fetchUserId = async (email) => {
      try {
        const response = await fetch(`http://localhost:8081/api/users/getUserId?email=${email}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authtoken")}`,
            "Content-Type": "application/json"
          }
        });
        const userData = await response.json();
        console.log("✅ Parsed JSON response:", userData);
        setName(userData.firstName + " " + userData.lastName);
        setId(userData.userId);
      } catch (error) {
        console.error("❌ Error fetching user ID:", error);
      }
    };

    if (auth.email) {
      fetchUserId(auth.email);
    }
  }, [auth.email]);

  // Fetch stats and courses after ID is set
  useEffect(() => {
    if (!id) return;

    const loadStatsAndCourses = async () => {
      try {
        console.log("Fetching user stats and courses for ID:", id);

        const [statsData, coursesData] = await Promise.all([
          userStats(id, auth.accessToken),
          getUserEnrolledCourseDetails(id)
        ]);

        setDashStatsData(statsData);
        setCourseList(coursesData);
        setFilteredCourses(coursesData);

        console.log("📊 User stats:", statsData);
        console.log("📘 Enrolled courses:", coursesData);
      } catch (error) {
        console.error("❌ Error fetching stats/courses:", error);
      }
    };

    loadStatsAndCourses();
  }, [id, auth.accessToken]);

  // Load user history
  const loadUserHistory = async () => {
    if (!id) return;
    try {
      const data = await userHistory(id);
      setUserHistoryData(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (error) {
      console.error("❌ Error loading user history:", error);
    }
  };

  useEffect(() => {
    loadUserHistory();
  }, [id, pageNumber, pageSize]);

  const data = [
    { id: 1, title: "Total Enrollments", number: dashStatsData?.enrollments, logo: users },
    { id: 2, title: "Total Groups", number: dashStatsData?.groups, logo: book },
    // Uncomment and customize these if needed:
    // { id: 3, title: "Total Completed Courses", number: 6, logo: category },
    // { id: 4, title: "Incomplete Courses", number: 3, logo: inHouse },
    // { id: 5, title: "Defaulters", number: 1, logo: inHouse }
  ];

  return (
    <div className="admin-section">
      <h2 className="admin-page-header" style={{ marginTop: '10px' }}>
        Welcome {name}
      </h2>

      <div className="admin-page-mid" />
      <div className="main-content">
        {data.map((item) => (
          <DashCard key={item.id} data={item} />
        ))}
      </div>

      <div className='user-history-table'>
        {filteredCourses.length > 0 ? (
          <UserCourseTable entries={filteredCourses} showViewAction={false} />
        ) : (
          <div className="no-data-found">No enrolled courses found.</div>
        )}

        <div className="paginate">
          {userHistoryData && userHistoryData.length > 0 ? (
            <Paginate
              currentPage={pageNumber}
              totalPages={totalPages}
              onPageChange={setPageNumber}
            />
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHOC(UserDashboard);
