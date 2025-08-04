import React from "react";
import CourseKpiReportTable from "../../shared/table/CourseReportTable";
import AdminHOC from "../../shared/HOC/AdminHOC";

const CourseReportPage = () => {
  return (
    <div className="bundle-container">
      <h2>Course KPI Report</h2>
      <CourseKpiReportTable />
    </div>
  );
};

export default AdminHOC(CourseReportPage);
