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
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
      render: (text) => new Date(text).toLocaleDateString(),
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
    {
      title: "Adherence",
      dataIndex: "adherence",
      key: "adherence",
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
