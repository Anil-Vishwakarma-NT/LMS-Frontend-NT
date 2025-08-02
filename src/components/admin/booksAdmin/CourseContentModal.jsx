import React, { useEffect, useState } from "react";
import { Modal, Input, Select, Form, Button, message } from "antd";
import {
  updateCourseContent,
  createCourseContent,
  createCourseContentUrl,
  updateCourseContentUrl,
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
  const [contentType, setContentType] = useState("");
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");

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
          isActive: selectedContent.active ? "true" : "false",
        });
        setContentType(selectedContent.contentType || "");
        
        // Set existing values based on content type
        if (selectedContent.contentType === "youtube-link") {
          setYoutubeUrl(selectedContent.youtubeUrl || "");
        }
      } else {
        form.resetFields();
        setFile(null);
        setYoutubeUrl("");
        setContentType("");
      }
    }
  }, [isModalOpen, selectedContent, form]);

  // Reset file/url when content type changes
  const handleContentTypeChange = (value) => {
    setContentType(value);
    setFile(null);
    setYoutubeUrl("");
  };

  const handleSaveChanges = async () => {
    try {
      const values = await form.validateFields();
      
      // Validate based on content type
      if (contentType === "youtube-link") {
        if (!youtubeUrl.trim()) {
          message.error("YouTube URL is required!");
          return;
        }
      } else {
        if (!selectedContent && !file) {
          message.error("File is required for new content!");
          return;
        }
      }

      setLoading(true);

      let response;
      
      if (contentType === "youtube-link") {
        // Handle YouTube link - send as JSON to same endpoint
        const urlPayload = {
          courseId: parseInt(courseId),
          title: values.title,
          description: values.description,
          isActive: values.isActive === "true",
          contentType: contentType,
          youtubeUrl: youtubeUrl
        };

        if (selectedContent?.courseContentId) {
          response = await updateCourseContent(selectedContent.courseContentId, urlPayload);
          message.success("Course content updated successfully!");
        } else {
          response = await createCourseContent(urlPayload);
          message.success("New YouTube content added successfully!");
        }
      } else {
        // Handle file upload - send as FormData to same endpoint
        const formData = new FormData();
        formData.append("courseId", courseId);
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("isActive", values.isActive === "true");
        formData.append("contentType", contentType);
        
        if (file) {
          console.log("FILE ADDED", file);
          formData.append("file", file);
        }

        if (selectedContent?.courseContentId) {
          response = await updateCourseContent(selectedContent.courseContentId, formData);
          message.success("Course content updated successfully!");
        } else {
          response = await createCourseContent(formData);
          message.success("New course content added successfully!");
        }
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

  const renderFileInput = () => {
    if (contentType === "youtube-link") {
      return (
        <Form.Item
          label="YouTube URL"
          required
          help="Enter the complete YouTube URL"
        >
          <Input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            autoComplete="off"
          />
        </Form.Item>
      );
    }

    if (contentType) {
      const getAcceptTypes = () => {
        switch (contentType) {
          case "video":
            return "video/*";
          case "pdf":
            return "application/pdf";
          default:
            return ".doc,.docx,.ppt,.pptx,.txt";
        }
      };

      return (
        <Form.Item
          label={`Upload ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`}
          required={!selectedContent}
          help={
            contentType === "video" 
              ? "Upload video files (mp4, avi, mov, etc.)"
              : contentType === "pdf"
              ? "Upload PDF documents only"
              : "Upload documents (doc, docx, ppt, pptx, txt)"
          }
        >
          <Input
            type="file"
            accept={getAcceptTypes()}
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && (
            <div style={{ marginTop: 8, color: '#52c41a' }}>
              Selected: {file.name}
            </div>
          )}
        </Form.Item>
      );
    }

    return null;
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
      width={600}
    >
      <Form form={form} layout="vertical" name="course_content_form">
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Title is required!" },
            { min: 3, message: "Title must be at least 3 characters!" },
            { max: 100, message: "Title cannot exceed 100 characters!" },
          ]}
        >
          <Input autoComplete="off" placeholder="Enter content title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Description is required!" },
            { max: 1000, message: "Description cannot exceed 1000 characters!" },
          ]}
        >
          <Input.TextArea 
            autoComplete="off" 
            placeholder="Enter content description"
            rows={4}
            showCount
            maxLength={1000}
          />
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

        <Form.Item
          label="Content Type"
          required
          tooltip="Choose the type of content to upload"
        >
          <Select
            placeholder="Select content type"
            value={contentType}
            onChange={handleContentTypeChange}
          >
            <Option value="video">S3 Video</Option>
            <Option value="pdf">PDF</Option>
            <Option value="youtube-link">YouTube Link</Option>
          </Select>
        </Form.Item>

        {renderFileInput()}
      </Form>
    </Modal>
  );
};

export default CourseContentModal;