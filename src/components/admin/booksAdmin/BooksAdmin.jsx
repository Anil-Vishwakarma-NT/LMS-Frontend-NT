import React, { useEffect, useState } from "react";
import AdminHOC from "../../shared/HOC/AdminHOC";
import "./BooksAdmin.css";
import Button from "../../shared/button/Button";
import CourseTable from "../../shared/table/CourseTable";
import Toast from "../../shared/toast/Toast";
import searchLogo from "../../../assets/magnifying-glass.png";
import ConfirmDeletePopup from "../../shared/confirmDeletePopup/ConfirmDeletePopup";
import CoursesModal from "./BooksModal";
import { fetchAllCourses, deleteCourse, updateCourse, fetchCourseById } from "../../../service/BookService"; // Updated import
import handleCreateCourse from "../booksAdmin/BooksModal";

const CoursesAdmin = ({ setLoading }) => {
  const [search, setSearch] = useState('');
  const [courseList, setCourseList] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filterType, setFilterType] = useState('all'); // Initial filter: 'all'

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCourses();
      const mappedData = data.map(course => ({
        ...course,
        isActive: course.active,
        createdAt: course.createdAt, // Ensure correct mapping of createdAt
      }));
      setCourseList(mappedData); 
    } catch (error) {
      console.log("Error in loadCourses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.length > 2 || search.length === 0) {
        console.log("Calling loadCourses due to search:", search); // Debug search state
        loadCourses();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

useEffect(() => {
  let filtered = courseList;

  if (filterType === 'active') {
    filtered = courseList.filter(course => course.isActive);
  } else if (filterType === 'inactive') {
    filtered = courseList.filter(course => !course.isActive);
  }

  if (search.trim()) {
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  setFilteredCourses(filtered);
}, [search, courseList, filterType]);

  const handleDeleteCourse = async () => {
    try {
      setLoading(true);
      const data = await deleteCourse(courseToDelete?.courseId); // Fetch ID dynamically
      console.log("Delete course response:", data); // Debug delete response
      setToastMessage(data?.message || "Course deleted successfully!");
      setToastType("success");
      setShowToast(true);
      await loadCourses(); // Refresh course list
    } catch (error) {
      console.log("Error during course deletion:", error.message);
      setToastMessage(error?.message || "Course cannot be deleted.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsConfirmPopupOpen(false);
      setCourseToDelete(null);
      setLoading(false);
    }
  };

  const handleEditCourse = async (updatedCourse) => {
    try {
      setLoading(true);
      const data = await updateCourse(updatedCourse.courseId, {
        ...updatedCourse,
        active: updatedCourse.isActive, // Send 'active' to backend, not 'isActive'
      });
      console.log("Edit course response:", data); // Debug edit response
      setToastMessage(data?.message || "Course updated successfully!");
      setToastType("success");
      setShowToast(true);
      await loadCourses(); // Refresh course list
    } catch (error) {
      console.log("Error during course editing:", error.message);
      setToastMessage(error?.message || "Course update failed.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsEditPopupOpen(false);
      setEditingCourse(null);
      setLoading(false);
    }
  };

  const toggleFilterType = () => {
  setFilterType(prevFilter => {
    if (prevFilter === 'all') return 'active';
    if (prevFilter === 'active') return 'inactive';
    return 'all';
  });
};

  const handleOpenConfirmDeletePopup = (course) => {
    if (!course?.courseId) {
      console.error("Error: Received undefined courseId in delete popup.");
      return;
    }

    console.log("Confirm delete popup opened for course ID:", course.courseId); // Debug delete popup
    setCourseToDelete(course);
    setIsConfirmPopupOpen(true);
  };

  const handleOpenEditPopup = (course) => {
    console.log("Edit popup opened for course ID:", course.courseId); // Debug edit popup
    setEditingCourse(course);
    setIsEditPopupOpen(true);
  };

  const handleOpenModal = () => {
    console.log("Opening modal for course creation."); // Debug modal action
    setEditingCourse(null);
    setIsEditPopupOpen(true);
  };

  const fields = [
    { index: 1, title: "Course ID" },
    { index: 2, title: "Title" },
    { index: 3, title: "Description" },
    { index: 4, title: "Level" },
    { index: 5, title: "Owner ID" },
    { index: 6, title: "Is Active" },
    { index: 7, title: "Updated At" },
    { index: 8, title: "Created At" },
  ];

  return (
    <div className="admin-section">
      <div className="admin-page-mid">
        <h2 className="admin-page-header">Available Courses</h2>
        <div className="admin-page-search-add">
          <div className="admin-page-search">
            <div className="search">
              <input
                type="text"
                placeholder="Search by name"
                className="searchbar"
                value={search}
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <Button text="Add Course" type="button" onClick={handleOpenModal} /> 
            <Button 
            text={
              filterType === 'all' 
                ? 'Show Active Courses' 
                : filterType === 'active' 
                  ? 'Show Inactive Courses' 
                  : 'Show All Courses'
            }
            onClick={toggleFilterType}
          />         
          </div>
        </div>
      </div>
      {filteredCourses && filteredCourses.length > 0 ? (
        (
          <CourseTable 
            fields={fields} 
            entries={filteredCourses}  
            type={"course"} 
            onDeleteClick={handleOpenConfirmDeletePopup} 
            onEditClick={handleOpenEditPopup} 
          />
        )
      ) : (
        <div className="no-data-found"></div>
      )}
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <ConfirmDeletePopup 
        isOpen={isConfirmPopupOpen} 
        onClose={() => setIsConfirmPopupOpen(false)} 
        onConfirm={handleDeleteCourse} 
      />
      <CoursesModal
        isModalOpen={isEditPopupOpen}
        handleCloseModal={() => setIsEditPopupOpen(false)}
        selectedCourse={editingCourse}
        handleCreateCourse={handleCreateCourse}
        handleUpdateCourse={handleEditCourse}
        setToastMessage={setToastMessage}
        setToastType={setToastType}
        setShowToast={setShowToast}
        setLoading={setLoading}
        title={editingCourse ? "Edit Course" : "Add New Course"}
        loadCourses={loadCourses}
      />
    </div>
  );
};

export default AdminHOC(CoursesAdmin);



