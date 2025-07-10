import { Layout, Typography, Divider } from 'antd';
import { Table, Empty, Button, Tag, Space, Progress, Tooltip, Row, Col } from "antd";
import { UserAddOutlined, EditOutlined, DeleteOutlined, ExportOutlined, FolderOpenOutlined, FileAddOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import UserHOC from "../../shared/HOC/UserHOC";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUsersNameInGroup, getCourseNameDetails } from '../../../service/GroupService';
import { deleteSingleUser } from '../../../service/GroupService';
import { useSelector } from "react-redux";
import { Card, Statistic } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

const UserGroupHistory = ({ setLoading }) => {


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
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(() => (window.innerHeight >= 1024 ? 11 : 10));
    const [totalPages, setTotalPages] = useState(0);



    async function getUsers() {

        const response = await getUsersNameInGroup(id);
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
        const response = await getCourseNameDetails(id);
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
        },


    ];

    return (
        <div className="admin-section" style={{ overflowY: "hidden" }}>
            <Content style={{ margin: '0 16px' }}>
                <div className="site-layout-background" style={{ padding: 14, minHeight: 360, backgroundColor: '#f5f7fa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                        {/* <DashboardOutlined style={{ fontSize: 28, marginRight: 16, color: '#1890ff' }} /> */}
                        <Title level={2} style={{ margin: 0 }}>{groupName}   Details</Title>


                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }} >
                    </div>
                    <Divider style={{ marginTop: 0 }} />
                    <Row>

                        <Card title={
                            <span>
                                <UserOutlined style={{ color: '#FF4D4F', marginRight: 16 }} />
                                Members of the group
                            </span>
                        } bordered style={{ width: 600, margin: 5, marginRight: 30 }}>
                            <Table
                                dataSource={userList}
                                columns={columns}
                                pagination={{
                                    current: pageNumber + 1,
                                    pageSize,
                                    total: totalPages * pageSize,
                                    onChange: (page) => setPageNumber(page - 1),
                                    showSizeChanger: false,
                                }}
                                scroll={{ x: '100%', y: '100%' }}
                                locale={{ emptyText: 'No courses found for this user.' }}
                                rowKey={(record) => record.courseId}
                            />
                        </Card>

                        <Card title={
                            <span>
                                <BookOutlined style={{ color: '#FF4D4F', marginRight: 8 }} />
                                courses of the group
                            </span>
                        } bordered style={{ width: 600, margin: 5 }}>
                            <Table
                                dataSource={courseList}
                                columns={columns}
                                pagination={{
                                    current: pageNumber + 1,
                                    pageSize,
                                    total: totalPages * pageSize,
                                    onChange: (page) => setPageNumber(page - 1),
                                    showSizeChanger: false,
                                }}
                                scroll={{ x: '100%', y: '100%' }}
                                locale={{ emptyText: 'No courses found for this user.' }}
                                rowKey={(record) => record.courseId}
                            />
                        </Card>
                    </Row>
                </div>
            </Content>
        </div>
    );
};




export default UserHOC(UserGroupHistory);