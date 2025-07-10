import { app } from "./serviceLMS";
export async function fetchUsers() {
  try {
    const response = await app.get("user/api/client-api/users");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function userStats(userId) {
  try {  
    const response = await app.get(
      `user/api/client-api/enrollments/${userId}/statistics`);
    return response.data;
  } catch (error) {
    console.log("userStat error");
    throw new Error(error?.response?.data?.message);
  }
}


export async function userdeadlines() {
  try {

    const response = await app.get(
      'user/api/client-api/users/getDeadlines'
    );
    console.log("user deadlines response", response.data.data);
    
    return response.data;
  } catch (error) {
    console.log("userStat error");
    throw new Error(error?.response?.data?.message);
  }
}


// export async function userdeadlines() {
//   try {

//     const response = await app.get(
//       '/api/users/getDeadlines'
//     );
//     console.log("user deadlines response", response.data.data);
    
//     return response.data;
//   } catch (error) {
//     console.log("userStat error");
//     throw new Error(error?.response?.data?.message);
//   }
// }

export async function deleteUsers(id) {
  try {
    const response = await app.delete(`user/api/client-api/admin/remove-user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function fetchAllActiveUsers() {
  try {  
    const response = await app.get("user/api/client-api/admin/active-employees");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function fetchAllInactiveUsers() {
  try {
    const response = await app.get("user/api/client-api/admin/inactive-employees");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function createUser(userData) {
  try {
    const response = await app.post("user/api/client-api/admin/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
}

export async function updateUser(userData, userId) {
  try {
    const response = await app.patch(`user/api/client-api/admin/update-user/${userId}`, userData);
    console.log("Update User Response:", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function countAllUsers() {
  try {
    const response = await app.get("user/api/client-api/user/userCount");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

export async function userLogin(data) {
  try {
    const response = await app.post("/api/client-api/auth/login", data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
}

// export async function getUserByToken(token) {
//   try {
//     const response = await app.get("/api/current-user", {
//       headers: {
//         Authorization: token,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error?.response?.data?.message);
//   }
// }

export async function logoutUser() {
  const response = await app.post("/api/client-api/auth/logout");
  window.localStorage.removeItem("authtoken");
}

export const previewUserReportPdf = async (options) => {
  return app
    .post(`user/api/client-api/custom-user-report/preview-pdf`, options, {
      responseType: "blob" 
    })
    .then((res) => res.data);
};

export async function downloadUserReportPdf(options) {
  try {
    const response = await app.post(
      `user/api/client-api/custom-user-report/download-pdf`,options,
      {
        responseType: "blob" 
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `user-report-${options.userId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading user report PDF:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to download user report PDF"
    );
  }
}

export async function downloadUserReportExcel(options) {
  try {
    const response = await app.post(
      `user/api/client-api/custom-user-report/download-excel`,options,
      {
        responseType: "blob" 
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `user-report-${options.userId}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading user report Excel:", error);
    throw new Error(
      error?.response?.data?.message || "Failed to download user report Excel"
    );
  }
}
