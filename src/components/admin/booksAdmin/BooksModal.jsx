// import React, { useState, useEffect } from "react";
// import Modal from "../../shared/modal/Modal";
// import "./BooksAdmin.css";
// import Button from "../../shared/button/Button";
// import { createCourse, updateCourse } from "../../../service/BookService";
// import {
//   validateMinLength,
//   validateNotEmpty,
// } from "../../../utility/validation";

// const CoursesModal = ({
//   title,
//   isModalOpen,
//   handleCloseModal,
//   selectedCourse,
//   setToastMessage,
//   setToastType,
//   setShowToast,
//   setLoading,
//   loadCourses,
// }) => {
//   const [courseData, setCourseData] = useState({
//     title: "",
//     ownerId: "",
//     description: "",
//     courseLevel: "",
//     image: "",
//     isActive: "",
//     updatedAt: "",
//   });

//   const [errors, setErrors] = useState({
//     title: "",
//     ownerId: "",
//     description: "",
//     courseLevel: "",
//     isActive: "",
//   });

//   useEffect(() => {
//     if (isModalOpen) {
//       if (selectedCourse) {
//         // Pre-fill form data for Edit mode
//         setCourseData({
//           id: selectedCourse.courseId,
//           title: selectedCourse.title,
//           ownerId: selectedCourse.ownerId,
//           description: selectedCourse.description,
//           courseLevel: selectedCourse.level || "",
//           image: selectedCourse.image,
//           isActive: selectedCourse.active ? "true" : "false",
//           updatedAt: selectedCourse.updatedAt || "",
//         });
//       } else {
//         // Reset form for Add mode
//         setCourseData({
//           title: "",
//           ownerId: 1,
//           description: "",
//           courseLevel: "",
//           image: "",
//           isActive: "",
//           updatedAt: "",
//         });
//       }
//       setErrors({}); // Clear errors when modal is opened
//     }
//   }, [isModalOpen, selectedCourse]);

//   const validateCourse = () => {
//     const newErrors = {
//       title: "",
//       ownerId: "",
//       description: "",
//       courseLevel: "",
//       isActive: "",
//     };
//     let isValid = true;

//     if (!validateNotEmpty(courseData.title)) {
//       newErrors.title = `Title is required!`;
//       isValid = false;
//     } else if (!validateMinLength(courseData.title, 3)) {
//       newErrors.title = `Title should have at least 3 characters!`;
//       isValid = false;
//     }

//     if (!validateNotEmpty(courseData.ownerId)) {
//       newErrors.ownerId = `Owner ID is required!`;
//       isValid = false;
//     } else if (isNaN(courseData.ownerId)) {
//       newErrors.ownerId = `Owner ID must be a numeric value!`;
//       isValid = false;
//     }

//     if (!validateNotEmpty(courseData.description)) {
//       newErrors.description = `Description is required!`;
//       isValid = false;
//     }

//     if (!validateNotEmpty(courseData.courseLevel)) {
//       newErrors.courseLevel = `Course level is required!`;
//       isValid = false;
//     }

