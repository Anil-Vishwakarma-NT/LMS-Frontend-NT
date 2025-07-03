import React, { useState } from "react";
import { Modal, Collapse, Checkbox } from "antd";

const { Panel } = Collapse;

const COURSE_DETAILS = "Course Details";
const COURSE_CONTENT_DETAILS = "Course Content Details";
const COURSE_USER_ENROLLMENT_DETAILS = "Course-User Enrollment Details";

const COURSE_KPIS = [
  "Course: Total Enrolled Users",
  "Course: Avg Completion %",
  "Course: Highest Completion %",
  "Course: Lowest Completion %",
  "Course: Users Completed the Course",
  "Course: Users In Progress",
  "Course: Users Not Started",
  "Course: Users Completed on Time",
  "Course: Users Completed Late",
  "Course: Users In Progress & On Time",
  "Course: Users In Progress & Late",
  "Course: Users Not Started & On Time",
  "Course: Users Not Started & Late"
];

const GLOBAL_KPIS = [
  "Global: Total Courses",
  "Global: Active Courses",
  "Global: Inactive Courses",
  "Global: Beginner-Level Courses",
  "Global: Intermediate-Level Courses",
  "Global: Professional-Level Courses",
  "Global: Course Enrollments",
  "Global: Enrolled Courses Completed",
  "Global: Enrolled Courses In-Progress",
  "Global: Enrolled Courses Not Started",
  "Global: Enrolled Courses Completed on Time",
  "Global: Enrolled Courses Completed Late",
  "Global: Enrolled Courses on Track",
  "Global: Enrolled Courses Not on Track",
  "Global: Enrolled Courses Yet to be Started (On Time)",
  "Global: Enrolled Courses Yet to be Started (Deadline Missed)"
];

const CourseReportOptionsModal = ({ isOpen, onClose, onSubmit, courseId }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (value) => {
    setSelectedOptions((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleGroupChange = (checkedValues, type) => {
    setSelectedOptions((prev) => {
      const filtered = prev.filter(
        (v) =>
          !(
            (type === "course" && COURSE_KPIS.includes(v)) ||
            (type === "global" && GLOBAL_KPIS.includes(v))
          )
      );
      return [...filtered, ...checkedValues];
    });
  };

  const handleOk = () => {
    if (selectedOptions.length === 0) return;
    onSubmit({ kpis: selectedOptions, courseId });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      okButtonProps={{ disabled: selectedOptions.length === 0 }}
      title="Select KPIs for Report"
      width={700}
    >
      <Checkbox
        checked={selectedOptions.includes(COURSE_DETAILS)}
        onChange={() => toggleOption(COURSE_DETAILS)}
      >
        Course Details
      </Checkbox>
      <br />
      <Checkbox
        checked={selectedOptions.includes(COURSE_CONTENT_DETAILS)}
        onChange={() => toggleOption(COURSE_CONTENT_DETAILS)}
      >
        Course Content Details
      </Checkbox>
      <br />
      <Checkbox
        checked={selectedOptions.includes(COURSE_USER_ENROLLMENT_DETAILS)}
        onChange={() => toggleOption(COURSE_USER_ENROLLMENT_DETAILS)}
      >
        Course-User Enrollment Details
      </Checkbox>

      <Collapse bordered style={{ marginTop: 16 }}>
        <Panel header="Course KPIs" key="1">
          <div style={{ maxHeight: 250, overflowY: "auto" }}>
            {COURSE_KPIS.map((kpi) => (
              <div key={kpi}>
                <Checkbox
                  value={kpi}
                  checked={selectedOptions.includes(kpi)}
                  onChange={() => toggleOption(kpi)}
                >
                  {kpi.replace("Course: ", "")}
                </Checkbox>
              </div>
            ))}
          </div>
        </Panel>
        <Panel header="Global KPIs" key="2">
          <div style={{ maxHeight: 250, overflowY: "auto" }}>
            {GLOBAL_KPIS.map((kpi) => (
              <div key={kpi}>
                <Checkbox
                  value={kpi}
                  checked={selectedOptions.includes(kpi)}
                  onChange={() => toggleOption(kpi)}
                >
                  {kpi.replace("Global: ", "")}
                </Checkbox>
              </div>
            ))}
          </div>
        </Panel>
      </Collapse>
    </Modal>
  );
};

export default CourseReportOptionsModal;
