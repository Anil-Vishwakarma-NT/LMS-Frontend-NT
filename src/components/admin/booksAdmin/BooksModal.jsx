import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Form, message } from "antd";
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
      isActive: values.isActive === "true",
    };

    setLoading(true);
    try {
      if (selectedCourse) {
        const res = await updateCourse(selectedCourse.courseId, coursePayload);
        message.success(res?.message || "Course updated successfully!");
      } else {
        await createCourse(coursePayload);
        message.success("Course added successfully!");
      }

      await loadCourses();
    } catch (error) {
      message.error(error?.message || "Something went wrong!");
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
