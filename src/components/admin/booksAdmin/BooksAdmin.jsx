import React, { useEffect, useState } from "react";
import AdminHOC from "../../shared/HOC/AdminHOC";
import "./BooksAdmin.css";
import Button from "../../shared/button/Button";
import Table from "../../shared/table/Table";
import Toast from "../../shared/toast/Toast";
import searchLogo from "../../../assets/magnifying-glass.png";
import ConfirmDeletePopup from "../../shared/confirmDeletePopup/ConfirmDeletePopup";
import CoursesModal from "./BooksModal";
import { fetchAllCourses, deleteCourse, updateCourse, fetchCourseById } from "../../../service/BookService"; // Updated import
import handleCreateCourse from "../booksAdmin/BooksModal"

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

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCourses();
      setCourseList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.trim());
  };

  const handleSearchById = async () => {
  if (!search || isNaN(search)) {
    setToastMessage("Please enter a valid Course ID!");
    setToastType("error");
    setShowToast(true);
    return;
  }

  try {
    setLoading(true);
    const data = await fetchCourseById(search); // 🔄 Call service function
    setCourseList([data]); // ✅ Display only the searched course
  } catch (error) {
    setToastMessage(error?.message || "Course not found!");
    setToastType("error");
    setShowToast(true);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.length > 2 || search.length === 0) {
        loadCourses();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleDeleteCourse = async () => {
    try {
      setLoading(true);
      const data = await deleteCourse(courseToDelete?.courseId); // Fetch ID dynamically
      setToastMessage(data?.message || "Course deleted successfully!");
      setToastType("success");
      setShowToast(true);
      await loadCourses(); // Refresh course list
    } catch (error) {
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
      const data = await updateCourse(updatedCourse.courseId, updatedCourse);
      setToastMessage(data?.message || "Course updated successfully!");
      setToastType("success");
      setShowToast(true);
      await loadCourses(); // Refresh course list
    } catch (error) {
      setToastMessage(error?.message || "Course update failed.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsEditPopupOpen(false);
      setEditingCourse(null);
      setLoading(false);
    }
  };

  const handleOpenConfirmDeletePopup = (course) => {
    if (!course?.courseId) {
      console.error("Error: Received undefined courseId in delete popup.");
      return;
    }
  
    console.log("Confirm delete popup opened for course ID:", course.courseId); // Debugging line
    setCourseToDelete(course); // Ensure the full course object is stored
    setIsConfirmPopupOpen(true);
  };

  const handleOpenEditPopup = (course) => {
    console.log("Edit popup opened for course ID:", course.courseId); // Debugging line
    setEditingCourse(course);
    setIsEditPopupOpen(true);
  };

  const handleOpenModal = () => {
  setEditingCourse(null); // Ensure no course is pre-selected for edit
  setIsEditPopupOpen(true); // Open modal for course creation
};

  const fields = [
    { index: 1, title: "Sr. No." },
    { index: 2, title: "Title" },
    { index: 3, title: "Owner ID" },
    { index: 4, title: "Level" },
    { index: 5, title: "Description" },
    { index: 6, title: "Actions" },
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
                placeholder="Search by ID"
                className="searchbar"
                onChange={handleSearchChange}
              />
            <div className="search-icon" onClick={handleSearchById}>
              <img src={searchLogo} alt="🔍" className="search-logo" />
            </div>
            </div>
            <Button text="Add Course" type="button" onClick={handleOpenModal} />          
            </div>
        </div>
      </div>
      {courseList && courseList.length > 0 ? (
        <Table 
          fields={fields} 
          entries={courseList} 
          type={"course"} 
          onDeleteClick={handleOpenConfirmDeletePopup} 
          onEditClick={handleOpenEditPopup} // Pass edit function
        />
      ) : (
        <div className="no-data-found">No data found</div>
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
        selectedCourse={editingCourse} // Null when adding a new course
        handleCreateCourse={handleCreateCourse} // Function for new course creation
        handleUpdateCourse={handleEditCourse} // Function for editing
        setToastMessage={setToastMessage}
        setToastType={setToastType}
        setShowToast={setShowToast}
        setLoading={setLoading}
        title={editingCourse ? "Edit Course" : "Add New Course"} // Dynamic modal title
        loadCourses={loadCourses}
      />
    </div>
  );
};

export default AdminHOC(CoursesAdmin);