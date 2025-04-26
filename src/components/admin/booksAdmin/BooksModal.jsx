import React, { useState, useEffect } from "react";
import Modal from "../../shared/modal/Modal";
import "./BooksAdmin.css";
import Button from "../../shared/button/Button";
import { createCourse, updateCourse } from "../../../service/BookService";
import {
  validateMinLength,
  validateNotEmpty,
} from "../../../utility/validation";

const CoursesModal = ({
  title,
  isModalOpen,
  handleCloseModal,
  selectedCourse,
  setToastMessage,
  setToastType,
  setShowToast,
  setLoading,
  loadCourses,
}) => {
  const [courseData, setCourseData] = useState({
    title: "",
    ownerId: "",
    description: "",
    courseLevel: "",
    image: "",
    isActive: "",
    updatedAt: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    ownerId: "",
    description: "",
    courseLevel: "",
    isActive: "",
  });

  useEffect(() => {
    if (isModalOpen) {
      if (selectedCourse) {
        // Pre-fill form data for Edit mode
        setCourseData({
          id: selectedCourse.courseId,
          title: selectedCourse.title,
          ownerId: selectedCourse.ownerId,
          description: selectedCourse.description,
          courseLevel: selectedCourse.level || "",
          image: selectedCourse.image,
          isActive: selectedCourse.active ? "true" : "false",
          updatedAt: selectedCourse.updatedAt || "",
        });
      } else {
        // Reset form for Add mode
        setCourseData({
          title: "",
          ownerId: "",
          description: "",
          courseLevel: "",
          image: "",
          isActive: "",
          updatedAt: "",
        });
      }
      setErrors({}); // Clear errors when modal is opened
    }
  }, [isModalOpen, selectedCourse]);

  const validateCourse = () => {
    const newErrors = {
      title: "",
      ownerId: "",
      description: "",
      courseLevel: "",
      isActive: "",
    };
    let isValid = true;

    if (!validateNotEmpty(courseData.title)) {
      newErrors.title = `Title is required!`;
      isValid = false;
    } else if (!validateMinLength(courseData.title, 3)) {
      newErrors.title = `Title should have at least 3 characters!`;
      isValid = false;
    }

    if (!validateNotEmpty(courseData.ownerId)) {
      newErrors.ownerId = `Owner ID is required!`;
      isValid = false;
    } else if (isNaN(courseData.ownerId)) {
      newErrors.ownerId = `Owner ID must be a numeric value!`;
      isValid = false;
    }

    if (!validateNotEmpty(courseData.description)) {
      newErrors.description = `Description is required!`;
      isValid = false;
    }

    if (!validateNotEmpty(courseData.courseLevel)) {
      newErrors.courseLevel = `Course level is required!`;
      isValid = false;
    }

    if (!validateNotEmpty(courseData.isActive)) {
      newErrors.isActive = `Course active status is required!`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEdit = async () => {
    if (validateCourse()) {
      try {
        setLoading(true);
        const data = await updateCourse(selectedCourse.courseId, {
          ...courseData,
          active: courseData.isActive === "true", // Convert 'isActive' to 'active'
        });
        setToastMessage(data?.message || "Course updated successfully!");
        setToastType("success");
        setShowToast(true);
        await loadCourses(); // Refresh course list
      } catch (error) {
        setToastMessage(error?.message || "Error updating the course!");
        setToastType("error");
        setShowToast(true);
      } finally {
        handleCloseModal();
        setLoading(false);
      }
    }
  };

  const handleCreateCourse = async () => {
    if (validateCourse()) {
      try {
        setLoading(true);
        const newCourseData = {
          title: courseData.title,
          ownerId: parseInt(courseData.ownerId, 10),
          description: courseData.description,
          courseLevel: courseData.courseLevel,
          image: courseData.image,
          active: courseData.isActive === "true", // Convert 'isActive' to 'active'
        };
        await createCourse(newCourseData);
        setToastMessage("Course added successfully!");
        setToastType("success");
        setShowToast(true);
        await loadCourses(); // Refresh course list
      } catch (error) {
        setToastMessage(error?.message || "Error adding the course!");
        setToastType("error");
        setShowToast(true);
      } finally {
        handleCloseModal();
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setErrors({ ...errors, [id]: "" }); // Clear error for the specific field
    setCourseData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={title}>
      <div>
        <div className="form-group">
          <label htmlFor="title" className="label-text">Title:</label>
          <input
            type="text"
            id="title"
            value={courseData.title}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          {errors.title && <div className="error-text">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="label-text">Description:</label>
          <input
            type="text"
            id="description"
            value={courseData.description}
            onChange={handleChange}
            autoComplete="off"
            required
          />
          {errors.description && <div className="error-text">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="ownerId" className="label-text">Owner ID:</label>
          <input
            type="text"
            id="ownerId"
            value={courseData.ownerId}
            onChange={(e) =>
              handleChange({ target: { id: "ownerId", value: e.target.value.trim() } })
            }
            autoComplete="off"
            required
          />
          {errors.ownerId && <div className="error-text">{errors.ownerId}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="courseLevel" className="label-text">Course Level:</label>
          <select
            id="courseLevel"
            value={courseData.courseLevel}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Course Level</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="PROFESSIONAL">Professional</option>
          </select>
          {errors.courseLevel && <div className="error-text">{errors.courseLevel}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="isActive" className="label-text">Is Active:</label>
          <select
            id="isActive"
            value={courseData.isActive}
            onChange={(e) =>
              handleChange({ target: { id: "isActive", value: e.target.value } })
            }
            required
          >
            <option value="" disabled>Select Status</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          {errors.isActive && <div className="error-text">{errors.isActive}</div>}
        </div>

        <div className="modal-button">
          {!selectedCourse && (
            <Button onClick={handleCreateCourse} type="submit" text={"Add"} />
          )}
          {selectedCourse && (
            <Button onClick={handleEdit} type="submit" text={"Edit"} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CoursesModal;