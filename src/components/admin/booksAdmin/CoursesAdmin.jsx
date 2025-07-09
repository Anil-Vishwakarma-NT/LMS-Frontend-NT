import React, { useEffect, useState } from "react";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { Input, Button, Typography, Modal, message } from "antd";
import CourseTable from "../../shared/table/CourseTable";
import CoursesModal from "./BooksModal";
import {
  fetchAllCourses,
  deleteCourse,
  updateCourse,
} from "../../../service/BookService";
import handleCreateCourse from "./BooksModal";

const { Title } = Typography;

const CoursesAdmin = ({ setLoading }) => {
  const [search, setSearch] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCourses();
      const mappedData = data.map((course) => ({
        ...course,
        isActive: course.active,
        createdAt: course.createdAt,
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
        loadCourses();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let filtered = courseList;

    if (filterType === "active") {
      filtered = courseList.filter((course) => course.isActive);
    } else if (filterType === "inactive") {
      filtered = courseList.filter((course) => !course.isActive);
    }

    if (search.trim()) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  }, [search, courseList, filterType]);

  const handleDeleteCourse = async (courseId) => {
    try {
      setLoading(true);
      const data = await deleteCourse(courseId);
      message.success(data?.message || "Course deleted successfully!");
      await loadCourses();
    } catch (error) {
      message.error(error?.message || "Course cannot be deleted.");
    } finally {
      setLoading(false);
    }
  };

  const showConfirmDelete = (course) => {
    Modal.confirm({
      title: "Are you sure you want to delete this course?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDeleteCourse(course.courseId),
    });
  };

  const handleEditCourse = async (updatedCourse) => {
    try {
      setLoading(true);
      const data = await updateCourse(updatedCourse.courseId, {
        ...updatedCourse,
        active: updatedCourse.isActive,
      });
      message.success(data?.message || "Course updated successfully!");
      await loadCourses();
    } catch (error) {
      message.error(error?.message || "Course update failed.");
    } finally {
      setIsEditPopupOpen(false);
      setEditingCourse(null);
      setLoading(false);
    }
  };

  const toggleFilterType = () => {
    setFilterType((prev) =>
      prev === "all" ? "active" : prev === "active" ? "inactive" : "all"
    );
  };

  const handleOpenEditPopup = (course) => {
    setEditingCourse(course);
    setIsEditPopupOpen(true);
  };

  const handleOpenModal = () => {
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
        <Title level={3}>Available Courses</Title>

        <div className="search-container" style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        <div
          className="action-buttons"
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <Button type="primary" onClick={handleOpenModal}>
            Add Course
          </Button>
          <Button onClick={toggleFilterType}>
            {filterType === "all"
              ? "Show Active Courses"
              : filterType === "active"
              ? "Show Inactive Courses"
              : "Show All Courses"}
          </Button>
        </div>
      </div>

      {filteredCourses && filteredCourses.length > 0 ? (
        <CourseTable
          fields={fields}
          entries={filteredCourses}
          type={"course"}
          onDeleteClick={(course) => showConfirmDelete(course)}
          onEditClick={handleOpenEditPopup}
        />
      ) : (
        <div className="no-data-found">No Courses Found</div>
      )}

      <CoursesModal
        isModalOpen={isEditPopupOpen}
        handleCloseModal={() => setIsEditPopupOpen(false)}
        selectedCourse={editingCourse}
        handleCreateCourse={handleCreateCourse}
        handleUpdateCourse={handleEditCourse}
        setLoading={setLoading}
        title={editingCourse ? "Edit Course" : "Add New Course"}
        loadCourses={loadCourses}
      />
    </div>
  );
};

export default AdminHOC(CoursesAdmin);

