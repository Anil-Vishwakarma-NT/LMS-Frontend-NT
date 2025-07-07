import UserHOC from "../../shared/HOC/UserHOC";
import Toast from "../../shared/toast/Toast";
import { Layout, Typography, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { getUserGroups, deleteGroup } from "../../../service/GroupService";
import { Table, Empty, Button, Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined, ExportOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const { Content } = Layout;
const { Title } = Typography;
const UserGroup = ({ setLoading }) => {


    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const [groupList, setGroupList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState(null);


    async function getGroups() {
        const groups = await getUserGroups();
        console.log("GROUPS USER ENROLLED IN", groups)
        setGroupList(groups);
    }

    useEffect(() => {
        getGroups();
        console.log("USER AUTH", auth)
    }, [])


    const processedGroups = groupList?.map((group, index) => ({
        id: group.groupId,
        srNo: index + 1,
        groupName: group.groupName,
        progress: group.progress || "N/A",
    }));




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
            dataIndex: "progress",
            title: "Progress",
            key: "progress",
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
                            icon={<ExportOutlined />}
                            onClick={() =>
                                handleViewGroupClick(record?.id, record?.groupName)
                            }
                        />
                    </Space>
                </>
            )
        }
    ]




    return (
        <div className="admin-section">
            <Content style={{ margin: '0 16px' }}>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360, backgroundColor: '#f5f7fa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                        <Title level={2} style={{ margin: 0 }}>Groups Overview</Title>
                    </div>
                    <Divider style={{ marginTop: 0 }} />
                    <div className="user-table">
                        {processedGroups?.length > 0 ? (
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
            <Toast
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={() => setShowToast(false)}
            />

        </div>
    );
};

export default UserHOC(UserGroup);