import React from "react";
import UserKpiReportTable from "../../shared/table/UserReportTable";
import AdminHOC from "../../shared/HOC/AdminHOC";

const UserReportPage = () => {
  return (
    <div className="user-container">
      <h2>User KPI Report</h2>
      <UserKpiReportTable />
    </div>
  );
};

export default AdminHOC(UserReportPage);
