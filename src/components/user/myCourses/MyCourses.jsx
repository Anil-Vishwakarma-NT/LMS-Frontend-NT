import React, { useEffect, useState } from "react";
import UserHOC from "../../shared/HOC/UserHOC"; 
import UserCourseTable from "../../shared/table/UserCourseTable";
import { getUserEnrolledCourseDetails } from "../../../service/UserCourseService";

const MyCourses = () => {
  const [search, setSearch] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = 2; // Replace with actual logged-in user ID
        const data = await getUserEnrolledCourseDetails(userId);
        setCourseList(data);
        setFilteredCourses(data); // Initial filtered state
      } catch (error) {
        console.log("Error fetching user courses:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = courseList;
    if (search.trim()) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase()) 
      //  ||  course.level.toLowerCase().includes(search.toLowerCase()) ||
        // course.assignedById.toString().includes(search)
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