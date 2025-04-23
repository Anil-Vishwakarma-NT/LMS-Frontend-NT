import React, { useState, useEffect } from "react";
import Modal from "../../shared/modal/Modal";
import "./BooksAdmin.css";
import Button from "../../shared/button/Button";
import { createCourse, updateCourse } from "../../../service/BookService";
import {
  validateAlphabet,
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
  loadCourses
}) => {
  const [courseData, setCourseData] = useState({
    title: "",
    ownerId: "",
    description: "",
    courseLevel: "",
    image: ""
  });

  const [errors, setErrors] = useState({
    title: "",
    ownerId: "",
    description: "",
    courseLevel: "",
  });

  useEffect(() => {
    if (!isModalOpen) {
      setCourseData({
        title: "",
        ownerId: "",
        description: "",
        courseLevel: "",
        image: ""
      });
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedCourse) {
      setCourseData({
        id: selectedCourse.courseId,
        title: selectedCourse.title,
        ownerId: selectedCourse.ownerId,
        description: selectedCourse.description,
        courseLevel: selectedCourse.level || "",
        image: selectedCourse.image
      });
    } else {
      setCourseData({
        title: "",
        ownerId: "",
        description: "",
        courseLevel: "",
        image: ""
      });
    }

    setErrors({
      title: "",
      ownerId: "",
      description: "",
      courseLevel: "",
    });
  }, [selectedCourse]);

  const validateCourse = () => {
    courseData.title = courseData?.title?.trim();

    let isValid = true;
    const newErrors = {
      title: "",
      ownerId: "",
      description: "",
      courseLevel: "",
    };

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
    }

    if (!validateNotEmpty(courseData.description)) {
      newErrors.description = `Description is required!`;
      isValid = false;
    }

    if (!validateNotEmpty(courseData.courseLevel)) {
      newErrors.courseLevel = `Course level is required!`;
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
    }

    return isValid;
  };

const handleEdit = async () => {
  if (validateCourse()) {
    try {
      setLoading(true);
      const data = await updateCourse(selectedCourse.courseId, courseData);
      if (data) { // ✅ Ensure API response confirms success
        setToastMessage(data?.message || "Course updated successfully!");
        setToastType("success");
        setShowToast(true);
      } else {
        throw new Error("API did not return a success response"); // 🚨 Handle unexpected failure
      }
      
      await loadCourses();// 🔄 Refresh course list instead of calling another function
    } catch (error) {
      setToastMessage(error?.message || "Error in updating this course!");
      setShowToast(true);
      setToastType("error");
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
      const updatedCourseData = { 
        title: courseData.title,
        ownerId: parseInt(courseData.ownerId, 10), // ✅ Ensure integer format
        description: courseData.description,
        courseLevel: courseData.courseLevel,
        image: courseData.image // ✅ Maintain original structure
      };

      await createCourse(updatedCourseData); // ⬅ Send correctly ordered payload

      setToastMessage("Course added successfully!");
      setToastType("success");
      setShowToast(true);

      await loadCourses(); // 🔄 Refresh course list so the new course appears
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
    setErrors({ ...errors, [id]: '' });
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
          <input type="text" id="title" value={courseData.title} onChange={handleChange} required />
          {errors.title && <div className="error-text">{errors.title}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="ownerId" className="label-text">Owner ID:</label>
          <input type="text" id="ownerId" value={courseData.ownerId} onChange={(e) => handleChange({ target: { id: "ownerId", value: e.target.value.trim() } })} required />
          {errors.ownerId && <div className="error-text">{errors.ownerId}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="label-text">Description:</label>
          <input type="text" id="description" value={courseData.description} onChange={handleChange} required />
          {errors.description && <div className="error-text">{errors.description}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="courseLevel" className="label-text">Course Level:</label> {/* Fixed missing field */}
          <input type="text" id="courseLevel" value={courseData.courseLevel} onChange={handleChange} required />
          {errors.courseLevel && <div className="error-text">{errors.courseLevel}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="image" className="label-text">Image:</label>
          <input type="text" id="image" value={courseData.image} onChange={handleChange} required />
        </div>

        <div className="modal-button">
          {!selectedCourse && <Button onClick={handleCreateCourse} type="submit" text={"Add"} />}
          {selectedCourse && <Button onClick={handleEdit} type="submit" text={"Edit"} />}
        </div>
      </div>
    </Modal>
  );
};

export default CoursesModal;
