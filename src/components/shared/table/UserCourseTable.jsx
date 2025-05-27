import React from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "../tooltip/Tooltip";
import { MdVisibility } from "react-icons/md";
import { useSelector } from "react-redux";

const UserCourseTable = ({ fields, entries }) => {
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  console.log("auth object", auth);  // Logs the entire auth object
  console.log("user role", auth?.roles);  // Checks for the specific role value

  return (
    <div className="table-container">
      <div className="table-parent">
        <table className="books-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Level</th>
              <th>Description</th>
              <th>Assigned By</th>
              <th>Enrollment Date</th>
              <th>Deadline</th>
              <th>Completion Percentage</th>
              <th>Status</th>
              {auth.roles !== "admin" && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {entries?.map((item, i) => (
              <tr key={i}>
                <td>{item.title}</td>
                <td>{item.level}</td>
                <td>{item.description}</td>
                <td>{item.assignedById}</td>
                <td>{new Date(item.enrollmentDate).toLocaleString()}</td>
                <td>{new Date(item.deadline).toLocaleString()}</td>
                <td>{item.roundedCompletion}%</td>
                <td>{item.status}</td>
                {/* Conditionally render the action column */}
                {auth.roles !== "admin" && (
                  <td>
                    <Tooltip tooltipText="View">
                      <MdVisibility
                        className="view-icon"
                        onClick={() => navigate(`/course-content-user/${item.courseId}`)}
                      />
                    </Tooltip>
                  </td>
                )}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default UserCourseTable;