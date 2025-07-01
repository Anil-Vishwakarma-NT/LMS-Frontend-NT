import axios from "axios";

export async function fetchUserEnrolledCourses(userId) {
  try {
    const response = await axios.get(
      `http://localhost:8081/api/enrollment/userCourses/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch enrolled courses."
    );
  }
}

export async function fetchUserNameById(userId) {
  try {
    const response = await axios.get(
      `http://localhost:8081/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.status === "SUCCESS" && data.data) {
      return `${data.data.firstName} ${data.data.lastName}`;
    }

    console.warn("No user found for ID:", userId);
    return null;
  } catch (error) {
    console.error(
      "Error fetching user name:",
      error.response?.data || error.message
    );
    return null;
  }
}

export async function fetchCourseDetails(courseId) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/course/${courseId}`
    );
    return response.data.data;
  } catch (error) {
    throw new Error("Failed to fetch course details.");
  }
}

export async function getCourseProgressWithMeta(userId, courseId) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/user-progress/meta?userId=${userId}&courseId=${courseId}`
    );
    return response.data;
  } catch (error) {
    return 0;
  }
}

export async function getUserEnrolledCourseDetails(userId) {
  try {
    const enrollments = await fetchUserEnrolledCourses(userId);
    console.log("Enrolled courses fetched ", enrollments);

    const courseDetailsPromises = enrollments.map(async (enrollment) => {
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
  } catch (error) {
    alert("Error getting course details");
    throw new Error("Failed to retrieve user enrolled courses.");
  }
}

export async function fetchContentProgress(userId, courseId, contentId) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/user-progress/content?userId=${userId}&courseId=${courseId}&contentId=${contentId}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    return 0;
  }
}

export async function updateContentProgress(
  userId,
  contentId,
  courseId,
  lastPosition,
  newCompletionPercentage,
  contentType
) {
  try {
    const existingCompletionPercentage = await fetchContentProgress(
      userId,
      courseId,
      contentId
    );
    const finalCompletionPercentage = Math.max(
      existingCompletionPercentage,
      newCompletionPercentage
    );

    const progressPayload = {
      userId,
      contentId,
      courseId,
      lastPosition,
      lastUpdated: new Date().toISOString(),
      contentCompletionPercentage: finalCompletionPercentage,
      contentType,
    };

    console.log(progressPayload);

    await axios.post(
      `http://localhost:8080/api/user-progress/update`,
      progressPayload
    );

    console.log(`Content progress updated successfully`);
  } catch (error) {
    console.error(
      "Error updating content progress:",
      error.response?.data || error.message
    );
  }
}
