// import React, { useEffect, useState } from "react";
// import UserHOC from "../../shared/HOC/UserHOC"; 
// import UserCourseTable from "../../shared/table/UserCourseTable";
// import { getUserEnrolledCourseDetails } from "../../../service/UserCourseService";

// const MyCourses = () => {
//   const [search, setSearch] = useState('');
//   const [courseList, setCourseList] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
  

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const userId = 2; // Replace with actual logged-in user ID
//         const data = await getUserEnrolledCourseDetails(userId);
//         setCourseList(data);
//         setFilteredCourses(data); // Initial filtered state
//       } catch (error) {
//         console.log("Error fetching user courses:", error);
//       }
//     };
//     fetchCourses();
//   }, []);

//   useEffect(() => {
//     let filtered = courseList;
//     if (search.trim()) {
//       filtered = filtered.filter(course =>
//         course.title.toLowerCase().includes(search.toLowerCase()) 
//       //  ||  course.level.toLowerCase().includes(search.toLowerCase()) ||
//         // course.assignedById.toString().includes(search)
//       );
//     }
//     setFilteredCourses(filtered);
//   }, [search, courseList]);

//   return (
//     <div className="admin-section"> 
//       <h2 className="admin-page-header">My Enrolled Courses</h2>
//       <div className="admin-page-mid"> 
//         <div className="search">
//           <input
//             type="text"
//             placeholder="Search by title"
//             className="searchbar"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {filteredCourses.length > 0 ? (
//         <UserCourseTable entries={filteredCourses} />
//       ) : (
//         <div className="no-data-found">No enrolled courses found.</div>
//       )}
//     </div>
//   );
// };

// export default UserHOC(MyCourses); 






import { useEffect, useState } from "react";
import { useSelector , useDispatch} from "react-redux";
import UserHOC from "../../shared/HOC/UserHOC"; 
import UserCourseTable from "../../shared/table/UserCourseTable";
import { getUserEnrolledCourseDetails } from "../../../service/UserCourseService";
import { setUserId as setUserIdAction} from "../../../redux/authentication/authActions";

const MyCourses = () => {
  const [search, setSearch] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [userId, setUserId] = useState(null);

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const email = auth?.email;

const fetchUserId = async (email) => {
  try {
    const response = await fetch(`http://localhost:8081/api/users/getUserId?email=${email}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("authtoken")}`,
        "Content-Type": "application/json"
      }
    });

    const rawData = await response.text();
    console.log("Raw response from API:", rawData); 
    const userData = JSON.parse(rawData); // Ensure valid JSON
    return userData;
  } catch (error) {
    console.error("❌ Error fetching user ID:", error);
    return null;
  }
};

  useEffect(() => {
    if (email) {
      fetchUserId(email).then(userId => {
        console.log("Fetched User ID:", userId);
        setUserId(userId);
        dispatch(setUserIdAction(userId));  // Store user ID once received
      });
    }
  }, [email]);

  // Fetch courses once user ID is available
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!userId) return;  // Ensure user ID is available before making API call

        const data = await getUserEnrolledCourseDetails(userId);
        setCourseList(data);
        setFilteredCourses(data);
      } catch (error) {
        console.log("Error fetching user courses:", error);
      }
    };

    fetchCourses();
  }, [userId]);  // Dependency updated to fetch courses only when user ID is available

  useEffect(() => {
    let filtered = courseList;
    if (search.trim()) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredCourses(filtered);
  }, [search, courseList]);

  return (
    <div className="admin-section"> 
      <h2 className="admin-page-header">My Enrolled Courses</h2>
      <div className="admin-page-mid"> 
        <div className="search">
          <input
            type="text"
            placeholder="Search by title"
            className="searchbar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <UserCourseTable entries={filteredCourses} />
      ) : (
        <div className="no-data-found">No enrolled courses found.</div>
      )}
    </div>
  );
};

export default UserHOC(MyCourses);