import AdminHOC from "../../shared/HOC/AdminHOC";
import Toast from "../../shared/toast/Toast";


import { Layout, Typography, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { getAllGroups, deleteGroup } from "../../../service/GroupService";
import { Table, Empty, Button, Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined, ExportOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import GroupModal from "./GroupModal";
import ConfirmDeletePopup from "../../shared/confirmDeletePopup/ConfirmDeletePopup";
import { useNavigate } from "react-router-dom";


const { Content } = Layout;
const { Title } = Typography;
const AllGroup = ({ setLoading }) => {


    const navigate = useNavigate();

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


    const processedGroups = groupList.map((group, index) => ({
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
                    </Space>
                </>
            )
        }
        //    : {}
        // )
    ]




    return (
        <div className="admin-section">
            <Content style={{ margin: '0 16px' }}>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360, backgroundColor: '#f5f7fa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                        {/* <DashboardOutlined style={{ fontSize: 28, marginRight: 16, color: '#1890ff' }} /> */}
                        <Title level={2} style={{ margin: 0 }}>Groups Overview</Title>
                        {/* </div>
                    <div> */}
                        <Button style={{ marginLeft: 100 }}
                            icon={<UsergroupAddOutlined />}
                            onClick={handleAddNew}
                        >
                            Add new Group
                        </Button>
                    </div>
                    <Divider style={{ marginTop: 0 }} />
                    <div className="user-table">
                        {processedGroups.length > 0 ? (
                            <Table
                                dataSource={processedGroups}
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

                </div>
            </Content>
            <GroupModal isModalOpen={isModalOpen} getGroups={getGroups} handleCloseModal={handleCloseModal} setShowToast={setShowToast}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                setLoading={setLoading} />
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