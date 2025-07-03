import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { Button, Input, Typography, message, Modal } from "antd";
import CourseContentTable from "../../shared/table/CourseContentTable";
import {
  fetchCourseContentByCourseId,
  deleteCourseContent,
  fetchCourseById,
} from "../../../service/BookService";
import CourseContentModal from "../booksAdmin/CourseContentModal";

const { Title } = Typography;
const { confirm } = Modal;

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
    } catch (error) {
      setErrorMessage("Failed to fetch course title.");
      message.error("Failed to fetch course title.");
    }
  };

  const loadCourseContent = async () => {
    try {
      setLoading(true);
      const contentData = await fetchCourseContentByCourseId(courseId);
      const mappedContent = contentData.map((item) => ({
        ...item,
        isActive: item.active,
      }));
      setCourseContent(mappedContent);
      setFilteredContent(mappedContent);
    } catch (error) {
      setErrorMessage("Failed to fetch course content.");
      message.error("Failed to fetch course content.");
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
      courseName: courseTitle,
    }));

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

    setFilteredContent(filtered);
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
      message.success("Content deleted successfully.");
    } catch (error) {
      setErrorMessage("Failed to delete course content.");
      message.error("Failed to delete course content.");
    } finally {
      setLoading(false);
    }
  };

  const showConfirmDeleteCourseContent = (contentId) => {
    confirm({
      title: "Are you sure you want to delete this content?",
      content: "This action cannot be undone.",
      okText: "Yes, delete it",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDeleteCourseContent(contentId),
    });
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

  return (
    <div className="admin-section">
      <div className="admin-page-mid">
        <Title level={3}>{`Manage Content for "${courseTitle}"`}</Title>
        <div className="search-container" style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <Button type="primary" onClick={handleAddNewCourseContent}>
            Add New Content
          </Button>
          <Button onClick={toggleFilterType}>
            {filterType === "all"
              ? "Show Active"
              : filterType === "active"
              ? "Show Inactive"
              : "Show All"}
          </Button>
          <Button onClick={() => navigate("/books")}>Back to Courses</Button>
        </div>
      </div>
      {filteredContent.length === 0 && !errorMessage ? (
        <div className="no-data-found">No content available for this course.</div>
      ) : (
        <CourseContentTable
          fields={contentFields}
          entries={filteredContent}
          showConfirmDeleteCourseContent={showConfirmDeleteCourseContent}
          onEditClick={handleEditCourseContent}
        />
      )}
      <CourseContentModal
      isModalOpen={isModalOpen}
      handleCloseModal={closeModal}
      selectedContent={selectedContent}
      setLoading={setLoading}
      loadContent={loadCourseContent}
      courseId={courseId}
      />

    </div>
  );
};

export default AdminHOC(CourseContentAdmin);

