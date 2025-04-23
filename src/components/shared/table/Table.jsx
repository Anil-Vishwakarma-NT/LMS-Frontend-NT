import React from "react";
import edit from "../../../assets/edit.png";
import "./Table.css";
import deleteLogo from "../../../assets/delete.png";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import Tooltip from "../tooltip/Tooltip";

const Table = ({ onEditClick, fields, entries, type, onDeleteClick }) => {
  const navigate = useNavigate();

  const handleViewCourseClick = (courseId) => {
    navigate(`/course-details/${courseId}`);
  };

  return (
    <div className="table-container">
      <div className="table-parent">
        <table className="books-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Course ID</th>
              <th>Title</th>
              <th>Owner ID</th>
              <th>Level</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>  
                <td>{item.courseId} </td>
                <td>{item.title}</td>  
                <td>{item.ownerId}</td>  
                <td>{item.level}</td>  
                <td>{item.description}</td>  

                <td>
                  <div className="modifications">
                    <Tooltip tooltipText="Edit">
                      <img
                        src={edit}
                        alt="edit"
                        className="edit-logo"
                        onClick={() => {
                          console.log("Edit Clicked for Course:", item); // Debug Log
                          console.log("Full Course Object Being Passed:", JSON.stringify(item, null, 2)); // Detailed Debug
                          onEditClick(item); // Pass full object
                        }}
                      />
                    </Tooltip>
                    <Tooltip tooltipText="Delete">
                      <img
                        src={deleteLogo}
                        alt="delete"
                        className="edit-logo"
                        onClick={() => {
                          console.log("Clicked delete for:", item); // Debugging line
                          console.log("Course ID being passed:", item?.courseId); // Check if `courseId` is undefined
                          onDeleteClick(item); // Ensure full object is passed instead of only courseId
                        }}
                      />
                    </Tooltip>
                  </div>
                </td>

                <td>
                  <div className="view-btn">
                    <Button
                      text="View"
                      className="books-view"
                      onClick={() => handleViewCourseClick(item?.courseId)}
                    />
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

export default Table;