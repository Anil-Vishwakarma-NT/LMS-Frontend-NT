// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Tooltip from "../tooltip/Tooltip";
// import { MdVisibility } from "react-icons/md";
// import { useSelector } from "react-redux";

// const UserCourseTable = ({ fields, entries, showViewAction }) => {
//   const navigate = useNavigate();
//   const auth = useSelector(state => state.auth);
//   console.log("auth object", auth);  // Logs the entire auth object
//   console.log("user role", auth?.roles);  // Checks for the specific role value

//   return (
//     <div className="table-container">
//       <div className="table-parent">
//         <table className="books-table">
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Level</th>
//               <th>Description</th>
//               <th>Assigned By</th>
//               <th>Enrollment Date</th>
//               <th>Deadline</th>
//               <th>Completion Percentage</th>
//               <th>Status</th>
//               {(auth.roles !== "admin" && showViewAction) && <th>Action</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {entries?.map((item, i) => (
//               <tr key={i}>
//                 <td>{item.title}</td>
//                 <td>{item.level}</td>
//                 <td>{item.description}</td>
//                 <td>{item.assignedById}</td>
//                 <td>{new Date(item.enrollmentDate).toLocaleString()}</td>
//                 <td>{new Date(item.deadline).toLocaleString()}</td>
//                 <td>{item.roundedCompletion}%</td>
//                 <td>{item.status}</td>
//                 {/* Conditionally render the action column */}
//                 {(auth.roles !== "admin" && showViewAction)&& (
//                   <td>
//                     <Tooltip tooltipText="View">
//                       <MdVisibility
//                         className="view-icon"
//                         onClick={() => navigate(`/course-content-user/${item.courseId}`)}
//                       />
//                     </Tooltip>
//                   </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// };

// export default UserCourseTable;




import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tooltip, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const UserCourseTable = ({ entries, showViewAction }) => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Assigned By",
      dataIndex: "assignedById",
      key: "assignedById",
    },
    {
      title: "Enrollment Date",
      dataIndex: "enrollmentDate",
      key: "enrollmentDate",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Completion %",
      dataIndex: "roundedCompletion",
      key: "roundedCompletion",
      render: (value) => `${value}%`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  // Conditionally push Action column
  if (auth.roles !== "admin" && showViewAction) {
    columns.push({
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="View">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() =>
              navigate(`/course-content-user/${record.courseId}`)
            }
          />
        </Tooltip>
      ),
    });
  }

  return (
    <div style={{ padding: "16px",
      marginLeft:"35px",
      marginRight:"25px",
     }}>
        <Table
          columns={columns}
          dataSource={entries}
          rowKey={(record) => record.courseId}
          bordered
          pagination={{ pageSize: 10 }}
        />
      </div>
  );
};

export default UserCourseTable;
