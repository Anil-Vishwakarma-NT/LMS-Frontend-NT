import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Radio,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
  Space,
  Divider,
  Alert,
  Typography,
  Checkbox
} from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined, AppstoreOutlined } from '@ant-design/icons';
import enrollmentService from '../../../service/enrollmentService';

const { Option } = Select;
const { Text } = Typography;

const AddEnrollmentModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [enrollmentType, setEnrollmentType] = useState('user');
  const [contentType, setContentType] = useState('course');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State for enrollment options
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableBundles, setAvailableBundles] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);

  // Fetch data for enrollment modal
  const fetchEnrollmentOptions = async () => {
    setLoading(true);
    
    try {
      console.log('🔄 Starting to fetch enrollment options...');
      
      // Fetch data from the APIs using the enrollment service methods
      const [
        usersResponse,
        groupsResponse,
        coursesResponse,
        bundlesResponse
      ] = await Promise.all([
        enrollmentService.getAllEmployees().catch(err => {
          console.error('❌ Users API failed:', err);
          return { status: 'ERROR', message: err.message, data: [] };
        }),
        enrollmentService.getAllGroups().catch(err => {
          console.error('❌ Groups API failed:', err);
          return { status: 'ERROR', message: err.message, data: [] };
        }),
        enrollmentService.getAllCourses().catch(err => {
          console.error('❌ Courses API failed:', err);
          return { status: 'ERROR', message: err.message, data: [] };
        }),
        enrollmentService.getAllBundles().catch(err => {
          console.error('❌ Bundles API failed:', err);
          return { status: 'ERROR', message: err.message, data: [] };
        })
      ]);

      console.log("📥 Raw API Responses:", {
        usersResponse,
        groupsResponse,
        coursesResponse,
        bundlesResponse
      });

      // Extract data from the standardized response format with fallbacks
      let usersData = [];
      let groupsData = [];
      let coursesData = [];
      let bundlesData = [];

      // Handle users data
      try {
        if (enrollmentService.isSuccess && enrollmentService.isSuccess(usersResponse)) {
          usersData = enrollmentService.extractData(usersResponse) || [];
        } else if (usersResponse && Array.isArray(usersResponse)) {
          usersData = usersResponse;
        } else if (usersResponse && usersResponse.data && Array.isArray(usersResponse.data)) {
          usersData = usersResponse.data;
        }
        console.log('👥 Extracted users data:', usersData);
      } catch (err) {
        console.error('❌ Error processing users data:', err);
      }

      // Handle groups data
      try {
        if (enrollmentService.isSuccess && enrollmentService.isSuccess(groupsResponse)) {
          groupsData = enrollmentService.extractData(groupsResponse) || [];
        } else if (groupsResponse && Array.isArray(groupsResponse)) {
          groupsData = groupsResponse;
        } else if (groupsResponse && groupsResponse.data && Array.isArray(groupsResponse.data)) {
          groupsData = groupsResponse.data;
        }
        console.log('👫 Extracted groups data:', groupsData);
      } catch (err) {
        console.error('❌ Error processing groups data:', err);
      }

      // Handle courses data
      try {
        if (enrollmentService.isSuccess && enrollmentService.isSuccess(coursesResponse)) {
          coursesData = enrollmentService.extractData(coursesResponse) || [];
        } else if (coursesResponse && Array.isArray(coursesResponse)) {
          coursesData = coursesResponse;
        } else if (coursesResponse && coursesResponse.data && Array.isArray(coursesResponse.data)) {
          coursesData = coursesResponse.data;
        }
        console.log('📚 Extracted courses data:', coursesData);
      } catch (err) {
        console.error('❌ Error processing courses data:', err);
      }

      // Handle bundles data
      try {
        if (enrollmentService.isSuccess && enrollmentService.isSuccess(bundlesResponse)) {
          bundlesData = enrollmentService.extractData(bundlesResponse) || [];
        } else if (bundlesResponse && Array.isArray(bundlesResponse)) {
          bundlesData = bundlesResponse;
        } else if (bundlesResponse && bundlesResponse.data && Array.isArray(bundlesResponse.data)) {
          bundlesData = bundlesResponse.data;
        }
        console.log('📦 Extracted bundles data:', bundlesData);
      } catch (err) {
        console.error('❌ Error processing bundles data:', err);
      }

      // Format users data with flexible field mapping
      const formattedUsers = usersData.map(user => {
        const userId = user.userId || user.id || user.user_id;
        const firstName = user.firstName || user.first_name || user.fname || '';
        const lastName = user.lastName || user.last_name || user.lname || '';
        const email = user.email || user.emailAddress || '';
        const username = user.username || user.userName || '';
        
        return {
          id: userId,
          name: `${firstName} ${lastName}`.trim() || username || email || `User ${userId}`,
          email: email,
          username: username,
          role: user.role || user.userRole || '',
          manager: user.manager || user.managerId || ''
        };
      }).filter(user => user.id); // Filter out users without IDs

      // Format groups data with flexible field mapping
      const formattedGroups = groupsData.map(group => {
        const groupId = group.groupId || group.id || group.group_id;
        const groupName = group.groupName || group.name || group.group_name || `Group ${groupId}`;
        
        return {
          id: groupId,
          name: groupName,
          description: group.description || group.desc || '',
          isActive: group.isActive !== undefined ? group.isActive : true
        };
      }).filter(group => group.id); // Filter out groups without IDs

      // Format courses data with flexible field mapping and filtering
      let formattedCourses = coursesData.map(course => {
        const courseId = course.courseId || course.id || course.course_id;
        const title = course.title || course.courseName || course.name || course.course_name || `Course ${courseId}`;
        
        return {
          id: courseId,
          name: title,
          description: course.description || course.desc || '',
          level: course.level || course.difficulty || '',
          duration: course.duration || course.durationHours || '',
          isActive: course.isActive !== undefined ? course.isActive : true,
          status: course.status || 'ACTIVE'
        };
      }).filter(course => course.id); // Filter out courses without IDs

      // Apply course filtering if available
      if (enrollmentService.filterActiveCourses && typeof enrollmentService.filterActiveCourses === 'function') {
        try {
          formattedCourses = enrollmentService.filterActiveCourses(coursesData).map(course => ({
            id: course.courseId || course.id,
            name: course.title || course.courseName || course.name,
            description: course.description || '',
            level: course.level || '',
            duration: course.duration || course.durationHours || ''
          }));
        } catch (err) {
          console.warn('⚠️ filterActiveCourses failed, using manual filtering');
          formattedCourses = formattedCourses.filter(course => 
            course.isActive && (course.status === 'ACTIVE' || !course.status)
          );
        }
      } else {
        formattedCourses = formattedCourses.filter(course => 
          course.isActive && (course.status === 'ACTIVE' || !course.status)
        );
      }

      // Format bundles data with flexible field mapping and filtering
      let formattedBundles = bundlesData.map(bundle => {
        const bundleId = bundle.bundleId || bundle.id || bundle.bundle_id;
        const bundleName = bundle.bundleName || bundle.name || bundle.bundle_name || `Bundle ${bundleId}`;
        
        return {
          id: bundleId,
          name: bundleName,
          description: bundle.description || bundle.desc || '',
          isActive: bundle.isActive !== undefined ? bundle.isActive : true,
          status: bundle.status || 'ACTIVE'
        };
      }).filter(bundle => bundle.id); // Filter out bundles without IDs

      // Apply bundle filtering if available
      if (enrollmentService.filterActiveBundles && typeof enrollmentService.filterActiveBundles === 'function') {
        try {
          formattedBundles = enrollmentService.filterActiveBundles(bundlesData).map(bundle => ({
            id: bundle.bundleId || bundle.id,
            name: bundle.bundleName || bundle.name,
            description: bundle.description || ''
          }));
        } catch (err) {
          console.warn('⚠️ filterActiveBundles failed, using manual filtering');
          formattedBundles = formattedBundles.filter(bundle => 
            bundle.isActive && (bundle.status === 'ACTIVE' || !bundle.status)
          );
        }
      } else {
        formattedBundles = formattedBundles.filter(bundle => 
          bundle.isActive && (bundle.status === 'ACTIVE' || !bundle.status)
        );
      }

      console.log("✅ Final Formatted Data:", {
        formattedUsers: formattedUsers.length,
        formattedGroups: formattedGroups.length,
        formattedCourses: formattedCourses.length,
        formattedBundles: formattedBundles.length
      });

      setAvailableUsers(formattedUsers);
      setAvailableGroups(formattedGroups);
      setAvailableCourses(formattedCourses);
      setAvailableBundles(formattedBundles);

      // Show success message with counts
      const totalItems = formattedUsers.length + formattedGroups.length + formattedCourses.length + formattedBundles.length;
      if (totalItems > 0) {
        message.success(`Loaded ${formattedUsers.length} users, ${formattedGroups.length} groups, ${formattedCourses.length} courses, ${formattedBundles.length} bundles`);
      } else {
        message.warning('No data loaded. Please check the API responses.');
      }

    } catch (error) {
      console.error('💥 Error fetching enrollment options:', error);
      
      // Enhanced error message handling
      let errorMessage = 'Failed to fetch enrollment options';
      
      if (error.response && error.response.data) {
        // Check for different error response formats
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      console.log('🚀 Modal opened, fetching data...');
      fetchEnrollmentOptions();
      // Reset form when modal opens
      form.resetFields();
      setEnrollmentType('user');
      setContentType('course');
    }
  }, [visible, form]);

  const handleEnrollmentTypeChange = (e) => {
    const newType = e.target.value;
    setEnrollmentType(newType);
    // Clear the entity selection when type changes
    form.setFieldsValue({ entityId: undefined });
  };

  const handleContentTypeChange = (e) => {
    const newType = e.target.value;
    setContentType(newType);
    // Clear the content selection when type changes
    form.setFieldsValue({ contentId: undefined });
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // Get current user ID (this should come from your auth context)
      const currentUserId = 6; // Replace with actual current user ID from auth context
      
      // Format enrollment data according to the required API format
      const enrollmentData = {
        assignedBy: currentUserId,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DDTHH:mm:ss') : null,
        status: 'ACTIVE'
      };

      // Add user or group IDs based on enrollment type
      if (enrollmentType === 'user') {
        enrollmentData.userIds = Array.isArray(values.entityId) 
          ? values.entityId 
          : [values.entityId];
      } else {
        enrollmentData.groupIds = Array.isArray(values.entityId) 
          ? values.entityId 
          : [values.entityId];
      }

      // Add course or bundle IDs based on content type
      if (contentType === 'course') {
        enrollmentData.courseIds = Array.isArray(values.contentId) 
          ? values.contentId 
          : [values.contentId];
      } else {
        enrollmentData.bundleIds = Array.isArray(values.contentId) 
          ? values.contentId 
          : [values.contentId];
      }

      console.log('📤 Enrollment data to be sent:', enrollmentData);

      // Validate the enrollment data if validation method exists
      if (enrollmentService.validateEnrollmentData) {
        const validation = enrollmentService.validateEnrollmentData(enrollmentData);
        if (!validation.isValid) {
          message.error('Validation failed: ' + validation.errors.join(', '));
          return;
        }
      }

      // Call the enroll method
      const response = await enrollmentService.enroll(enrollmentData);
      
      if (enrollmentService.isSuccess && enrollmentService.isSuccess(response)) {
        const successMessage = enrollmentService.getMessage ? enrollmentService.getMessage(response) : null || 
          `Successfully enrolled ${enrollmentType === 'user' ? 'user(s)' : 'group(s)'} in ${contentType === 'course' ? 'course(s)' : 'bundle(s)'}!`;
        
        message.success(successMessage);
        
        // Reset form and close modal
        form.resetFields();
        setEnrollmentType('user');
        setContentType('course');
        
        // Call the callback to refresh dashboard data
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorMessage = enrollmentService.getMessage ? enrollmentService.getMessage(response) : null || 'Enrollment failed';
        message.error(errorMessage);
      }
    } catch (error) {
      console.error('💥 Error creating enrollment:', error);
      
      // Enhanced error message handling for enrollment submission
      let errorMessage = 'Failed to create enrollment';
      
      if (error.response && error.response.data) {
        // Check for different error response formats
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Also check if it's a backend error using the service method
      if (enrollmentService.isBackendError && enrollmentService.isBackendError(error)) {
        errorMessage = enrollmentService.formatErrorMessage(error);
      }
      
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setEnrollmentType('user');
    setContentType('course');
    onCancel();
  };

  const getUserDisplayText = (user) => {
    return `${user.name} (${user.email || user.username || 'No email'})${user.role ? ` - ${user.role}` : ''}`;
  };

  const getGroupDisplayText = (group) => {
    return `${group.name}${group.description ? ` - ${group.description}` : ''}`;
  };

  const getCourseDisplayText = (course) => {
    return `${course.name}${course.level ? ` (${course.level})` : ''}${course.duration ? ` - ${course.duration}h` : ''}`;
  };

  const getBundleDisplayText = (bundle) => {
    return `${bundle.name}${bundle.description ? ` - ${bundle.description}` : ''}`;
  };

  return (
    <Modal
      title={
        <Space>
          <BookOutlined />
          Add New Enrollment
        </Space>
      }
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose={true}
      maskClosable={false}
      width={700}
    >
      <Spin spinning={loading} tip="Loading enrollment options...">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ 
            enrollmentType: 'user', 
            contentType: 'course' 
          }}
        >
          {/* Enrollment Type Selection */}
          <Form.Item
            name="enrollmentType"
            label={
              <Space>
                <UserOutlined />
                <Text strong>Enrollment Target</Text>
              </Space>
            }
            rules={[{ required: true, message: 'Please select an enrollment type!' }]}
          >
            <Radio.Group 
              onChange={handleEnrollmentTypeChange} 
              value={enrollmentType}
              size="large"
            >
              <Radio.Button value="user">
                <Space>
                  <UserOutlined />
                  Individual User ({availableUsers.length})
                </Space>
              </Radio.Button>
              <Radio.Button value="group">
                <Space>
                  <TeamOutlined />
                  Group ({availableGroups.length})
                </Space>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* User/Group Selection */}
          <Form.Item
            name="entityId"
            label={
              <Space>
                {enrollmentType === 'user' ? <UserOutlined /> : <TeamOutlined />}
                <Text strong>
                  Select {enrollmentType === 'user' ? 'User(s)' : 'Group(s)'} 
                  ({enrollmentType === 'user' ? availableUsers.length : availableGroups.length} available)
                </Text>
              </Space>
            }
            rules={[{ required: true, message: `Please select a ${enrollmentType}!` }]}
          >
            <Select 
              placeholder={`Select ${enrollmentType === 'user' ? 'user(s)' : 'group(s)'}`}
              showSearch
              mode="multiple"
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              maxTagCount="responsive"
              notFoundContent={
                loading ? <Spin size="small" /> : 
                `No ${enrollmentType === 'user' ? 'users' : 'groups'} available`
              }
            >
              {enrollmentType === 'user' ?
                availableUsers.map(user => (
                  <Option 
                    key={user.id} 
                    value={user.id}
                    label={getUserDisplayText(user)}
                  >
                    <div>
                      <Text strong>{user.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {user.email || user.username || 'No email'} {user.role && `• ${user.role}`}
                      </Text>
                    </div>
                  </Option>
                )) :
                availableGroups.map(group => (
                  <Option 
                    key={group.id} 
                    value={group.id}
                    label={getGroupDisplayText(group)}
                  >
                    <div>
                      <Text strong>{group.name}</Text>
                      {group.description && (
                        <>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {group.description}
                          </Text>
                        </>
                      )}
                    </div>
                  </Option>
                ))
              }
            </Select>
          </Form.Item>

          <Divider />

          {/* Content Type Selection */}
          <Form.Item
            name="contentType"
            label={
              <Space>
                <BookOutlined />
                <Text strong>Content Type</Text>
              </Space>
            }
            rules={[{ required: true, message: 'Please select a content type!' }]}
          >
            <Radio.Group 
              onChange={handleContentTypeChange} 
              value={contentType}
              size="large"
            >
              <Radio.Button value="course">
                <Space>
                  <BookOutlined />
                  Course ({availableCourses.length})
                </Space>
              </Radio.Button>
              <Radio.Button value="bundle">
                <Space>
                  <AppstoreOutlined />
                  Bundle ({availableBundles.length})
                </Space>
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* Course/Bundle Selection */}
          <Form.Item
            name="contentId"
            label={
              <Space>
                {contentType === 'course' ? <BookOutlined /> : <AppstoreOutlined />}
                <Text strong>
                  Select {contentType === 'course' ? 'Course(s)' : 'Bundle(s)'}
                  ({contentType === 'course' ? availableCourses.length : availableBundles.length} available)
                </Text>
              </Space>
            }
            rules={[{ required: true, message: `Please select a ${contentType}!` }]}
          >
            <Select 
              placeholder={`Select ${contentType === 'course' ? 'course(s)' : 'bundle(s)'}`}
              showSearch
              mode="multiple"
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              maxTagCount="responsive"
              notFoundContent={
                loading ? <Spin size="small" /> : 
                `No ${contentType === 'course' ? 'courses' : 'bundles'} available`
              }
            >
              {contentType === 'course' ?
                availableCourses.map(course => (
                  <Option 
                    key={course.id} 
                    value={course.id}
                    label={getCourseDisplayText(course)}
                  >
                    <div>
                      <Text strong>{course.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {course.level && `Level: ${course.level}`}
                        {course.duration && ` • Duration: ${course.duration}h`}
                      </Text>
                    </div>
                  </Option>
                )) :
                availableBundles.map(bundle => (
                  <Option 
                    key={bundle.id} 
                    value={bundle.id}
                    label={getBundleDisplayText(bundle)}
                  >
                    <div>
                      <Text strong>{bundle.name}</Text>
                      {bundle.description && (
                        <>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {bundle.description}
                          </Text>
                        </>
                      )}
                    </div>
                  </Option>
                ))
              }
            </Select>
          </Form.Item>

          {/* Deadline Selection */}
          <Form.Item
    name="deadline"
    label={
      <Space>
        <Text strong>Deadline</Text>
      </Space>
    }
    rules={[
      { required: true, message: 'Please select a deadline!' }
    ]}
  >
    <DatePicker 
      style={{ width: '100%' }} 
      showTime={{ format: 'HH:mm' }}
      format="YYYY-MM-DD HH:mm"
      placeholder="Select deadline"
    />
  </Form.Item>

          {/* Information Alert */}
          <Alert
    message="Enrollment Information"
    description={
      <div>
        <Text>
          • You can select multiple {enrollmentType === 'user' ? 'users' : 'groups'} and {contentType === 'course' ? 'courses' : 'bundles'}
        </Text>
        <br />
        <Text>
          • Deadline is required for all enrollments
        </Text>
      </div>
    }
    type="info"
    showIcon
    style={{ marginBottom: 16 }}
  />

          {/* Submit Buttons */}
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                disabled={loading}
              >
                {submitting ? 'Creating Enrollment...' : 'Create Enrollment'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default AddEnrollmentModal;