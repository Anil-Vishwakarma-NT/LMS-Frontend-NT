import axios from 'axios';

// Base API URL - replace with your actual API endpoint
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api/enrollment';

class EnrollmentService {
  /**
   * Fetch enrollment dashboard data
   * @param {Object} filters - Filter parameters
   * @param {string} filters.viewType - 'users' or 'groups'
   * @param {string} filters.timeRange - '7days', '30days', 'quarter', 'custom'
   * @param {string} filters.status - 'all', 'active', 'completed', 'inactive'
   * @param {string} filters.searchTerm - Search string
   * @param {Array} filters.dateRange - [startDate, endDate] for custom range
   * @returns {Promise} Promise with dashboard data
   */
  async fetchDashboardData(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/enrollments/dashboard`, { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment dashboard data:', error);
      throw error;
    }
  }

  /**
   * Fetch courses with enrollment data
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Promise with courses data
   */
  async fetchCourses(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/enrollments/courses`, { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course enrollments:', error);
      throw error;
    }
  }

  /**
   * Fetch bundles with enrollment data
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Promise with bundles data
   */
  async fetchBundles(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/enrollments/bundles`, { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bundle enrollments:', error);
      throw error;
    }
  }

  /**
   * Fetch users with enrollment data
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Promise with users data
   */
  async fetchUsers(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/enrollments/users`, { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      throw error;
    }
  }

  /**
   * Fetch groups with enrollment data
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Promise with groups data
   */
  async fetchGroups(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/enrollments/groups`, { 
        params: filters 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching group enrollments:', error);
      throw error;
    }
  }

  /**
   * Fetch enrollment statistics
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Promise with statistics data
   */
  async fetchStatistics(filters = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`, { 
        params: filters 
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment statistics:', error);
      throw error;
    }
  }

  /**
   * Fetch entity details (user or group)
   * @param {string} type - 'user' or 'group'
   * @param {string|number} id - Entity ID
   * @returns {Promise} Promise with entity data
   */
  async fetchEntityDetails(type, id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/enrollments/${type}s/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      throw error;
    }
  }

  /**
   * Fetch enrolled entities for a course or bundle
   * @param {string} contentType - 'course' or 'bundle'
   * @param {string|number} id - Content ID
   * @param {string} entityType - 'user' or 'group'
   * @returns {Promise} Promise with enrolled entities data
   */
  async fetchEnrolledEntities(contentType, id, entityType = 'user') {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/enrollments/${contentType}s/${id}/${entityType}s`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrolled ${entityType}s:`, error);
      throw error;
    }
  }

  /**
   * Create a new enrollment
   * @param {Object} enrollmentData - Enrollment data
   * @returns {Promise} Promise with created enrollment
   */
  async createEnrollment(enrollmentData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/enrollments`, 
        enrollmentData
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
        `${API_BASE_URL}/enrollments/${id}`, 
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
      const response = await axios.delete(`${API_BASE_URL}/enrollments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      throw error;
    }
  }
  
  /**
   * Fetch upcoming deadlines
   * @param {Object} filters - Filter parameters
   * @param {number} days - Number of days to check for deadlines
   * @returns {Promise} Promise with upcoming deadlines data
   */
  async fetchUpcomingDeadlines(filters = {}, days = 7) {
    try {
      const response = await axios.get(`${API_BASE_URL}/enrollments/deadlines`, { 
        params: {
          ...filters,
          days
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming deadlines:', error);
      throw error;
    }
  }
  
  /**
   * Fetch all available courses for enrollment
   * @returns {Promise} Promise with available courses
   */
  async fetchAvailableCourses() {
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/available`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available courses:', error);
      throw error;
    }
  }
  
  /**
   * Fetch all available bundles for enrollment
   * @returns {Promise} Promise with available bundles
   */
  async fetchAvailableBundles() {
    try {
      const response = await axios.get(`${API_BASE_URL}/bundles/available`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available bundles:', error);
      throw error;
    }
  }
  
  /**
   * Fetch all users available for enrollment
   * @returns {Promise} Promise with available users
   */
  async fetchAvailableUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available users:', error);
      throw error;
    }
  }
  
  /**
   * Fetch all groups available for enrollment
   * @returns {Promise} Promise with available groups
   */
  async fetchAvailableGroups() {
    try {
      const response = await axios.get(`${API_BASE_URL}/groups`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available groups:', error);
      throw error;
    }
  }
}

export default new EnrollmentService();