import React, { useEffect, useState } from "react";
import { Modal, Input, Select, Form, Button, message } from "antd";
import {
  updateCourseContent,
  createCourseContent,
  fetchCourseById,
} from "../../../service/BookService";

const { Option } = Select;

const CourseContentModal = ({
  isModalOpen,
  handleCloseModal,
  selectedContent,
  setLoading,
  loadContent,
  courseId,
}) => {
  const [form] = Form.useForm();
  const [courseName, setCourseName] = useState("");

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

    if (isModalOpen) {
      loadCourseName();
    }
  }, [courseId, isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      if (selectedContent) {
        form.setFieldsValue({
          title: selectedContent.title || "",
          description: selectedContent.description || "",
          resourceLink: selectedContent.resourceLink || "",
          isActive: selectedContent.active ? "true" : "false",
        });
      } else {
        form.resetFields();
      }
    }
  }, [isModalOpen, selectedContent, form]);

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const requestData = {
        courseId: courseId,
        title: values.title,
        description: values.description,
        resourceLink: values.resourceLink,
        active: values.isActive === "true",
      };

      if (selectedContent?.courseContentId) {
        await updateCourseContent(selectedContent.courseContentId, requestData);
        message.success("Course content updated successfully!");
      } else {
        await createCourseContent(requestData);
        message.success("New course content added successfully!");
      }

      loadContent();
      handleCloseModal();
    } catch (error) {
      if (!error.errorFields) {
        console.error("Error saving course content:", error);
        message.error("Failed to save course content.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        selectedContent
          ? `Edit Content for "${courseName}"`
          : `Add Content for "${courseName}"`
      }
      visible={isModalOpen}
      onCancel={handleCloseModal}
      footer={[
        <Button key="cancel" onClick={handleCloseModal}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSaveChanges}>
          {selectedContent ? "Edit" : "Add"}
        </Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="course_content_form">
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Title is required!" },
            { min: 3, message: "Title must be at least 3 characters!" },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required!" }]}
        >
          <Input.TextArea autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Resource Link"
          name="resourceLink"
          rules={[
            { required: true, message: "Resource Link is required!" },
            {
              pattern: /^https?:\/\/.*$/,
              message: "Invalid Resource Link format!",
            },
          ]}
        >
          <Input autoComplete="off" type="url" />
        </Form.Item>

        <Form.Item
          label="Is Active"
          name="isActive"
          rules={[{ required: true, message: "Status is required!" }]}
        >
          <Select placeholder="Select Status">
            <Option value="true">Active</Option>
            <Option value="false">Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseContentModal;

