import React from "react";
import UserKpiReportTable from "../../shared/table/UserReportTable";
import AdminHOC from "../../shared/HOC/AdminHOC";

const UserReportPage = () => {
  return (
<<<<<<< HEAD
    <div className="user-container">
      <h2>User KPI Report</h2>
      <UserKpiReportTable />
=======
    <div style={{ padding: 24 }}>
      <h2>User Dashboard Report</h2>
      <UserKpiReportTable /> 
>>>>>>> origin/Reports
    </div>
  );
};

export default AdminHOC(UserReportPage);
