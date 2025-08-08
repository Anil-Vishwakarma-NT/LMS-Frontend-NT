import { app } from "./serviceLMS";

export const getSingleUserReport = async (userId) => {
  const response = await app.get(`user/api/client-api/reports/user/${userId}`);
  return response.data.data;
};

export const getSingleGroupReport = async (groupId) => {
  const response = await app.get(
    `user/api/client-api/reports/group/${groupId}`
  );
  return response.data.data;
};

export const getSingleCourseReport = async (courseId) => {
  const response = await app.get(
    `user/api/client-api/reports/course/${courseId}`
  );
  return response.data.data;
};

export const getSingleBundleReport = async (bundleId) => {
  const response = await app.get(
    `user/api/client-api/reports/bundle/${bundleId}`
  );
  return response.data.data;
};

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
