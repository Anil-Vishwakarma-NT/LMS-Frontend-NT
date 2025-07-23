import {app}from "./serviceLMS"
import {fetchCourseDetails, getCourseProgressWithMeta, getCourseProgressWithMetaCourseId , fetchUserNameById} from "./UserCourseService";

export const getTotalUsers = async () => {
    try {
        console.log("getting total users");
        const response = await app.get('user/api/client-api/admin/count')
        console.log("response", response.data);
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getTotalCourses = async () => {
    
    try {
        const response = await app.get('course/api/client-api/course/count')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}

export async function fetchUserEnrolledCoursesById(userId) {
  try {
    const enrollments = await app.get(`user/api/client-api/enrollment/userCourses/${userId}`);
    console.log("Response of fetchUserEnrolledCoursesById", enrollments.data.data)
    if (enrollments != null) {
        console.log("Enrolled courses fetched ", enrollments.data);   
          const courseDetailsPromises = enrollments.data.data.map(async (enrollment) => {
            console.log("Course fetching details ",enrollment.courseId)
            const courseDetails = await fetchCourseDetails(enrollment.courseId);
            console.log("Details fetched for course", courseDetails);   
            
             const progressMeta = await getCourseProgressWithMeta(
                userId,
                enrollment.courseId
            
            );
              const completionPercentage = progressMeta.courseCompletionPercentage;
              const firstCompletedAt = progressMeta.firstCompletedAt;
    
              console.log("Completion percentage fetched", completionPercentage);
    
              const roundedCompletion = parseFloat(completionPercentage.toFixed(2));
    
              console.log("ROUNDED COMPLETION PERC", roundedCompletion);
    
              const todayISO = new Date().toISOString().split("T")[0];
              const deadlineISO = enrollment.deadline
                ? new Date(enrollment.deadline).toISOString().split("T")[0]
                : null;
    
              console.log("📅 Deadline:", deadlineISO || "None");
    
              let status = "Not Started";
              let adherence = "N/A";
    
              if (roundedCompletion >= 95.0) {
                if (firstCompletedAt) {
                  const completedISO = new Date(firstCompletedAt)
                    .toISOString()
                    .split("T")[0];
    
                  if (!deadlineISO) {
                    status = "Completed";
                    adherence = "No Deadline";
                  } else if (completedISO <= deadlineISO) {
                    status = "Completed";
                    adherence = "On Time";
                  } else {
                    status = "Completed";
                    adherence = "Late";
                  }
                } else {
                  // Should rarely hit this if `firstCompletedAt` is maintained well
                  status = "Completed";
                  adherence = deadlineISO ? "Late" : "No Deadline";
                }
              } else if (roundedCompletion > 0) {
                status =
                  deadlineISO && todayISO > deadlineISO
                    ? "Completion Failed"
                    : "In Progress";
                adherence = deadlineISO
                  ? todayISO <= deadlineISO
                    ? "Ongoing On Time"
                    : "Ongoing Late"
                  : "No Deadline";
              } else {
                status =
                  deadlineISO && todayISO > deadlineISO
                    ? "Completion Failed"
                    : "Not Started";
                adherence = deadlineISO
                  ? todayISO <= deadlineISO
                    ? "On Time (Yet to Start)"
                    : "Late (Yet to Start)"
                  : "No Deadline";
              }
    
              let assignedByName = "Unknown";
              if (enrollment.assignedById) {
                const name = await fetchUserNameById(enrollment.assignedById);
                assignedByName = name || "Unknown";
              }
    
    
              return {
                ...courseDetails,
                assignedById: assignedByName,
                enrollmentDate: enrollment.enrollmentDate,
                deadline: enrollment.deadline,
                roundedCompletion,
                status,
                adherence,
               
    
              };
   });

      return await Promise.all(courseDetailsPromises);
    }
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch enrolled courses."
    );
  }
}

export const getTotalBundles = async () => {
    
    try {
        const response = await app.get('course/api/client-api/bundles/count')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getTotalEnrollment = async () => {
  try {
    const response = await app.get('user/api/client-api/enrollment/statistics');

    const data = response?.data?.data;

    if (!data || data.length === 0) {
      console.warn("No active enrollments found");
      return []; // or return 0 depending on your use-case
    }

    return data;
  } catch (error) {
    console.error("Error fetching enrollment stats:", error?.response?.data?.message || error.message);
    return []; // or return 0 or null as fallback
  }
};

export const getTotalGroups = async () => {
    
    try {
        const response = await app.get('user/api/client-api/group/count')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentUser = async () => {
    
    try {
        const response = await app.get('user/api/client-api/admin/users/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentCourse = async () => {
    
    try {
        const response = await app.get('course/api/client-api/course/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentBundle = async () => {
    
    try {
        const response = await app.get('course/api/client-api/course-bundles/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}
export const getRecentGroups = async () => {
    
    try {
        const response = await app.get('user/api/client-api/group/recent')
        return response.data.data
    } catch (error) {
        throw new Error(error?.response?.data?.message);
    }
}