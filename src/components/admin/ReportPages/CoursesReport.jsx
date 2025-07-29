import React from "react";
import CourseKpiReportTable from "../../shared/table/CourseReportTable";
import AdminHOC from "../../shared/HOC/AdminHOC";

const CourseReportPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <h2>Course KPI Report</h2>
      <CourseKpiReportTable />
    </div>
  );
};

export default AdminHOC(CourseReportPage);
