import { app } from "./serviceLMS";
export async function fetchUsers() {
  try {
    const response = await app.get("user/api/service-api/user");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function userStats(userId, token) {
  try {
    console.log("inside userStats");
    const response = await app.get(
      `user/api/service-api/enrollments/${userId}/statistics`);
    console.log("userStats response", response.data.data);

    return response.data;
  } catch (error) {
    console.log("userStat error");
    throw new Error(error?.response?.data?.message);
  }
}

export async function deleteUsers(id) {
  try {
    const response = await app.delete(`user/api/service-api/admin/remove-user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function fetchAllActiveUsers(token) {
  try {
    console.log("token");
    console.log(token);
    const response = await app.get("user/api/service-api/admin/active-employees");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function fetchAllInactiveUsers(token) {
  try {
    console.log("getting inactive users");
    const response = await app.get("user/api/service-api/admin/inactive-employees");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function createUser(userData) {
  try {
    const response = await app.post("user/api/service-api/admin/register",userData);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
}

export async function updateUser(userData, id) {
  try {
    const response = await app.patch(`user/api/service-api/admin/update-user/${id}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function countAllUsers() {
  try {
    const response = await app.get("user/api/service-api/user/userCount");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function userLogin(data) {
  try {
    const response = await app.post("/api/client-api/auth/login", data);
    console.log("userLogin response", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function getUserByToken(token) {
  try {
    const response = await app.get("/api/current-user", {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function logoutUser(token) {
  const response = await app.post("/api/auth/logout", {
    headers: {
      Authorization: token,
    },
  });
  window.localStorage.removeItem("authtoken");
}

export async function previewUserReportPdf(userId) {
  try {
    const response = await app.get(
      `user/api/service-api/report/user/${userId}/pdf`  );
    return response.data;
  } catch (error) {
    console.error("Error fetching course report PDF:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to fetch course report PDF"
    );
  }
}

export async function downloadUserReportPdf(userId) {
  try {
    const response = await app.get(
      `user/api/service-api/report/user/${userId}/pdf/download` 
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `user-report-${userId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading course report PDF:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to download course report PDF"
    );
  }
}