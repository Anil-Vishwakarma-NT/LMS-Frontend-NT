// import React from "react";
// import edit from "../../../assets/edit.png";
// import deleteLogo from "../../../assets/delete.png";
// import { useNavigate } from "react-router-dom";
// import Tooltip from "../tooltip/Tooltip";
// import { MdVisibility } from "react-icons/md";

// const CourseTable = ({ onEditClick, fields, entries, type, onDeleteClick }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="table-container">
//       <div className="table-parent">
//         <table className="books-table">
//           <thead>
//             <tr>
//               <th>Course ID</th>
//               <th>Title</th>
//               <th>Description</th>
//               <th>Level</th>
//               <th>Owner ID</th>
//               <th>Is Active</th>
//               <th>Created At</th>
//               <th>Updated At</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {entries?.map((item, i) => (
//               <tr key={i}>
//                 <td>{item.courseId}</td>
//                 <td>{item.title}</td>
//                 <td>{item.description}</td>
//                 <td>{item.level}</td>
//                 <td>{item.ownerId}</td>
//                 <td>{item.isActive ? "Yes" : "No"}</td>
//                 <td>
//                   {item.createdAt
//                     ? new Date(item.createdAt.split(".")[0]).toLocaleString()
//                     : "N/A"}
//                 </td>
//                 <td>{new Date(item.updatedAt).toLocaleString()}</td>
//                 <td>
//                   <div className="modifications">
//                     <Tooltip tooltipText="Edit">
//                       <img
//                         src={edit}
//                         alt="edit"
//                         className="edit-logo"
//                         onClick={() => onEditClick(item)}
//                       />
//                     </Tooltip>
//                     <Tooltip tooltipText="Delete">
//                       <img
//                         src={deleteLogo}
//                         alt="delete"
//                         className="edit-logo"
//                         onClick={() => onDeleteClick(item)}
//                       />
//                     </Tooltip>
//                     <Tooltip tooltipText="View">
//                       <MdVisibility
//                         className="view-icon"
//                         onClick={() => navigate(`/course-content/${item.courseId}`)}
//                       />
//                     </Tooltip>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CourseTable;



import QuizModal from "./QuizModal";
import React, { useState } from "react";

// import React from "react";
import { Table, Tooltip, Space, Button , message } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CourseTable = ({ onEditClick, fields, entries, type, onDeleteClick }) => {
  const navigate = useNavigate();
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleAddQuizClick = (course) => {
    setSelectedCourse(course);
    setQuizModalOpen(true);
  };

  const handleQuizSubmit = async (quizData) => {
  try {
    const response = 200
    // const response = await addQuizAPI(quizData); // Replace with actual API
    return { status: response };
  } catch (err) {
    message.error("Failed to add quiz");
    return null;
  }
};

  const columns = [
    {
      title: "Course ID",
      dataIndex: "courseId",
      key: "courseId",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Owner ID",
      dataIndex: "ownerId",
      key: "ownerId",
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) => (active ? "Yes" : "No"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        createdAt ? new Date(createdAt.split(".")[0]).toLocaleString() : "N/A",
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => new Date(updatedAt).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEditClick(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => onDeleteClick(record)}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/course-content/${record.courseId}`)}
            />
          </Tooltip>
          <Tooltip title="Add Quiz">
            <Button
              type="primary"
              onClick={() => handleAddQuizClick(record)}
            >
              Add Quiz
            </Button>
          </Tooltip>
          <Tooltip title="Go to Quiz List">
            <Button
              onClick={() => navigate(`/course-content/${record.courseId}/quizzes`)}
            >
              Quiz List
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

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
      {selectedCourse && (
        <QuizModal
          open={quizModalOpen}
          onClose={() => setQuizModalOpen(false)}
          onSubmit={handleQuizSubmit}
          course={selectedCourse}
        />
      )}
    </div>
  );
};

export default CourseTable;
