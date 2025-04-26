import React from "react";
import edit from "../../../assets/edit.png";
import deleteLogo from "../../../assets/delete.png";
import Tooltip from "../tooltip/Tooltip"; // Import Tooltip component
import "./Table.css";

const CourseContentTable = ({ onEditClick, fields, entries, onDeleteClick }) => {
  return (
    <div className="table-container">
      <div className="table-parent">
        <table className="books-table">
          <thead>
            <tr>
              {fields.map((field) => (
                <th key={field.index}>{field.title}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((item, i) => (
              <tr key={i}>
                <td>{item.courseContentId}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.courseName || "N/A"}</td>
                <td>{item.isActive ? "Yes" : "No"}</td>
                <td>
                  {item.createdAt
                    ? new Date(item.createdAt.split(".")[0]).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {item.updatedAt
                    ? new Date(item.updatedAt.split(".")[0]).toLocaleString()
                    : "N/A"}
                </td>
                <td>
                  {item.resourceLink ? (
                    <a
                      href={item.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.resourceLink}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
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
                        onClick={() => onDeleteClick(item.courseContentId)}
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

export default CourseContentTable;