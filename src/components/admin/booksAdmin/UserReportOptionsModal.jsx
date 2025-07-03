import React, { useState } from "react";
import { Modal, Collapse, Checkbox } from "antd";

const { Panel } = Collapse;

const USER_DETAILS = "User Details";
const ENROLLMENT_DETAILS = "Enrollment Details";
const PROGRESS_DETAILS = "Progress Details";

const GLOBAL_USER_KPIS = [
  "Global: Total Users",
  "Global: Total Enrolled Users",
  "Global: Total Non-Enrolled Users",
  "Global: Total Active Users",
  "Global: Total Inactive Users",
  "Global: Total Employees",
  "Global: Total Managers",
  "Global: Total User-Course Enrollments",
  "Global: Average Completion %",
  "Global: Highest Completion %",
  "Global: Lowest Completion %",
  "Global: Total Enrollments Completed",
  "Global: Total Enrollments in Progress",
  "Global: Total Enrollments Not Started",
  "Global: Enrollments Completed On Time",
  "Global: Enrollments Completed Late",
  "Global: Enrollments on Track",
  "Global: Enrollments Not on Track",
  "Global: Enrollments Yet to be Started (On Time)",
  "Global: Enrollments Yet to be Started (Deadline Missed)"
];

const USER_KPIS = [
  "User: Total Enrolled Courses",
  "User: Average Completion %",
  "User: Highest Completion %",
  "User: Lowest Completion %",
  "User: Courses Completed",
  "User: Courses in Progress",
  "User: Courses Not Started",
  "User: Courses Completed on Time",
  "User: Courses Completed Late",
  "User: Courses on Track",
  "User: Courses Not on Track",
  "User: Courses Yet to be Started (On Time)",
  "User: Courses Yet to be Started (Deadline Missed)"
];

const UserReportOptionsModal = ({ isOpen, onClose, onSubmit, userId }) => {
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
            (type === "global" && GLOBAL_USER_KPIS.includes(v)) ||
            (type === "user" && USER_KPIS.includes(v))
          )
      );
      return [...filtered, ...checkedValues];
    });
  };

  const handleOk = () => {
    if (selectedOptions.length === 0) return;
    onSubmit({ kpis: selectedOptions, userId });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      okButtonProps={{ disabled: selectedOptions.length === 0 }}
      title="Select KPIs for User Report"
      width={700}
    >
      <Checkbox
        checked={selectedOptions.includes(USER_DETAILS)}
        onChange={() => toggleOption(USER_DETAILS)}
      >
        User Details
      </Checkbox>
      <br />
      <Checkbox
        checked={selectedOptions.includes(ENROLLMENT_DETAILS)}
        onChange={() => toggleOption(ENROLLMENT_DETAILS)}
      >
        Enrollment Details
      </Checkbox>
      <br />
      <Checkbox
        checked={selectedOptions.includes(PROGRESS_DETAILS)}
        onChange={() => toggleOption(PROGRESS_DETAILS)}
      >
        Progress Details
      </Checkbox>

      <Collapse bordered style={{ marginTop: 16 }}>

        <Panel header="User KPIs" key="2">
          <div style={{ maxHeight: 250, overflowY: "auto" }}>
            {USER_KPIS.map((kpi) => (
              <div key={kpi}>
                <Checkbox
                  value={kpi}
                  checked={selectedOptions.includes(kpi)}
                  onChange={() => toggleOption(kpi)}
                >
                  {kpi.replace("User: ", "")}
                </Checkbox>
              </div>
            ))}
          </div>
        </Panel>
        <Panel header="Global KPIs" key="1">
          <div style={{ maxHeight: 250, overflowY: "auto" }}>
            {GLOBAL_USER_KPIS.map((kpi) => (
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

export default UserReportOptionsModal;
