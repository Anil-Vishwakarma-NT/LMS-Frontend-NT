import React, { useEffect, useState } from "react";
import Modal from "../../shared/modal/Modal";
import "./BooksAdmin.css";
import Button from "../../shared/button/Button";
import { updateCourseContent, createCourseContent, fetchCourseById } from "../../../service/BookService";

const CourseContentModal = ({
  isModalOpen,
  handleCloseModal,
  selectedContent,
  setToastMessage,
  setToastType,
  setShowToast,
  setLoading,
  loadContent,
  courseId,
}) => {
  const [formData, setFormData] = useState({
    courseContentId: "",
    courseId: courseId || "",
    title: "",
    description: "",
    resourceLink: "",
    isActive: "", // Default empty for "Select Status"
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    resourceLink: "",
    isActive: "",
  });

  const [courseName, setCourseName] = useState("");

  // Fetch course name globally whenever the page or courseId loads
  useEffect(() => {
    const loadCourseName = async () => {
      try {
        if (courseId) {
          const course = await fetchCourseById(courseId);
          setCourseName(course.title || "Unknown Course");
        }
      } catch (error) {
        console.error("Error fetching course name:", error);
        setCourseName("Unknown Course");
      }
    };

    loadCourseName(); // Fetch course name on mount or courseId change
  }, [courseId]);

  // Set modal data when opened
  useEffect(() => {
    if (isModalOpen) {
      if (selectedContent) {
        // Pre-fill data for Edit
        setFormData({
          courseContentId: selectedContent.courseContentId || "",
          courseId: selectedContent.courseId || courseId || "",
          title: selectedContent.title || "",
          description: selectedContent.description || "",
          resourceLink: selectedContent.resourceLink || "",
          isActive: selectedContent.active ? "true" : "false",
        });
      } else {
        // Empty form for Add
        setFormData({
          courseContentId: "",
          courseId: courseId || "",
          title: "",
          description: "",
          resourceLink: "",
          isActive: "", // Reset for "Select Status"
        });
      }
      setErrors({}); // Clear errors on modal open
    }
  }, [isModalOpen, selectedContent, courseId]);

  const validateForm = () => {
    const newErrors = { title: "", description: "", resourceLink: "", isActive: "" };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required!";
      isValid = false;
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters!";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required!";
      isValid = false;
    }

    if (!formData.resourceLink.trim()) {
      newErrors.resourceLink = "Resource Link is required!";
      isValid = false;
    } else if (!/^https?:\/\/.*$/.test(formData.resourceLink)) {
      newErrors.resourceLink = "Invalid Resource Link format!";
      isValid = false;
    }

    if (!formData.isActive) {
      newErrors.isActive = "Status is required!";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const requestData = {
        courseId: formData.courseId,
        title: formData.title,
        description: formData.description,
        resourceLink: formData.resourceLink,
        active: formData.isActive === "true", // Convert isActive to active
      };

      if (formData.courseContentId) {
        await updateCourseContent(formData.courseContentId, requestData);
        setToastMessage("Course content updated successfully!");
      } else {
        await createCourseContent(requestData);
        setToastMessage("New course content added successfully!");
      }

      setToastType("success");
      setShowToast(true);
      loadContent();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving course content:", error);
      setToastMessage("Failed to save course content.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setErrors({ ...errors, [id]: "" }); // Clear error for the specific field
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  return isModalOpen ? (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={formData.courseContentId ? `Edit Content for "${courseName}"` : `Add Content for "${courseName}"`}
    >
      <div>
        <div className="form-group">
          <label htmlFor="title" className="label-text">Title:</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          {errors.title && <div className="error-text">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="label-text">Description:</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            autoComplete="off"
            required
          ></textarea>
          {errors.description && <div className="error-text">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="resourceLink" className="label-text">Resource Link:</label>
          <input
            type="url"
            id="resourceLink"
            value={formData.resourceLink}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          {errors.resourceLink && <div className="error-text">{errors.resourceLink}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="isActive" className="label-text">Is Active:</label>
          <select
            id="isActive"
            value={formData.isActive}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          {errors.isActive && <div className="error-text">{errors.isActive}</div>}
        </div>

        <div className="modal-button">
          <Button
            onClick={handleSaveChanges}
            type="submit"
            text={formData.courseContentId ? "Edit" : "Add"}
          />
        </div>
      </div>
    </Modal>
  ) : null;
};

export default CourseContentModal;