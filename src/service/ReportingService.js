import { app } from "./serviceLMS";

export const getUserKpiReport = async (page, size) => {
  const res = await app.get("user/api/client-api/report/users", {
    params: { page, size },
  });

  const { records, total } = res.data.data || {};
  return { records, total };
};


export const getCourseKpiReport = async (page, size) => {
  const res = await app.get("user/api/client-api/report/courses", {
    params: { page, size },
  });

  const { records, total } = res.data.data || {};
  return { records, total };
};


export const getGroupKpiReport = async (page, size) => {
  const res = await app.get("user/api/client-api/report/groups", {
    params: { page, size },
  });

  const { records, total } = res.data.data || {};
  return { records, total };
};


export const getBundleKpiReport = async (page, size) => {
  const res = await app.get("user/api/client-api/report/bundles", {
    params: { page, size },
  });

  const { records, total } = res.data.data || {};
  return { records, total };
};











// export const getGroupStructure = async (
//   groupId,
//   bundlePage,
//   bundleSize,
//   coursePage,
//   courseSize
// ) => {
//   const res = await app.get(`user/api/client-api/report/group/${groupId}`, {
//     params: { bundlePage, bundleSize, coursePage, courseSize },
//   });
//   return res.data.data;
// };

// export const getCoursesInBundle = async (groupId, bundleId, page, size) => {
//   const res = await app.get(
//     `user/api/client-api/report/group/${groupId}/bundle/${bundleId}/courses`,
//     {
//       params: { page, size },
//     }
//   );
//   return res.data.data;
// };

// export const getEnrolledUsers = async (groupId, courseId, page, size) => {
//   const res = await app.get(
//     `user/api/client-api/report/group/${groupId}/course/${courseId}/users`,
//     {
//       params: { page, size },
//     }
//   );
//   return res.data.data;
// };
