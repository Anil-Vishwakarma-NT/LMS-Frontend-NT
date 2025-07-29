import React from "react";
import BundleKpiReportTable from "../../shared/table/BundleReportTable.jsx";
import AdminHOC from "../../shared/HOC/AdminHOC";

const BundleReportPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2>Bundle KPI Report</h2>
      <BundleKpiReportTable /> 
    </div>
  );
};

export default AdminHOC(BundleReportPage);
