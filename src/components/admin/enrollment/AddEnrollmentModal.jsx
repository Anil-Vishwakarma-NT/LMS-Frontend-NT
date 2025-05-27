import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Radio,
  Select,
  DatePicker,
  Button,
  message
} from 'antd';
import EnrollmentService from './enrollmentService';

const { Option } = Select;

const AddEnrollmentModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [enrollmentType, setEnrollmentType] = useState('user');
  const [contentType, setContentType] = useState('course');
  
  // State for enrollment options
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableBundles, setAvailableBundles] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);
  
  // Fetch data for enrollment modal
  const fetchEnrollmentOptions = async () => {
    try {
      // Fetch data from the APIs provided in the service file
      const [
        usersResponse,
        groupsResponse,
        coursesResponse
        
      ] = await Promise.all([
        EnrollmentService.fetchActiveEmployees(),
        EnrollmentService.fetchAllGroups(),
        EnrollmentService.fetchAllCourses()
        
      ]);
      
      // Format users data - only userId and full name
      const formattedUsers = usersResponse?.map(user => ({
        id: user.userId,
        name: `${user.firstName} ${user.lastName}`
      })) || [];
      
      // Format groups data - only groupId and group name
      const formattedGroups = groupsResponse?.map(group => ({
        id: group.groupId,
        name: group.groupName
      })) || [];
      
      // Format courses data - only courseId and title
      const formattedCourses = coursesResponse?.map(course => ({
        id: course.courseId,
        name: course.title
      })) || [];
      
      // // Format bundles data - only bundleId and bundleName
      // const formattedBundles = bundlesResponse?.map(bundle => ({
      //   id: bundle.bundleId,
      //   name: bundle.bundleName
      // })) || [];
      
      setAvailableUsers(formattedUsers);
      setAvailableGroups(formattedGroups);
      setAvailableCourses(formattedCourses);
      // setAvailableBundles(formattedBundles);
    } catch (error) {
      message.error('Failed to fetch enrollment options');
      console.error('Error fetching enrollment options:', error);
    }
  };
  
  useEffect(() => {
    if (visible) {
      fetchEnrollmentOptions();
    }
  }, [visible]);

  const handleEnrollmentTypeChange = (e) => {
    setEnrollmentType(e.target.value);
  };

  const handleContentTypeChange = (e) => {
    setContentType(e.target.value);
  };

  const handleSubmit = async (values) => {
    try {
      // Format enrollment data according to the required API format
      const enrollmentData = {
        userId: values.enrollmentType === 'user' ? values.entityId : null,
        groupId: values.enrollmentType === 'group' ? values.entityId : null,
        courseId: values.contentType === 'course' ? values.contentId : null,
        // bundleId: values.contentType === 'bundle' ? values.contentId : null,
        deadline: values.deadline.format('YYYY-MM-DDThh:mm:ss'),
        assignedBy: 1 // This should be the ID of the user doing the assignment, possibly get from auth context
      };
      
      await EnrollmentService.createEnrollment(enrollmentData);
      message.success(`New ${values.contentType} enrollment created successfully!`);
      form.resetFields();
      onSuccess(); // Call the callback to refresh dashboard data
    } catch (error) {
      message.error('Failed to create enrollment');
      console.error('Error creating enrollment:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Add New Enrollment"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
        initialValues={{ enrollmentType: 'user', contentType: 'course' }}
      >
        {/* Enrollment Type Selection */}
        <Form.Item
          name="enrollmentType"
          label="Enrollment Type"
          rules={[{ required: true, message: 'Please select an enrollment type!' }]}
        >
          <Radio.Group onChange={handleEnrollmentTypeChange} value={enrollmentType}>
            <Radio value="user">User</Radio>
            <Radio value="group">Group</Radio>
          </Radio.Group>
        </Form.Item>
        
        {/* User/Group Selection */}
        <Form.Item
          name="entityId"
          label={enrollmentType === 'user' ? 'Select User' : 'Select Group'}
          rules={[{ required: true, message: `Please select a ${enrollmentType}!` }]}
        >
          <Select placeholder={`Select a ${enrollmentType}`}>
            {enrollmentType === 'user' ? 
              availableUsers.map(user => (
                <Option key={user.id} value={user.id}>{user.name}</Option>
              )) : 
              availableGroups.map(group => (
                <Option key={group.id} value={group.id}>{group.name}</Option>
              ))
            }
          </Select>
        </Form.Item>
        
        {/* Content Type Selection */}
        <Form.Item
          name="contentType"
          label="Content Type"
          rules={[{ required: true, message: 'Please select a content type!' }]}
        >
          <Radio.Group onChange={handleContentTypeChange} value={contentType}>
            <Radio value="course">Course</Radio>
            <Radio value="bundle">Bundle</Radio>
          </Radio.Group>
        </Form.Item>
        
        {/* Course/Bundle Selection */}
        <Form.Item
          name="contentId"
          label={contentType === 'course' ? 'Select Course' : 'Select Bundle'}
          rules={[{ required: true, message: `Please select a ${contentType}!` }]}
        >
          <Select placeholder={`Select a ${contentType}`}>
            {contentType === 'course' ? 
              availableCourses.map(course => (
                <Option key={course.id} value={course.id}>{course.name}</Option>
              )) : 
              availableBundles.map(bundle => (
                <Option key={bundle.id} value={bundle.id}>{bundle.name}</Option>
              ))
            }
          </Select>
        </Form.Item>
        
        {/* Deadline Selection */}
        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: 'Please select a deadline!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        
        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Create Enrollment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEnrollmentModal;