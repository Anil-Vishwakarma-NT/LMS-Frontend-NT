import React from "react";
import edit from "../../../assets/edit.png";
import deleteLogo from "../../../assets/delete.png";
import { useNavigate } from "react-router-dom";
import Tooltip from "../tooltip/Tooltip";
import { MdVisibility } from "react-icons/md";

const CourseTable = ({ onEditClick, fields, entries, type, onDeleteClick }) => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <div className="table-parent">
        <table className="books-table">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Level</th>
              <th>Owner ID</th>
              <th>Is Active</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((item, i) => (
              <tr key={i}>
                <td>{item.courseId}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.level}</td>
                <td>{item.ownerId}</td>
                <td>{item.isActive ? "Yes" : "No"}</td>
                <td>
                  {item.createdAt
                    ? new Date(item.createdAt.split(".")[0]).toLocaleString()
                    : "N/A"}
                </td>
                <td>{new Date(item.updatedAt).toLocaleString()}</td>
                <td>
                  <div className="modifications">
                    <Tooltip tooltipText="Edit">
                      <img
                        src={edit}
                        alt="edit"
                        className="edit-logo"
                        onClick={() => onEditClick(item)}
                      />
                    </Tooltip>
                    <Tooltip tooltipText="Delete">
                      <img
                        src={deleteLogo}
                        alt="delete"
                        className="edit-logo"
                        onClick={() => onDeleteClick(item)}
                      />
                    </Tooltip>
                    <Tooltip tooltipText="View">
                      <MdVisibility
                        className="view-icon"
                        onClick={() => navigate(`/course-content/${item.courseId}`)}
                      />
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;