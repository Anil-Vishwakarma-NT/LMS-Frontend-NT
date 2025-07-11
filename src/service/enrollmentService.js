import {app} from './serviceLMS'; 
/**
 * Enrollment Service
 * Provides methods to interact with enrollment-related API endpoints
 * Uses the same axios instances and interceptors from serviceLMS
 */
const enrollmentService = {
  
  /**
   * Enroll users/groups in courses/bundles
   * @param {Object} enrollmentData - Enrollment request data
   * @param {number} enrollmentData.assignedBy - ID of user assigning the enrollment
   * @param {number[]} [enrollmentData.userIds] - Array of user IDs to enroll
   * @param {number[]} [enrollmentData.groupIds] - Array of group IDs to enroll
   * @param {number[]} [enrollmentData.courseIds] - Array of course IDs
   * @param {number[]} [enrollmentData.bundleIds] - Array of bundle IDs
   * @param {string} [enrollmentData.deadline] - Deadline in ISO format
   * @param {string} [enrollmentData.status='ACTIVE'] - Enrollment status
   * @param {boolean} [enrollmentData.forceEnrollment=false] - Force enrollment even if conflicts exist
   * @param {boolean} [enrollmentData.groupEnrollmentOnly=false] - Skip individual enrollments for groups
   * @returns {Promise<{status: string, message: string, data: Array<{enrollmentId: number, userId: number, groupId: number, courseId: number, bundleId: number, assignedBy: number, assignedAt: string, deadline: string, status: string, enrollmentSource: string, parentEnrollmentId: number, startedAt: string, completedAt: string, progressPercentage: number, createdAt: string, updatedAt: string, isActive: boolean}>}>} Standard response with enrollment data
   */
  async enroll(enrollmentData) {
    try {
      const response = await app.post('user/api/client-api/enrollment/enroll', enrollmentData);
      return response.data;
    } catch (error) {
      console.error('Error enrolling users:', error);
      throw error;
    }
  },

  /**
   * Get enrollment statistics for dashboard
   * @returns {Promise<{status: string, message: string, data: {totalEnrollments: number, activeEnrollments: number, inactiveEnrollments: number, pendingEnrollments: number, inProgressEnrollments: number, completedEnrollments: number, expiredEnrollments: number, individualEnrollments: number, groupEnrollments: number, bundleEnrollments: number, groupBundleEnrollments: number, totalUniqueUsers: number, totalUniqueCourses: number, totalUniqueBundles: number, totalUniqueGroups: number, overallCompletionRate: number, individualCompletionRate: number, groupCompletionRate: number, bundleCompletionRate: number, recentEnrollments: number, recentCompletions: number, statusDistribution: Object<string, number>, sourceDistribution: Object<string, number>}}>} Standard response with enrollment statistics
   */
  async getEnrollmentStatistics() {
    try {
      const response = await app.get('user/api/client-api/enrollment/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment statistics:', error);
      throw error;
    }
  },

  /**
   * Get all active employees
   * @returns {Promise<{status: string, message: string, data: Array<{userId: number, username: string, firstName: string, lastName: string, email: string, manager: string, role: string}>}>} Standard response with active employees
   */
  async getAllEmployees() {
    try {
      const response = await app.get('user/api/client-api/admin/active-employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching all active employees:', error);
      throw error;
    }
  },

  /**
   * Get all groups
   * @returns {Promise<{status: string, message: string, data: Array<{groupId: number, groupName: string, description: string, isActive: boolean, createdAt: string, updatedAt: string}>}>} Standard response with all groups
   */
  async getAllGroups() {
    try {
      const response = await app.get('user/api/client-api/group/all-active-groups');
      return response.data;
    } catch (error) {
      console.error('Error fetching all groups:', error);
      throw error;
    }
  },

  /**
   * Get enrollments for a specific user by user ID
   * @param {number} userId - The user ID
   * @returns {Promise<{status: string, message: string, data: {userId: number, userName: string, courseEnrollments: number, bundleEnrollments: number, totalCourses: number, averageCompletion: number, upcomingDeadlines: number, status: boolean, enrolledCoursesList: Array<{courseId: number, courseName: string, progress: number, enrollmentDate: string, deadline: string}>, enrolledBundlesList: Array<{bundleId: number, bundleName: string, progress: number, enrollmentDate: string, deadline: string, enrolledCoursesList: Array<{courseId: number, courseName: string, progress: number, enrollmentDate: string, deadline: string}>}>}}>} Standard response with user enrollment data
   */
  async getUserEnrollmentsByUserId(userId) {
    try {
      const response = await app.get(`user/api/client-api/enrollment/user-enrollments/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollments for user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Get enrollments for all users
   * @returns {Promise<{status: string, message: string, data: Array<{userId: number, userName: string, courseEnrollments: number, bundleEnrollments: number, totalCourses: number, averageCompletion: number, upcomingDeadlines: number, status: boolean, enrolledCoursesList: Array<{courseId: number, courseName: string, progress: number, enrollmentDate: string, deadline: string}>, enrolledBundlesList: Array<{bundleId: number, bundleName: string, progress: number, enrollmentDate: string, deadline: string, enrolledCoursesList: Array<{courseId: number, courseName: string, progress: number, enrollmentDate: string, deadline: string}>}>}>}>} Standard response with all users' enrollment data
   */
  async getAllUserEnrollments() {
    try {
      const response = await app.get('user/api/client-api/enrollment/user-enrollments');
      return response.data;
    } catch (error) {
      console.error('Error fetching all user enrollments:', error);
      throw error;
    }
  },

  /**
   * Get individual course enrollments
   * @returns {Promise<{status: string, message: string, data: Array<{courseId: number, ownerId: number, individualEnrollments: number, courseName: string, ownerName: string, isActive: boolean, enrolledUserOutDTOList: Array<{userId: number, assignedByName: string, userName: string, progress: number, enrollmentDate: string, deadline: string}>}>}>} Standard response with course enrollment data
   */
  async getUserCourseEnrollments() {
    try {
      const response = await app.get('user/api/client-api/enrollment/user-course-enrollments');
      return response.data;
    } catch (error) {
      console.error('Error fetching user course enrollments:', error);
      throw error;
    }
  },

  /**
   * Get individual bundle enrollments
   * @returns {Promise<{status: string, message: string, data: Array<{bundleId: number, bundleName: string, totalCourses: number, individualEnrollments: number, averageCompletion: number, isActive: boolean, enrolledUserOutDTOList: Array<{userId: number, assignedByName: string, userName: string, progress: number, enrollmentDate: string, deadline: string}>}>}>} Standard response with bundle enrollment data
   */
  async getUserBundleEnrollments() {
    try {
      const response = await app.get('user/api/client-api/enrollment/user-bundle-enrollments');
      return response.data;
    } catch (error) {
      console.error('Error fetching user bundle enrollments:', error);
      throw error;
    }
  },

  /**
   * Get enrolled courses for a specific user
   * @param {number} userId - The user ID
   * @returns {Promise<{status: string, message: string, data: Array<{enrollmentId: number, userId: number, courseId: number, courseName: string, assignedBy: number, assignedByName: string, enrollmentDate: string, deadline: string, status: string, progress: number, startedAt: string, completedAt: string, isActive: boolean}>}>} Standard response with user's enrolled courses
   */
  async getEnrolledCoursesByUserId(userId) {
    try {
      const response = await app.get(`user/api/client-api/enrollment/userCourses/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrolled courses for user ${userId}:`, error);
      throw error;
    }
  },

  // Course and Bundle Management APIs

  /**
   * Get all available courses
   * @returns {Promise<{status: string, message: string, data: Array<{courseId: number, courseName: string, description: string, level: string, duration: number, isActive: boolean, createdAt: string, updatedAt: string}>}>} Standard response with all courses
   */
  async getAllCourses() {
    try {
      const response = await app.get('course/api/client-api/course');
      return response.data;
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw error;
    }
  },

  /**
   * Get all available bundles
   * @returns {Promise<{status: string, message: string, data: Array<{bundleId: number, bundleName: string, description: string, isActive: boolean, createdAt: string, updatedAt: string}>}>} Standard response with all bundles
   */
  async getAllBundles() {
    try {
      const response = await app.get('course/api/client-api/bundles');
      return response.data;
    } catch (error) {
      console.error('Error fetching all bundles:', error);
      throw error;
    }
  },

  /**
   * Get all courses for a specific bundle
   * @param {number} bundleId - The bundle ID
   * @returns {Promise<{status: string, message: string, data: Array<{courseBundleId: number, bundleId: number, courseId: number, courseName: string, isActive: boolean, createdAt: string}>}>} Standard response with courses in the bundle
   */
  async getCoursesByBundleId(bundleId) {
    try {
      const response = await app.get(`course/api/client-api/bundles/course-bundles/${bundleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching courses for bundle ${bundleId}:`, error);
      throw error;
    }
  },

  // Helper methods for error handling

  /**
   * Check if error is from backend validation/exception
   * @param {Error} error - The error object
   * @returns {boolean} True if it's a backend error with structured format
   */
  isBackendError(error) {
    return error.response && (error.response.status || error.response.data);
  },

  /**
   * Get error details from backend error
   * @param {Error} error - The error object
   * @returns {Object} Error details object
   */
  getErrorDetails(error) {
    const response = error.response;
    const data = response?.data;
    
    return {
      message: data?.message || error.message || 'An error occurred',
      status: data?.status || null,
      httpStatus: response?.status || null,
      timestamp: data?.timestamp || null,
      isValidationError: response?.status === 400,
      isNotFound: response?.status === 404,
      isConflict: response?.status === 409,
      isUnauthorized: response?.status === 401
    };
  },

  /**
   * Format error message for display
   * @param {Error} error - The error object
   * @returns {string} Formatted error message
   */
  formatErrorMessage(error) {
    const details = this.getErrorDetails(error);
    
    if (details.isValidationError) {
      return `Validation Error: ${details.message}`;
    } else if (details.isNotFound) {
      return `Not Found: ${details.message}`;
    } else if (details.isConflict) {
      return `Conflict: ${details.message}`;
    } else if (details.isUnauthorized) {
      return `Unauthorized: ${details.message}`;
    }
    
    return details.message;
  },

  /**
   * Extract data from standard response
   * @param {Object} response - Standard response from API
   * @returns {*} The actual data from the response
   */
  extractData(response) {
    return response?.data || null;
  },

  /**
   * Check if response was successful
   * @param {Object} response - Standard response from API
   * @returns {boolean} True if response status is SUCCESS
   */
  isSuccess(response) {
    return response?.status === 'SUCCESS';
  },

  /**
   * Get message from response
   * @param {Object} response - Standard response from API
   * @returns {string} The message from response
   */
  getMessage(response) {
    return response?.message || '';
  },

  // Utility methods for enrollment data validation

  /**
   * Validate enrollment request data
   * @param {Object} enrollmentData - Enrollment request data
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateEnrollmentData(enrollmentData) {
    const errors = [];
    
    if (!enrollmentData.assignedBy) {
      errors.push('Assigned by user ID is required');
    }
    
    const hasUsers = enrollmentData.userIds && enrollmentData.userIds.length > 0;
    const hasGroups = enrollmentData.groupIds && enrollmentData.groupIds.length > 0;
    const hasCourses = enrollmentData.courseIds && enrollmentData.courseIds.length > 0;
    const hasBundles = enrollmentData.bundleIds && enrollmentData.bundleIds.length > 0;
    
    if (!hasUsers && !hasGroups) {
      errors.push('Either user IDs or group IDs must be provided');
    }
    
    if (!hasCourses && !hasBundles) {
      errors.push('Either course IDs or bundle IDs must be provided');
    }
    
    if (hasUsers && hasGroups) {
      errors.push('Cannot provide both user IDs and group IDs');
    }
    
    if (hasCourses && hasBundles) {
      errors.push('Cannot provide both course IDs and bundle IDs');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Create enrollment request for individual users and courses
   * @param {number} assignedBy - User ID who is assigning
   * @param {number[]} userIds - Array of user IDs
   * @param {number[]} courseIds - Array of course IDs
   * @param {Object} options - Additional options
   * @returns {Object} Formatted enrollment request
   */
  createUserCourseEnrollment(assignedBy, userIds, courseIds, options = {}) {
    return {
      assignedBy,
      userIds,
      courseIds,
      deadline: options.deadline || null,
      status: options.status || 'ACTIVE',
      forceEnrollment: options.forceEnrollment || false,
      groupEnrollmentOnly: false
    };
  },

  /**
   * Create enrollment request for groups and bundles
   * @param {number} assignedBy - User ID who is assigning
   * @param {number[]} groupIds - Array of group IDs
   * @param {number[]} bundleIds - Array of bundle IDs
   * @param {Object} options - Additional options
   * @returns {Object} Formatted enrollment request
   */
  createGroupBundleEnrollment(assignedBy, groupIds, bundleIds, options = {}) {
    return {
      assignedBy,
      groupIds,
      bundleIds,
      deadline: options.deadline || null,
      status: options.status || 'ACTIVE',
      forceEnrollment: options.forceEnrollment || false,
      groupEnrollmentOnly: options.groupEnrollmentOnly || false
    };
  },

  // Helper methods for course and bundle data

  /**
   * Filter active courses from course list
   * @param {Array} courses - Array of course objects
   * @returns {Array} Filtered array of active courses
   */
  filterActiveCourses(courses) {
    return courses.filter(course => course.active);
  },

  /**
   * Filter active bundles from bundle list
   * @param {Array} bundles - Array of bundle objects
   * @returns {Array} Filtered array of active bundles
   */
  filterActiveBundles(bundles) {
    return bundles.filter(bundle => bundle.active);
  },

  /**
   * Group courses by level
   * @param {Array} courses - Array of course objects
   * @returns {Object} Object with courses grouped by level
   */
  groupCoursesByLevel(courses) {
    return courses.reduce((acc, course) => {
      const level = course.level || 'Unknown';
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(course);
      return acc;
    }, {});
  },

  /**
   * Get course IDs from bundle courses
   * @param {Array} courseBundles - Array of CourseBundle objects
   * @returns {Array} Array of course IDs
   */
  extractCourseIdsFromBundle(courseBundles) {
    return courseBundles
      .filter(cb => cb.isActive)
      .map(cb => cb.courseId);
  },

  /**
   * Create a combined enrollment request for multiple content types
   * @param {number} assignedBy - User ID who is assigning
   * @param {Object} targets - Target users/groups: { userIds?, groupIds? }
   * @param {Object} content - Content to assign: { courseIds?, bundleIds? }
   * @param {Object} options - Additional options
   * @returns {Object} Formatted enrollment request
   */
  createCombinedEnrollment(assignedBy, targets, content, options = {}) {
    const enrollment = {
      assignedBy,
      deadline: options.deadline || null,
      status: options.status || 'ACTIVE',
      forceEnrollment: options.forceEnrollment || false,
      groupEnrollmentOnly: options.groupEnrollmentOnly || false
    };

    // Add targets
    if (targets.userIds && targets.userIds.length > 0) {
      enrollment.userIds = targets.userIds;
    }
    if (targets.groupIds && targets.groupIds.length > 0) {
      enrollment.groupIds = targets.groupIds;
    }

    // Add content
    if (content.courseIds && content.courseIds.length > 0) {
      enrollment.courseIds = content.courseIds;
    }
    if (content.bundleIds && content.bundleIds.length > 0) {
      enrollment.bundleIds = content.bundleIds;
    }

    return enrollment;
  }
};

export default enrollmentService;