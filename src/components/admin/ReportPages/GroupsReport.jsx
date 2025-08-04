import React from "react";
import GroupKpiReportTable from "../../shared/table/GroupReportTable";
import AdminHOC from "../../shared/HOC/AdminHOC";

const GroupReportPage = () => {
  return (
    <div className="group-container">
      <h2>Group KPI Report</h2>
      <GroupKpiReportTable />
    </div>
  );
};

export default AdminHOC(GroupReportPage);
