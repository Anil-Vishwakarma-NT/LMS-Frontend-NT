import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminHOC from "../../shared/HOC/AdminHOC";
import "./BooksAdmin.css";
import Button from "../../shared/button/Button";
import CourseContentTable from "../../shared/table/CourseContentTable";
import { fetchCourseContentByCourseId, deleteCourseContent, fetchCourseById } from "../../../service/BookService";
import CourseContentModal from "../booksAdmin/CourseContentModal";

const CourseContentAdmin = ({ setLoading }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseContent, setCourseContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  const loadCourseName = async () => {
    try {
      const course = await fetchCourseById(courseId);
      setCourseTitle(course.title);
      console.log("Fetched Course Title:", course.title); // Log for course title
    } catch (error) {
      setErrorMessage("Failed to fetch course title.");
      console.error(error);
    }
  };

  const loadCourseContent = async () => {
    try {
      setLoading(true);
      const contentData = await fetchCourseContentByCourseId(courseId);
      const mappedContent = contentData.map((item) => ({
        ...item,
        isActive: item.active, // Map 'active' to 'isActive'
      }));
      console.log("Fetched Content Data:", mappedContent); // Log for fetched content
      setCourseContent(mappedContent);
      setFilteredContent(mappedContent);
    } catch (error) {
      setErrorMessage("Failed to fetch course content.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseName();
    loadCourseContent();
  }, [courseId]);

  useEffect(() => {
    const updatedContent = courseContent.map((content) => ({
      ...content,
      courseName: courseTitle,
    }));
    setFilteredContent(updatedContent);
  }, [courseTitle, courseContent]);

const applyFilters = () => {
  let filtered = courseContent.map((content) => ({
    ...content,
    courseName: courseTitle, // Ensure courseName persists in filtered content
  })); // Add courseName to all filtered content entries

  if (filterType === "active") {
    filtered = filtered.filter((content) => content.isActive);
  } else if (filterType === "inactive") {
    filtered = filtered.filter((content) => !content.isActive);
  }

  if (searchTerm.trim()) {
    filtered = filtered.filter((content) =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  setFilteredContent(filtered); // Update filteredContent with the applied filters
};

  useEffect(() => {
    applyFilters();
  }, [filterType, searchTerm]);

  const toggleFilterType = () => {
    setFilterType((prev) => {
      if (prev === "all") return "active";
      if (prev === "active") return "inactive";
      return "all";
    });
  };

  const handleDeleteCourseContent = async (contentId) => {
    try {
      setLoading(true);
      await deleteCourseContent(contentId);
      setCourseContent((prev) =>
        prev.filter((content) => content.courseContentId !== contentId)
      );
    } catch (error) {
      setErrorMessage("Failed to delete course content.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourseContent = (content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleAddNewCourseContent = () => {
    setSelectedContent(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedContent(null);
    setIsModalOpen(false);
  };

  const contentFields = [
    { index: 1, title: "Content ID" },
    { index: 2, title: "Title" },
    { index: 3, title: "Description" },
    { index: 4, title: "Course Name" },
    { index: 5, title: "Is Active" },
    { index: 6, title: "Created At" },
    { index: 7, title: "Updated At" },
    { index: 8, title: "Resource Link" },
  ];

  console.log("Final Content Passed to Table:", filteredContent); // Log for table content

  return (
    <div className="admin-section">
      <div className="admin-page-mid">
        <h2 className="admin-page-header">{`Manage Content for "${courseTitle}"`}</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by title"
            className="searchbar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="action-buttons">
          <Button
            text="Add New Content"
            onClick={handleAddNewCourseContent}
            className="common-btn"
          />
          <Button
            text={
              filterType === "all"
                ? "Show Active"
                : filterType === "active"
                ? "Show Inactive"
                : "Show All"
            }
            onClick={toggleFilterType}
            className="common-btn"
          />
          <Button
            text="Back to Courses"
            onClick={() => navigate("/books")}
            className="common-btn"
          />
        </div>
      </div>
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
          <Button
            text="Retry"
            onClick={loadCourseContent}
            className="common-btn"
          />
        </div>
      )}
      {filteredContent.length === 0 && !errorMessage ? (
        <div className="no-data-found">No content available for this course.</div>
      ) : (
        <CourseContentTable
          fields={contentFields}
          entries={filteredContent}
          onDeleteClick={handleDeleteCourseContent}
          onEditClick={handleEditCourseContent}
        />
      )}
      <CourseContentModal
        isModalOpen={isModalOpen}
        handleCloseModal={closeModal}
        selectedContent={selectedContent}
        setToastMessage={(msg) => console.log(msg)}
        setToastType={(type) => console.log(type)}
        setShowToast={(show) => console.log(show)}
        setLoading={setLoading}
        loadContent={loadCourseContent}
        courseId={courseId}
      />
    </div>
  );
};

export default AdminHOC(CourseContentAdmin);