import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import UserHOC from "../../shared/HOC/UserHOC";
import UserCourseTable from "../../shared/table/UserCourseTable";
import { getUserEnrolledCourseDetails } from "../../../service/UserCourseService";
import { setUserId as setUserIdAction } from "../../../redux/authentication/authActions";
import { Input, Typography } from "antd";

const { Title } = Typography;

const MyCourses = () => {
  const [search, setSearch] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [userId, setUserId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authtoken");

    if (token) {
      try {
       const decoded = jwtDecode(token);
        const id = decoded?.userId;

        if (id) {
          setUserId(id);
          dispatch(setUserIdAction(id));
          localStorage.setItem("userId", id);
        } else {
          console.warn("⚠️ userId not found in token payload.");
        }
      } catch (err) {
        console.error("❌ Error decoding JWT:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!userId) return;

        const data = await getUserEnrolledCourseDetails(userId);
        setCourseList(data);
        setFilteredCourses(data);
      } catch (error) {
        console.log("Error fetching user courses:", error);
      }
    };

    fetchCourses();
  }, [userId]);

  useEffect(() => {
    let filtered = courseList;
    if (search.trim()) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  }, [search, courseList]);

  return (
    <div className="admin-section">
      <div className="admin-page-mid">
        <Title level={3}>My Enrolled Courses</Title>
        <div className="search-container" style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by title"
            className="searchbar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <UserCourseTable entries={filteredCourses} showViewAction={true} />
      ) : (
        <div className="no-data-found">No enrolled courses found.</div>
      )}
    </div>
  );
};

export default UserHOC(MyCourses);