//     if (!validateNotEmpty(courseData.isActive)) {
//       newErrors.isActive = `Course active status is required!`;
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleEdit = async () => {
//     if (validateCourse()) {
//       try {
//         setLoading(true);
//         const data = await updateCourse(selectedCourse.courseId, {
//           ...courseData,
//           active: courseData.isActive === "true", // Convert 'isActive' to 'active'
//         });
//         setToastMessage(data?.message || "Course updated successfully!");
//         setToastType("success");
//         setShowToast(true);
//         await loadCourses(); // Refresh course list
//       } catch (error) {
//         setToastMessage(error?.message || "Error updating the course!");
//         setToastType("error");
//         setShowToast(true);
//       } finally {
//         handleCloseModal();
//         setLoading(false);
//       }
//     }
//   };

//   const handleCreateCourse = async () => {
//     if (validateCourse()) {
//       try {
//         setLoading(true);
//         const newCourseData = {
//           title: courseData.title,
//           ownerId: parseInt(courseData.ownerId, 10),
//           description: courseData.description,
//           courseLevel: courseData.courseLevel,
//           image: courseData.image,
//           active: courseData.isActive === "true", // Convert 'isActive' to 'active'
//         };
//         await createCourse(newCourseData);
//         setToastMessage("Course added successfully!");
//         setToastType("success");
//         setShowToast(true);
//         await loadCourses(); // Refresh course list
//       } catch (error) {
//         setToastMessage(error?.message || "Error adding the course!");
//         setToastType("error");
//         setShowToast(true);
//       } finally {
//         handleCloseModal();
//         setLoading(false);
//       }
//     }
//   };

//   const handleChange = (e) => {
//     const { id, value } = e.target;
//     setErrors({ ...errors, [id]: "" }); // Clear error for the specific field
//     setCourseData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   return (
//     <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={title}>
//       <div>
//         <div className="form-group">
//           <label htmlFor="title" className="label-text">Title:</label>
//           <input
//             type="text"
//             id="title"
//             value={courseData.title}
//             onChange={handleChange}
//             autoComplete="off"
//             required
//           />
//           {errors.title && <div className="error-text">{errors.title}</div>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="description" className="label-text">Description:</label>
//           <input
//             type="text"
//             id="description"
//             value={courseData.description}
//             onChange={handleChange}
//             autoComplete="off"
//             required
//           />
//           {errors.description && <div className="error-text">{errors.description}</div>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="ownerId" className="label-text">Owner ID:</label>
//           <input
//             type="text"
//             id="ownerId"
//             value={courseData.ownerId}
//             onChange={(e) =>
//               handleChange({ target: { id: "ownerId", value: e.target.value.trim() } })
//             }
//             autoComplete="off"
//             required
//           />
//           {errors.ownerId && <div className="error-text">{errors.ownerId}</div>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="courseLevel" className="label-text">Course Level:</label>
//           <select
//             id="courseLevel"
//             value={courseData.courseLevel}
//             onChange={handleChange}
//             required
//           >
//             <option value="" disabled>Select Course Level</option>
//             <option value="BEGINNER">Beginner</option>
//             <option value="INTERMEDIATE">Intermediate</option>
//             <option value="PROFESSIONAL">Professional</option>
//           </select>
//           {errors.courseLevel && <div className="error-text">{errors.courseLevel}</div>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="isActive" className="label-text">Is Active:</label>
//           <select
//             id="isActive"
//             value={courseData.isActive}
//             onChange={(e) =>
//               handleChange({ target: { id: "isActive", value: e.target.value } })
//             }
//             required
//           >
//             <option value="" disabled>Select Status</option>
//             <option value="true">True</option>
//             <option value="false">False</option>
//           </select>
//           {errors.isActive && <div className="error-text">{errors.isActive}</div>}
//         </div>

//         <div className="modal-button">
//           {!selectedCourse && (
//             <Button onClick={handleCreateCourse} type="submit" text={"Add"} />
//           )}
//           {selectedCourse && (
//             <Button onClick={handleEdit} type="submit" text={"Edit"} />
//           )}
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default CoursesModal;


import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Select,
  Form,
} from "antd";
import { createCourse, updateCourse } from "../../../service/BookService";
import {
  validateMinLength,
  validateNotEmpty,
} from "../../../utility/validation";

const { Option } = Select;

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
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalOpen) {
      if (selectedCourse) {
        form.setFieldsValue({
          title: selectedCourse.title,
          description: selectedCourse.description,
          ownerId: selectedCourse.ownerId,
          courseLevel: selectedCourse.level || "",
          isActive: selectedCourse.active ? "true" : "false",
        });
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, selectedCourse, form]);

  const handleSubmit = async (values) => {
    const coursePayload = {
      title: values.title,
      ownerId: parseInt(values.ownerId, 10),
      description: values.description,
      courseLevel: values.courseLevel,
      image: "",
      active: values.isActive === "true",
    };

    setLoading(true);
    try {
      if (selectedCourse) {
        const res = await updateCourse(selectedCourse.courseId, coursePayload);
        setToastMessage(res?.message || "Course updated successfully!");
      } else {
        await createCourse(coursePayload);
        setToastMessage("Course added successfully!");
      }

      setToastType("success");
      setShowToast(true);
      await loadCourses();
    } catch (error) {
      setToastMessage(error?.message || "Something went wrong!");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const validateForm = (rule, value) => {
    if (!validateNotEmpty(value)) {
      return Promise.reject("This field is required!");
    }
    if (rule.field === "title" && !validateMinLength(value, 3)) {
      return Promise.reject("Title should be at least 3 characters!");
    }
    if (rule.field === "ownerId" && isNaN(value)) {
      return Promise.reject("Owner ID must be numeric!");
    }
    return Promise.resolve();
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCloseModal}
      onOk={() => form.submit()}
      title={title}
      okText={selectedCourse ? "Edit" : "Add"}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Title is required!" },
            { validator: validateForm },
          ]}
        >
          <Input placeholder="Enter course title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Description is required!" },
            { validator: validateForm },
          ]}
        >
          <Input placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          label="Owner ID"
          name="ownerId"
          rules={[
            { required: true, message: "Owner ID is required!" },
            { validator: validateForm },
          ]}
        >
          <Input placeholder="Enter owner ID" />
        </Form.Item>

        <Form.Item
          label="Course Level"
          name="courseLevel"
          rules={[
            { required: true, message: "Course level is required!" },
            { validator: validateForm },
          ]}
        >
          <Select placeholder="Select course level">
            <Option value="BEGINNER">Beginner</Option>
            <Option value="INTERMEDIATE">Intermediate</Option>
            <Option value="PROFESSIONAL">Professional</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Is Active"
          name="isActive"
          rules={[
            { required: true, message: "Active status is required!" },
            { validator: validateForm },
          ]}
        >
          <Select placeholder="Select status">
            <Option value="true">True</Option>
            <Option value="false">False</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CoursesModal;
