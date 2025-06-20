import { app } from "./serviceLMS";
import axios from "axios";

export async function fetchUsers() {
  try {
    const response = await app.get("/api/user");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function userStats(userId, token) {
  try {
    console.log("inside userStats");
    const response = await app.get(
      `/api/users/enrollments/${userId}/statistics`,
      { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("userStats response", response.data.data);

    return response.data;
  } catch (error) {
    console.log("userStat error");
    throw new Error(error?.response?.data?.message);
  }
}

export async function deleteUsers(id) {
  try {
    const response = await app.delete(`/admin/remove-user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function fetchAllActiveUsers(token) {
  try {
    console.log("token");
    console.log(token);
    const response = await app.get("/admin/active-employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function fetchAllInactiveUsers(token) {
  try {
    console.log("getting inactive users");
    const response = await app.get("/admin/inactive-employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function createUser(userData, token) {
  try {
    const response = await app.post("/admin/register", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
}

export async function updateUser(userData, id) {
  try {
    const response = await app.patch(`/admin/update-user/${id}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function countAllUsers() {
  try {
    const response = await app.get("/api/user/userCount");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function userLogin(data) {
  try {
    const response = await app.post("/api/auth/login", data);
    console.log("userLogin response", response.data);
    return response.data.data;
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
    const response = await axios.get(
      `http://localhost:8081/api/report/user/${userId}/pdf`,
      {
        responseType: "blob", // Required to properly handle PDF binary
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      }
    );
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
    const response = await axios.get(
      `http://localhost:8081/api/report/user/${userId}/pdf/download`,
      {
        responseType: "blob", // Important for file download
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
        },
      }
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