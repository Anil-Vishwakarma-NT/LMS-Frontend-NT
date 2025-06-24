import React, { useEffect, useState } from "react";
import AdminHOC from "../../shared/HOC/AdminHOC";
import Toast from "../../shared/toast/Toast";
import {
  fetchAllActiveUsers,
  deleteUsers,
  fetchAllInactiveUsers,
} from "../../../service/UserService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Empty, Button, Tag, Space } from "antd";
import { UserAddOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from "@ant-design/icons";
import UsersModal from "./UsersModal";
import ConfirmDeletePopup from "../../shared/confirmDeletePopup/ConfirmDeletePopup";
import "./UsersAdmin.css"; // Importing CSS

const UsersAdmin = ({ setLoading }) => {

  const navigate = useNavigate();

  const [isInactive, setIsInactive] = useState(false);
  const [userList, setUserList] = useState([]);
  const [inactiveUserList, setInactiveUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(null);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const auth = useSelector((state) => state.auth);


  async function getUserLists() {
    const activeUsers = await fetchAllActiveUsers();
    const inactiveUsers = await fetchAllInactiveUsers(auth.accessToken);
    setUserList(activeUsers.data);
    setInactiveUserList(inactiveUsers.data);
  }

  useEffect(() => {
    getUserLists();
  }, []);

  const handleAddNew = () => {
    setSelectedUser(null); // reset selected user for new entry
    setIsModalOpen(prev => !prev);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInactiveUsers = () => {
    setIsInactive((prev) => !prev);
  };

  const handleEditUser = (user) => {
    setIsModalOpen(prev => !prev);
    setSelectedUser(user);
  }

  const handleOpenConfirmDeletePopup = (user) => {
    setIsConfirmPopupOpen(true);
    setUserToDelete(user);
  };

  const handleViewUserClick = (id, name) => {
    console.log("usersAdmin name ", id);
    navigate(`/user-history/${id}`, {
      state: { name: name }
    });
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true)
      const data = await deleteUsers(userToDelete?.id);
      setToastMessage(data?.message || "User deleted successfully!");
      setToastType("success");
      setShowToast(true);
      await getUserLists();
    } catch (error) {
      setToastMessage(error?.message || "Error occurred while deleting the User.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsConfirmPopupOpen(false);
      setUserToDelete(null);
      setLoading(false)
    }
  };
  const fields = [
    {
      dataIndex: "srNo",
      title: "Sr. No.",
      key: "srNo",
      width: 70
    },
    {
      dataIndex: "employeeId",
      title: "Employee Id",
      key: "employeeId",
      width: 100
    },
    {
      dataIndex: "firstName",
      title: "FirstName",
      key: "firstName",
      width: 100
    },
    {
      dataIndex: "lastName",
      title: "LastName",
      key: "LastName",
      width: 100
    },
    {
      dataIndex: "manager",
      title: "Manager",
      key: "manager",
      width: 100
    },
    {
      dataIndex: "email",
      title: "E-Mail",
      key: "email",
      width: 200
    },
    {
      dataIndex: "role",
      title: "Role",
      key: "role",
      width: 100,
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
    }, (!isInactive ?
      {
        title: "Actions",
        key: "actions",
        width: 250,
        render: (text, record) => (
          <>
            <Space >
              <Button
                icon={<EditOutlined />}
                style={{ marginRight: 8 }}
                onClick={() => handleEditUser(record)}
              />
              <Button
                icon={<DeleteOutlined />}
                style={{ marginRight: 8 }}
                onClick={() => handleOpenConfirmDeletePopup(record)}
              />
              <Button
                icon={<ExportOutlined />}
                onClick={() =>
                  handleViewUserClick(record?.id, record?.firstName + "  " + record?.lastName)
                }
              />
            </Space>
          </>
        )
      } : {}
    )
  ]
  const users = (isInactive ? inactiveUserList : userList) || [];
  const processedUsers = users.map((user, index) => ({
    id: user.userId,
    srNo: index + 1,
    employeeId: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
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
              bordered
              scroll={{ x: "100%", y: "100%" }}
              locale={{ emptyText: "No users found." }}
              rowKey="id"
              pagination={{ position: 'bottomCenter' }}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>


        <UsersModal
          title={selectedUser ? "Edit Employee Details" : "Add New Employee"}
          isModalOpen={isModalOpen}
          getUserLists={getUserLists}
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

        <ConfirmDeletePopup
          isOpen={isConfirmPopupOpen}
          onClose={() => setIsConfirmPopupOpen(false)}
          onConfirm={handleDeleteUser}
        />
      </div>

    </div>
  );
};

export default AdminHOC(UsersAdmin);




