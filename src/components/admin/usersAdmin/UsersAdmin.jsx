import React, { useEffect, useState } from "react";
import AdminHOC from "../../shared/HOC/AdminHOC";
import Toast from "../../shared/toast/Toast";
import {
  fetchAllActiveUsers,
  deleteUsers,
  fetchAllInactiveUsers,
  previewUserReportPdf, downloadUserReportPdf, downloadUserReportExcel
} from "../../../service/UserService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Empty, Button, Tag, Space, message, Tooltip } from "antd";
import { UserAddOutlined, EditOutlined, DeleteOutlined, ExportOutlined, FilePdfOutlined} from "@ant-design/icons";
import UsersModal from "./UsersModal";
import ConfirmDeletePopup from "../../shared/confirmDeletePopup/ConfirmDeletePopup";
import "./UsersAdmin.css"; // Importing CSS
import PDFReaderModal from "../../admin/booksAdmin/PDFReaderModal";
import UserReportOptionsModal from "../../admin/booksAdmin/UserReportOptionsModal";


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
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportBlobUrl, setReportBlobUrl] = useState("");
  const [reportingUserId, setReportingUserId] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [reportOptions, setReportOptions] = useState(null);

  const auth = useSelector((state) => state.auth);


  async function getUserLists() {
    const activeUsers = await fetchAllActiveUsers();
    const inactiveUsers = await fetchAllInactiveUsers();
    setUserList(activeUsers.data);
    setInactiveUserList(inactiveUsers.data);
  }

  useEffect(() => {
    getUserLists();
  }, []);

  const handleReportOptionsSubmit = async (options) => {
    try {
      setShowOptionsModal(false);
      setReportOptions(options);  
  
      const blob = await previewUserReportPdf(options);
      const blobUrl = URL.createObjectURL(blob);
      setReportBlobUrl(blobUrl);
      setIsReportModalOpen(true);
    } catch (err) {
      message.error("Failed to generate report");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      await downloadUserReportPdf(reportOptions); 
      message.success("PDF downloaded successfully");
    } catch {
      message.error("Failed to download PDF");
    }
  };
  
  const handleDownloadExcel = async () => {
    try {
      await downloadUserReportExcel(reportOptions);
      message.success("Excel downloaded successfully");
    } catch {
      message.error("Failed to download Excel");
    }
  };


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
              <Tooltip title="Edit">
                <Button
                  icon={<EditOutlined />}
                  style={{ marginRight: 8 }}
                  onClick={() => handleEditUser(record)}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  icon={<DeleteOutlined />}
                  style={{ marginRight: 8 }}
                  onClick={() => handleOpenConfirmDeletePopup(record)}
                />
              </Tooltip>
              <Tooltip title="View">
                <Button
                  icon={<ExportOutlined />}
                  onClick={() =>
                    handleViewUserClick(record?.id, record?.firstName + "  " + record?.lastName)
                  }
                />
              </Tooltip>
              <Tooltip title="Preview Report">
                <Button
                  icon={<FilePdfOutlined />}
                  onClick={() => {
                    setReportingUserId(record?.id);
                    setShowOptionsModal(true);  
                  }}
                />
              </Tooltip>
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

        <PDFReaderModal
        isOpen={isReportModalOpen}
        pdfUrl={reportBlobUrl}
        onClose={() => {
          setIsReportModalOpen(false);
          URL.revokeObjectURL(reportBlobUrl);
          setSelectedUser(null);
        }}
        blockTime={0}
        showDownload={true}
        onDownloadPdf={handleDownloadPdf}
        onDownloadExcel={handleDownloadExcel}
      />
      {showOptionsModal && (
      <UserReportOptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onSubmit={(options) => handleReportOptionsSubmit(options)}
        userId={String(reportingUserId)}
      />
        )}

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




