import React, { useEffect, useState } from "react";
import AdminHOC from "../../shared/HOC/AdminHOC";
import Toast from "../../shared/toast/Toast";
import {
  fetchAllActiveUsers,
  deleteUsers,
  fetchAllInactiveUsers,
} from "../../../service/UserService";
import { useSelector } from "react-redux";
import { Table, Empty, Button, Tag } from "antd";
import { UserAddOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from "@ant-design/icons";
import UsersModal from "./UsersModal";
import "./UsersAdmin.css"; // Importing CSS

const UsersAdmin = ({ setLoading }) => {
  const [isInactive, setIsInactive] = useState(false);
  const [userList, setUserList] = useState([]);
  const [inactiveUserList, setInactiveUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(null);

  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    async function getUserLists() {
      const activeUsers = await fetchAllActiveUsers(auth.accessToken);
      const inactiveUsers = await fetchAllInactiveUsers(auth.accessToken);
      setUserList(activeUsers);
      setInactiveUserList(inactiveUsers);
    }
    getUserLists();
  }, []);

  const handleAddNew = () => {
    setSelectedUser(null); // reset selected user for new entry
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInactiveUsers = () => {
    setIsInactive((prev) => !prev);
  };

  const fields = [
    {
      dataIndex: "srNo",
      title: "Sr. No.",
      key: "srNo",
    },
    {
      dataIndex: "employeeId",
      title: "Employee Id",
      key: "employeeId",
    },
    {
      dataIndex: "name",
      title: "Name",
      key: "name",
    },
    {
      dataIndex: "manager",
      title: "Manager",
      key: "manager",
    },
    {
      dataIndex: "email",
      title: "E-Mail",
      key: "email",
    },
    {
      dataIndex: "role",
      title: "Role",
      key: "role",
      render: (role) => {
        const roleColor = {
          employee: "purple",
          manager: "blue",
        }[role?.toLowerCase()] || "gray";
        return <Tag color={roleColor}>{role || "Not Defined"}</Tag>;
      },
      filters: [
        { text: 'employee', value: 'employee' },
        { text: 'manager', value: 'manager' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => console.log("Edit", record)}
          />
          <Button
            icon={<DeleteOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => console.log("Delete", record)}
          />
          <Button
            icon={<ExportOutlined />}
            onClick={() => console.log("Export", record)}
          />
        </>
      )
    }
  ]
  const users = (isInactive ? inactiveUserList : userList) || [];
  const processedUsers = users.map((user, index) => ({
    key: user.userId,
    srNo: index + 1,
    employeeId: user.username,
    name: `${user.firstName} ${user.lastName}`,
    manager: user.manager || "N/A",
    email: user.email,
    role: user.role,
  }));

  return (
    <div className="admin-section">
      <div className="admin-page-mid">
        <div className="admin-header-bar">
          <h2 className="admin-page-header">All Employees</h2>
          <div className="admin-page-search">
            {!isInactive && (
              <Button
                icon={<UserAddOutlined />}
                onClick={handleAddNew}
              >
                Add New
              </Button>
            )}
            <Button
              icon={<UserAddOutlined />}
              onClick={handleInactiveUsers}
            >
              {isInactive ? "Active Users" : "Inactive Users"}
            </Button>
          </div>
        </div>
      
          <div className="user-table">
            {processedUsers.length > 0 ? (
              <Table
                dataSource={processedUsers}
                columns={fields}
                scroll={{ x: "100%" }}
                locale={{ emptyText: "No users found." }}
                rowKey="key"
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
       

        <UsersModal
          title={selectedUser ? "Edit Employee Details" : "Add New Employee"}
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          selectedUser={selectedUser}
          setToastMessage={setToastMessage}
          setToastType={setToastType}
          setShowToast={setShowToast}
          setLoading={setLoading}
        />

        <Toast
          message={toastMessage}
          type={toastType}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>

    </div>
  );
};

export default AdminHOC(UsersAdmin);
