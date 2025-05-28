import React, { useEffect, useState } from 'react'
import { useParams , useLocation } from 'react-router-dom'
import Table from '../../shared/table/Table'
import AdminHOC from '../../shared/HOC/AdminHOC'
import { userHistory } from '../../../service/IssuanceService'
import Paginate from '../../shared/pagination/Paginate'
import DashCard from "../../shared/dashCard/DashCard";
import book from "../../../assets/bookshelf.png";
import users from "../../../assets/group.png";
import inHouse from "../../../assets/reading.png";
import category from "../../../assets/category.png";
import './UserHistory.css'
import { useDispatch, useSelector } from 'react-redux'
import { userStats } from "../../../service/UserService";
import UserCourseTable from "../../shared/table/UserCourseTable";
import { getUserEnrolledCourseDetails } from "../../../service/UserCourseService";

const UserHistory = ({ setLoading }) => {
  const { id } = useParams();
  const location = useLocation();
  const userName = location.state?.name;
  const [userHistoryData, setUserHistoryData] = useState([])
  const [pageNumber, setPageNumber] = useState(0);
  const [dashStatsData, setDashStatsData] = useState({
    enrollments: 0,
    groups: 0,
  })
  let height = window.innerHeight;
  const auth = useSelector(state => state.auth);
  const pageSizeByHeight = () => {
    if (height >= 1024) {
      return 11
    } else if (height <= 1024) {
      return 10
    }
  }
  const [pageSize, setPageSize] = useState(pageSizeByHeight());
  const handleResize = () => {
    height = window.innerHeight;
    const newSize = pageSizeByHeight();
    setPageSize(newSize);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [height]);
  const [totalPages, setTotalPages] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const loadCount = async () => {
      console.log("calling userStat")
      console.log("calling user History ", id)
      const statsData = await userStats(id, auth.accessToken)
      setDashStatsData(statsData)
    }
    const fetchCourses = async () => {
      try {
        // Replace with actual logged-in user ID
        console.log("userId", id);
        const data = await getUserEnrolledCourseDetails(id);
        setCourseList(data);
        setFilteredCourses(data);
        console.log("enrolledcoursesresponse ", data); // Initial filtered state
      } catch (error) {
        console.log("Error fetching user courses:", error);
      }
    };

    fetchCourses();
    loadCount();
  }, []);

  // const loadCount = async () => {
  //   console.log("calling userStat")
  //   console.log("calling user History ", id)
  //   const statsData = await userStats(id, auth.accessToken)
  //   setDashStatsData(statsData)

  // }

  // useEffect(() => {
  //   loadCount();
  // }, [])


  const loadUserHistory = async () => {
    try {
      setLoading(true)

      const data = await userHistory(id);
      setUserHistoryData(data?.content);
      setTotalPages(data?.totalPages)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadUserHistory();
  }, [pageNumber, pageSize]);


  const data = [
    { id: 1, title: "Total Enrollments", number: dashStatsData?.enrollments, logo: users },
    { id: 2, title: "Total Groups", number: dashStatsData?.groups, logo: book },
    // { id: 3, title: "Total Completed Courses", number: 6, logo: category },
    // { id: 4, title: "Incomplete Courses", number: 3, logo: inHouse },
    // { id: 5, title: "Defaulters", number: 1, logo: inHouse }
  ];
  return (
    <div className="admin-section">
      <h2 className="admin-page-header" style={{ marginTop: '10px' }}>{userName} Details</h2>
      <div className="admin-page-mid">
      </div>
      <div className="main-content">
        {data?.map((data) => (
          <DashCard data={data} />
        ))}
      </div>

      <div className='user-history-table'>
        {filteredCourses.length > 0 ? (
          <UserCourseTable entries={filteredCourses} />

        ) : (
          <div className="no-data-found">No enrolled courses found.</div>
        )}
        
        <div className="paginate">
          {userHistoryData && userHistoryData.length > 0 ?
            <Paginate
              currentPage={pageNumber}
              totalPages={totalPages}
              onPageChange={setPageNumber}
            /> : <div></div>}
        </div>
      </div>
    </div>
  )
}
export default AdminHOC(UserHistory)
