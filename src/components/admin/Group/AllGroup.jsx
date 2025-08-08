import AdminHOC from "../../shared/HOC/AdminHOC";
import Toast from "../../shared/toast/Toast";
import { Layout, Typography, Divider, Tooltip } from 'antd';
import { useState, useEffect } from 'react';
import { getAllGroups, deleteGroup } from "../../../service/GroupService";
import { Table, Empty, Button, Tag, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, ExportOutlined, UsergroupAddOutlined, EyeOutlined } from "@ant-design/icons";
import GroupModal from "./GroupModal";
import ConfirmDeletePopup from "../../shared/confirmDeletePopup/ConfirmDeletePopup";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Group.css";

const { Content } = Layout;
const { Title } = Typography;
const AllGroup = ({ setLoading }) => {


    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [groupList, setGroupList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState(null);
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);

    async function getGroups() {
        const groups = await getAllGroups();
        setGroupList(groups);
    }

    useEffect(() => {
        getGroups();
    }, [])


    const processedGroups = groupList?.map((group, index) => ({
        id: group.groupId,
        srNo: index + 1,
        groupName: group.groupName,
        creatorName: group.creatorName || "N/A",
    }));

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddNew = () => {
        setIsModalOpen(prev => !prev);
    };

    const handleOpenConfirmDeletePopup = (group) => {
        setIsConfirmPopupOpen(true);
        setGroupToDelete(group);
    };

    const handleDeleteGroup = async () => {
        try {
            setLoading(true)
            const data = await deleteGroup(groupToDelete?.id);
            setToastMessage(data?.message || "Group deleted successfully!");
            setToastType("success");
            setShowToast(true);
            await getGroups();
        } catch (error) {
            setToastMessage(error?.message || "Error occurred while deleting the Group.");
            setToastType("error");
            setShowToast(true);
        } finally {
            setIsConfirmPopupOpen(false);
            setGroupToDelete(null);
            setLoading(false)
        }
    };

    const handleViewGroupClick = (id, name) => {
        console.log("usersAdmin name ", id);
        navigate(`/group-history/${id}`, {

            state: { name: name }
        });
    };



    const fields = [
        {
            dataIndex: "srNo",
            title: "Sr. No.",
            key: "srNo",
            width: 70
        },
        {
            dataIndex: "groupName",
            title: "Group Name",
            key: "groupName",
            width: 100
        },
        {
            dataIndex: "creatorName",
            title: "Created By",
            key: "creatorName",
            width: 100
        },
        {
            title: "Actions",
            key: "actions",
            width: 250,
            render: (text, record) => (
                <>
                    <Space >
                        <Button
                            icon={<DeleteOutlined />}
                            style={{ marginRight: 8 }}
                            onClick={() => handleOpenConfirmDeletePopup(record)}
                        />
                        <Button
                            icon={<ExportOutlined />}
                            onClick={() =>
                                handleViewGroupClick(record?.id, record?.groupName)
                            }
                        />
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => {
                            navigate(`/group-report/${record?.id}`);
                            }}
                        />
                    </Space>
                </>
            )
        }

    ]




    return (
        <div className="group-container">
            <div className="group-header">
                <Title level={2} className="group-title"><UsergroupAddOutlined style={{ paddingRight: 12 }} />Active Groups Overview</Title>

            </div>
            <div className="add-btn-div">
                <Tooltip title="create new group">
                    <Button
                        icon={<UsergroupAddOutlined />}
                        onClick={handleAddNew}
                        className="add-btn"
                    >
                        Add new Group
                    </Button>
                </Tooltip>
                <Button
                    icon={<ExportOutlined />}
                    onClick={() => navigate("/group-report")}
                    className="add-btn"
                >
                    Report
                </Button>

            </div>


            <Divider />

            <div className="group-table">
                {processedGroups?.length > 0 ? (
                    <Table
                        dataSource={processedGroups}
                        columns={fields}
                        bordered
                        scroll={{ x: true }}
                        locale={{ emptyText: "No groups found." }}
                        rowKey="id"
                        pagination={{ position: 'bottomCenter' }}
                    />
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>

            {/* Modals and Popups */}
            <GroupModal
                isModalOpen={isModalOpen}
                getGroups={getGroups}
                handleCloseModal={handleCloseModal}
                setShowToast={setShowToast}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
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
                onConfirm={handleDeleteGroup}
            />
        </div>

    );
};

export default AdminHOC(AllGroup);