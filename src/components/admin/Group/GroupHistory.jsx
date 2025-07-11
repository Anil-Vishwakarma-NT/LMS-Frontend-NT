import { Layout, Typography, Divider } from 'antd';
import { Table, Empty, Button, Space, Progress, Tooltip } from "antd";
import { UserAddOutlined, EditOutlined, DeleteOutlined, ExportOutlined, FolderOpenOutlined, FileAddOutlined, UserOutlined } from "@ant-design/icons";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUsersInGroup, getCourseDetails } from '../../../service/GroupService';
import ConfirmDeletePopup from '../../shared/confirmDeletePopup/ConfirmDeletePopup';
import { deleteSingleUser } from '../../../service/GroupService';
import Toast from '../../shared/toast/Toast';
import AddNewUserModal from './AddNewUSerModal';
import EditGroupNameModal from './EditGroupNameModal';
import AllocateCourseModal from './AllocateCourseModal';
import { useSelector } from "react-redux";



const { Content } = Layout;
const { Title } = Typography;

const GroupHistory = ({ setLoading }) => {


    const location = useLocation();
    const { id } = useParams();
    const [groupName, setGroupName] = useState(location.state?.name || 'N/A');
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [deleteUser, setDeleteUser] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState(null);
    const [showCourse, setShowCourse] = useState(false);
    const [courseList, setCourseList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredList, setFilteredList] = useState([]);
    const [EditPopOpen, setEditPopOpen] = useState(false)
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const [allocatecourseModalOpen, setAllocateCourseModalOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    async function getUsers() {

        const response = await getUsersInGroup(id);
        if (!Array.isArray(response)) {
            console.error("Expected an array but got:", response);
            setUserList([]);
            return;
        }
        const users = response.map((user, index) => ({
            id: user.userId,
            srno: index + 1,
            name: `${user.firstName} ${user.lastName}`,
            progress: user.progress,
            enrols: user.enrols,
            status: (user.progress > 95 ? 'Completed' : user.progress > 0 ? 'In progress' : 'Not started')
        }));

        setUserList(users);
    }

    async function getCourses() {
        const response = await getCourseDetails(id);
        console.log("RESPONSE FOR COURSES", response)
        const users = response.map((user, index) => ({
            id: user.courseId,
            srno: index + 1,
            name: user.courseName,
            progress: user.progress,
            enrols: user.enrols,
            status: (user.progress > 95 ? 'Completed' : user.progress > 0 ? 'In progress' : 'Not started')

        }));
        setCourseList(users);
    }

    const handleViewUserClick = (id, name) => {
        console.log("usersAdmin name ", id);
        if (!showCourse) {
            navigate(`/user-history/${id}`, {
                state: { name: name }
            });
        }
        else {
            navigate(`/course-content/${id}`)
        }
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseEdit = () => {
        setEditPopOpen(false);

    };

    const handleCloseAllocationModal = () => {
        setAllocateCourseModalOpen(false);
    }

    const handleAddNew = () => {
        setIsModalOpen(prev => !prev);
    };

    const handleViewCourse = () => {
        setShowCourse(prev => !prev);
    }

    const handleAllocateCourse = (userId) => {
        setUserId(userId);
        setAllocateCourseModalOpen(true);
    }

    const handleOpenConfirmDeletePopup = (user) => {
        setIsConfirmPopupOpen(true);
        setDeleteUser(user);
    };

    const handleEditGroup = () => {
        setEditPopOpen(prev => !prev);
    }
    const handleDeleteUser = async () => {
        try {
            setLoading(true)
            const groupdetails = {
                groupId: id,
                userId: deleteUser.id
            }
            const data = await deleteSingleUser(groupdetails);
            setToastMessage(data?.message || "User removed successfully!");
            setToastType("success");
            setShowToast(true);
            await getUsers();
            await getCourses();
        } catch (error) {
            setToastMessage(error?.message || "Error occurred while deleting the User.");
            setToastType("error");
            setShowToast(true);
        } finally {
            setIsConfirmPopupOpen(false);
            setDeleteUser(null);
            setLoading(false)
        }
    };
    useEffect(() => {
        getUsers();
        getCourses();
    }, [id]);


    useEffect(() => {
        if (showCourse) {
            setFilteredList(courseList);
        }
        else {
            setFilteredList(userList)
        }

        console.log("FilteredList ", filteredList);
    }, [showCourse, userList, courseList])


    const columns = [
        {
            title: 'Sr No.',
            dataIndex: 'srno',

        },
        {
            title: !showCourse ? 'User Name' : 'Course Name',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: 'Enrollments',
            dataIndex: 'enrols',
            key: 'enrols',
        },
        {
            title: 'Completion %',
            dataIndex: 'progress',
            render: (progress) => {
                const rounded = Number(progress.toFixed(1));   // 1‑decimal‑place number
                return (
                    <Progress
                        percent={rounded}
                        size="small"
                        type="circle"
                        strokeColor={
                            rounded >= 95 ? '#52c41a' : rounded >= 50 ? '#1890ff' : '#69c0ff'
                        }
                        format={(p) => `${p.toFixed(1)}%`}
                    />
                );

            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                { text: 'Completed', value: 'Completed' },
                { text: 'In Progress', value: 'In Progress' },
                { text: 'Not Started', value: 'Not Started' },
                { text: 'Defaulter', value: 'Defaulter' },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                const color = {
                    'completed': 'green',
                    'in progress': 'orange',
                    'not started': 'purple',
                    'defaulter': 'red'
                }[status?.toLowerCase()] || 'gray';
                return <span style={{ color }}>{status}</span>;
            },
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
                                handleViewUserClick(record?.id, record?.name)
                            }
                        />
                        {!showCourse && <Tooltip title="Allocate course">
                            <Button
                                icon={<FileAddOutlined />}
                                onClick={() => handleAllocateCourse(record.id)}
                            />
                        </Tooltip>
                        }
                    </Space>
                </>
            )
        }
    ];

    return (
        <div className="admin-section">
            <Content style={{ margin: '0 16px' }}>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360, backgroundColor: '#f5f7fa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                        {/* <DashboardOutlined style={{ fontSize: 28, marginRight: 16, color: '#1890ff' }} /> */}
                        <Title level={2} style={{ margin: 0 }}>{groupName}   Details</Title>
                        {/* </div>
                    <div> */}
                        <Button style={{ marginLeft: 30 }}
                            icon={<EditOutlined />}
                            onClick={handleEditGroup}
                        >
                        </Button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }} >
                         <Button style={{ marginLeft: 30 }}
                            icon={!showCourse ? <FolderOpenOutlined /> : <UserOutlined />}
                            onClick={handleViewCourse}
                        >
                            {!showCourse ? "View Course" : "View Users"}
                        </Button>
                        {!showCourse && <Button style={{ marginLeft: 30 }}
                            icon={<UserAddOutlined />}
                            onClick={handleAddNew}
                        >
                            Add new User
                        </Button>}
                       
                    </div>
                    <Divider style={{ marginTop: 0 }} />
                    {filteredList.length > 0 ? (
                        <Table
                            dataSource={filteredList}
                            columns={columns}
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
            </Content>
            <AddNewUserModal isModalOpen={isModalOpen} getUsers={getUsers} handleCloseModal={handleCloseModal} setShowToast={setShowToast}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                setLoading={setLoading}
                groupId={id}
                existingUsers={userList}
                courses={courseList}
                getCourses={getCourses} />
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
            <EditGroupNameModal
                isModalOpen={EditPopOpen}
                handleCloseModal={handleCloseEdit}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                setShowToast={setShowToast}
                setLoading={setLoading}
                groupName={groupName}
                groupId={id}
                setGroupName={setGroupName}

            />
            <AllocateCourseModal
                isModalOpen={allocatecourseModalOpen}
                groupId={id}
                userId={userId}
                getUsers={getUsers}
                getCourses={getCourses}
                handleCloseModal={handleCloseAllocationModal}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                setShowToast={setShowToast}
                setLoading={setLoading}
            />
        </div>
    );
};




export default AdminHOC(GroupHistory);