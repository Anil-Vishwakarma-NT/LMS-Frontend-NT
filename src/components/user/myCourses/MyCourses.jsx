import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const email = auth?.email;

  const fetchUserId = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/users/getUserId`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
          "Content-Type": "application/json",
        },
      });

      const userData = await response.json();
      console.log("✅ Parsed JSON response:", userData);
      return userData;
    } catch (error) {
      console.error("❌ Error fetching user ID:", error);
      return null;
    }
  };

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
  
    if (savedUserId) {
      setUserId(Number(savedUserId)); // Restore from localStorage
      dispatch(setUserIdAction(Number(savedUserId)));
    } else if (email) {
      fetchUserId(email).then((user) => {
        if (user && user.userId) {
          console.log("Fetched User ID:", user.userId);
          setUserId(user.userId);
          dispatch(setUserIdAction(user.userId));
          localStorage.setItem("userId", user.userId); // ✅ Save to localStorage
        } else {
          console.warn("No valid user returned from API.");
        }
      });
    }
  }, [email]);
  

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
        // Optional: Replace with <Empty description="No enrolled courses found." />
      )}
    </div>
  );
};

export default UserHOC(MyCourses);


