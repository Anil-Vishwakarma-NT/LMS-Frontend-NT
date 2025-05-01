import axios from 'axios';

// Base API URL - replace with your actual API endpoint
const USER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

const COURSE_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

class EnrollmentService {
  /**
   * Fetch enrollment statistics
   * @returns {Promise} Promise with statistics data including:
   * - totalEnrollments: Total number of enrollments
   * - usersEnrolled: Number of users enrolled
   * - groupsEnrolled: Number of groups enrolled
   * - completionRate: Overall completion rate percentage
   * - topEnrolledCourse: Name of the most enrolled course
   * - upcomingDeadlines: Number of upcoming deadlines
   * - courseCompletions: Number of course completions
   */
  async fetchStats() {
    try {
      const response = await axios.get(`${USER_API_BASE_URL}/api/enrollment/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment statistics:', error);
      throw error;
    }
  }

  /**
   * Fetch courses with user enrollment data
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise} Promise with course enrollment data
   */
  async fetchUserCourses(filters = {}) {
    try {
      const response = await axios.get(`${USER_API_BASE_URL}/api/enrollment/user-course`, { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user course enrollments:', error);
      throw error;
    }
  }

  /**
   * Fetch bundles with user enrollment data
   * @param {Object} filters - Optional filter parameters
   * @returns {Promise} Promise with bundle enrollment data including:
   * - bundleName: Name of the bundle
   * - totalCourses: Number of courses in the bundle
   * - individualEnrollments: Number of individual enrollments
   * - averageCompletion: Average completion percentage
   * - enrolledUserDTOList: List of enrolled users with details
   * - active: Whether the bundle is active
   */
  async fetchUserBundles(filters = {}) {
    try {
      const response = await axios.get(`${USER_API_BASE_URL}/api/enrollment/user-bundle`, { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user bundle enrollments:', error);
      throw error;
    }
  }

/**
 * Fetch user enrollment data from the LMS backend.
 * 
 * This function retrieves a list of users along with detailed enrollment information, including:
 * - Basic user info (`userId`, `userName`)
 * - Number of course and bundle enrollments
 * - Average course completion percentage
 * - Count of upcoming deadlines
 * - Enrollment details for each course and/or bundle (if enrolled), including progress, enrollment date, and deadline
 * 
 * @param {Object} filters - Optional query parameters to filter user enrollment data (e.g., by status or userId)
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user enrollment objects
 * 
 * Each user enrollment object includes:
 * - userId: number
 * - userName: string
 * - courseEnrollments: number
 * - bundleEnrollments: number
 * - totalCourses: number|null
 * - averageCompletion: number
 * - upcomingDeadlines: number
 * - status: boolean
 * - enrolledCoursesList: Array<{ courseId, courseName, progress, enrollmentDate, deadline }> | null
 * - enrolledBundlesList: Array<{ bundleId, bundleName, progress, enrollmentDate, deadline }> | null
 */
async fetchUserEnrollments(filters = {}) {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/api/enrollment/user-enrollments`, { 
      params: filters 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    throw error;
  }
}

  
/**
 * Create a new enrollment
 * @param {Object} enrollmentData - Enrollment data including:
 * - userId: User ID (null if enrolling a group)
 * - groupId: Group ID (null if enrolling a user)
 * - courseId: Course ID (null if enrolling to a bundle)
 * - bundleId: Bundle ID (null if enrolling to a course)
 * - deadline: Deadline in ISO format (YYYY-MM-DDThh:mm:ss)
 * - assignedBy: ID of the user creating the enrollment
 * @returns {Promise} Promise with created enrollment
 */
async createEnrollment(enrollmentData) {
  try {
    const formattedData = {
      userId: enrollmentData.userId,
      groupId: enrollmentData.groupId,
      courseId: enrollmentData.courseId,
      bundleId: enrollmentData.bundleId,
      deadline: enrollmentData.deadline,
      assignedBy: enrollmentData.assignedBy || 6 
    };
    
    const response = await axios.post(
      `${USER_API_BASE_URL}/api/enrollment/enroll`, 
      formattedData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating enrollment:', error);
    throw error;
  }
}

  /**
   * Update an enrollment
   * @param {string|number} id - Enrollment ID
   * @param {Object} enrollmentData - Updated enrollment data
   * @returns {Promise} Promise with updated enrollment
   */
  async updateEnrollment(id, enrollmentData) {
    try {
      const response = await axios.put(
        `${USER_API_BASE_URL}/api/enrollment/update/${id}`, 
        enrollmentData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      throw error;
    }
  }

  /**
   * Delete an enrollment
   * @param {string|number} id - Enrollment ID
   * @returns {Promise} Promise with deletion confirmation
   */
  async deleteEnrollment(id) {
    try {
      const response = await axios.delete(`${USER_API_BASE_URL}/api/enrollment/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      throw error;
    }
  }


  /**
 * Fetch active employees
 * @returns {Promise} Promise with active employee data including:
 * - userId: Employee ID
 * - username: Username
 * - firstName: First name
 * - lastName: Last name
 * - email: Email address
 * - manager: Manager name
 * - message: Optional message
 */
async fetchActiveEmployees() {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/admin/active-employees`);
    return response.data;
  } catch (error) {
    console.error('Error fetching active employees:', error);
    throw error;
  }
}

/**
 * Fetch all groups
 * @returns {Promise} Promise with group data including:
 * - groupName: Name of the group
 * - groupId: Group ID
 * - creatorName: Name of the creator
 */
async fetchAllGroups() {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/group/all-groups`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all groups:', error);
    throw error;
  }
}

/**
 * Fetch all available courses
 * @returns {Promise} Promise with course data including:
 * - courseId: Course ID
 * - ownerId: Owner ID
 * - title: Course title
 * - description: Course description
 * - level: Course difficulty level (BEGINNER, INTERMEDIATE, PROFESSIONAL)
 * - createdAt: Creation timestamp
 * - updatedAt: Last update timestamp
 * - active: Whether the course is active
 */
async fetchAllCourses() {
  try {
    const response = await axios.get(`${COURSE_API_BASE_URL}/course`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

/**
 * Fetch all available bundles
 * @returns {Promise} Promise with bundle data including:
 * - bundleId: Bundle ID
 * - bundleName: Name of the bundle
 * - createdAt: Creation timestamp
 * - updatedAt: Last update timestamp
 * - active: Whether the bundle is active
 */
async fetchAllBundles() {
  try {
    const response = await axios.get(`${COURSE_API_BASE_URL}/bundles`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bundles:', error);
    throw error;
  }
}

}



export default new EnrollmentService();