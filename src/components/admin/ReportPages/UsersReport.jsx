import React from "react";
import UserKpiReportTable from "../../shared/table/UserReportTable";
import AdminHOC from "../../shared/HOC/AdminHOC";

const UserReportPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2>User Dashboard Report</h2>
      <UserKpiReportTable /> 
    </div>
  );
};

export default AdminHOC(UserReportPage);
