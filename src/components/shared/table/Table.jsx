import React from "react";
import edit from "../../../assets/edit.png";
import './Table.css'
import deleteLogo from "../../../assets/delete.png";
import assignUser from "../../../assets/clipboard.png";
import Button from "../button/Button";
import { useNavigate } from "react-router-dom";
import Tooltip from "../tooltip/Tooltip";

const Table = ({
  onEditClick,
  fields,
  entries,
  type,
  onDeleteClick,
  onAssignClick,
  pageNumber,
  pageSize,
  is_Inactive,
}) => {
  const navigate = useNavigate();

  const handleViewBookClick = (id) => {
    navigate(`/book-history/${id}`);
  };
  const handleViewUserClick = (id) => {
    navigate(`/user-history/${id}`);
  };

  const renderProgressBar = (value) => {
    const percentage = parseInt(value); // Convert "80%" to 80
    return (
      <div style={{ width: '100%', background: '#eee', borderRadius: 4 }}>
        <div
          style={{
            width: `${percentage}%`,
            background: percentage > 80 ? '#4caf50' : '#ff9800',
            height: '10px',
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }}
        ></div>
        <div style={{ fontSize: 12, textAlign: 'right' }}>{value}</div>
      </div>
    );
  }
  return (
    <div className="table-container">
      <div className="table-parent">
        <table className="books-table">
          <thead>
            <tr>
              {fields &&
                fields.length &&
                fields.map((item) => <th key={item.index}>{item.title}</th>)}
            </tr>
          </thead>
          <tbody>
            {entries?.map(
              (item, i) =>
              (
                <tr key={item.index}>
                  {Object.entries(item).map(([key, value]) => {
                    if (key === "id") {
                      return null;
                    }
                    if (type === "user") {
                      if (key !== "token") {
                        return (
                          <td>
                            {typeof value === "object" ? value?.name : value}
                          </td>
                        );
                      }
                    }
                  })}

                  {type !== "dash-category" && type !== "dash-user" && !is_Inactive && (
                    <td>
                      <div className="modifications">
                        {type !== "dash-category" &&
                          type !== "book-history" &&
                          type !== "user-history" && (
                            <Tooltip tooltipText="Edit">
                              <img
                                src={edit}
                                alt="edit"
                                className={`edit-logo ${type === 'issuance' && item?.status === 'Returned' ? "disabled" : ""}`}
                                onClick={() => type === 'issuance' && item?.status === 'Returned' ? {} : onEditClick(item)}
                              ></img>
                            </Tooltip>
                          )}
                        {type !== "issuance" &&
                          type !== "dash-category" &&
                          type !== "book-history" &&
                          type !== "user-history" && (
                            <Tooltip tooltipText="Delete">
                              <img
                                data-testid={`delete-icon-${item?.id}`}
                                src={deleteLogo}
                                alt="delete"
                                className="edit-logo"
                                onClick={() => onDeleteClick(item)}
                              ></img>
                            </Tooltip>
                          )}
                        {/* {type === "user" && (
                            <Tooltip tooltipText="Issue Book">
                              <img
                                src={assignBook}
                                alt="assign"
                                className="edit-logo"
                                onClick={() => onAssignClick(item)}
                              ></img>
                            </Tooltip>
                          )} */}
                        {type === "book" && (
                          <Tooltip tooltipText="Issue Book">
                            <img
                              src={assignUser}
                              alt="assign"
                              className="edit-logo"
                              onClick={() => onAssignClick(item)}
                            ></img>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                  )}
                  {type === "book" && (
                    <td>
                      <div className="view-btn">
                        <Button
                          text="View"
                          className="books-view"
                          onClick={() => handleViewBookClick(item?.id)}
                        />
                      </div>
                    </td>
                  )}
                  {type === "user" && (
                    <td>
                      <div className="view-btn">
                        <Button
                          text="Details"
                          className="books-view"
                          onClick={() =>
                            handleViewUserClick(item?.id)
                          }
                        />
                      </div>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;