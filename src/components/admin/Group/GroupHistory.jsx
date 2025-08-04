import { Layout, Typography, Divider, Radio } from 'antd';
import { Table, Empty, Button, Tag, Space, Progress, Tooltip, Row, Select } from "antd";
import { UserAddOutlined, EditOutlined, DeleteOutlined, ArrowLeftOutlined, ExportOutlined, FolderOpenOutlined, FileAddOutlined, UserOutlined } from "@ant-design/icons";
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
import { bundlesOfGroup } from '../../../service/BundleService';

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const GroupHistory = ({ setLoading }) => {
    const { id } = useParams();
    const location = useLocation();
    const [groupName, setGroupName] = useState(location.state?.name || 'N/A');
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [deleteUser, setDeleteUser] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState(null);
    const [showCourse, setShowCourse] = useState(false);
    const [courseList, setCourseList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredList, setFilteredList] = useState([]);
    const [EditPopOpen, setEditPopOpen] = useState(false);
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const [allocatecourseModalOpen, setAllocateCourseModalOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const [bundleList, setBundleList] = useState([]);
    const [courseFilter, setCourseFilter] = useState("all");
    const [dataLoaded, setDataLoaded] = useState(false);

    async function getUsers() {
        const response = await getUsersInGroup(id);
        if (!Array.isArray(response)) {
            console.error("Expected an array but got:", response);
            setUserList([]);
            return;
        }
        const users = response.map((user, index) => ({
            id: user.userId,
            name: `${user.firstName} ${user.lastName}`,
            progress: user.progress,
            enrols: user.enrols,
            srno: index + 1
        }));
        setUserList(users);
    }

    async function getCourses() {
        const response = await getCourseDetails(id);
        const users = response.map((user) => ({
            id: user.courseId,
            name: user.courseName,
            progress: user.progress,
            enrols: user.enrols,
            type: "Course"
        }));
        setCourseList(users);
    }

    async function getBundles() {
        const response = await bundlesOfGroup(id);
        const bundles = response?.map((bundle) => ({
            id: bundle.bundleId,
            name: bundle.bundleName,
            progress: bundle.progress,
            enrols: bundle.enrols,
            type: "Bundle"
        }));
        setBundleList(bundles);
    }

    const handleViewUserClick = (record) => {
        if (!showCourse) {
            navigate(`/user-history/${record.id}`, { state: { name: record.name } });
        } else {
            if (record.type === "Course") {
                navigate(`/course-content/${record.id}`);
            }
            if (record.type === "Bundle") {
                navigate(`/bundles-history/${record.id}`, { state: { name: record.name } });
            }
        }
    };

    const handleCloseModal = () => setIsModalOpen(false);
    const handleCloseEdit = () => setEditPopOpen(false);
    const handleCloseAllocationModal = () => setAllocateCourseModalOpen(false);

    const handleAddNew = () => setIsModalOpen(prev => !prev);
    const handleViewCourse = () => setShowCourse(prev => !prev);

    useEffect(() => {
        async function fetchAllData() {
            await Promise.all([getUsers(), getCourses(), getBundles()]);
            setDataLoaded(true);
        }
        fetchAllData();
    }, [id]);


    const handleAllocateCourse = (record) => {
        console.log("USER ID GROUP HISTORY", record.id)
        setUserId(record.id);
        setAllocateCourseModalOpen(true);
    };

    const handleOpenConfirmDeletePopup = (user) => {
        setIsConfirmPopupOpen(true);
        setDeleteUser(user);
    };
    const handleEditGroup = () => setEditPopOpen(prev => !prev);

    const handleDeleteUser = async () => {
        try {
            setLoading(true);
            const groupdetails = { groupId: id, userId: deleteUser.id };
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
            setLoading(false);
        }
    };



    useEffect(() => {
        if (showCourse) {
            let combined = [];
            if (courseFilter === "all") {
                combined = [...bundleList, ...courseList].map((item, index) => ({ ...item, srno: index + 1 }));
            } else if (courseFilter === "bundle") {
                combined = bundleList.map((item, index) => ({ ...item, srno: index + 1 }));
            } else if (courseFilter === "standalone") {
                combined = courseList.map((item, index) => ({ ...item, srno: index + 1 }));
            }
            setFilteredList(combined);
        } else {
            setFilteredList(userList);
        }
    }, [showCourse, courseFilter, userList, courseList, bundleList]);

    const columns = [
        { title: 'Sr No.', dataIndex: 'srno' },
        { title: !showCourse ? 'User Name' : 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Enrollments', dataIndex: 'enrols', key: 'enrols' },
        {
            title: 'Completion %',
            dataIndex: 'progress',
            render: (progress) => {
                const rounded = Number(progress?.toFixed(1));
                return (
                    <Progress percent={rounded} size="small" type="circle"
                        strokeColor={rounded >= 95 ? '#52c41a' : rounded >= 50 ? '#1890ff' : '#69c0ff'}
                        format={(p) => `${p?.toFixed(1)}%`} />
                );
            }
        },
        showCourse && courseFilter === "all" ? {
            title: 'Type',
            dataIndex: 'type',
            render: (type) => (
                <Tag color={type === "Bundle" ? "green" : "blue"}>{type}</Tag>
            )
        } : null,
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Space>
                    {!showCourse && <Button icon={<DeleteOutlined />} onClick={() => handleOpenConfirmDeletePopup(record)} />}
                    <Button icon={<ExportOutlined />} onClick={() => handleViewUserClick(record)} />
                    {!showCourse && <Tooltip title="Allocate course">
                        <Button icon={<FileAddOutlined />} onClick={() => handleAllocateCourse(record)} />
                    </Tooltip>}
                </Space>
            )
        }
    ].filter(Boolean);

    return (
        <div className="group-container">
            <div className="group-header">
                <div className="group-title-container">
                    <Tooltip title="Back to groups">
                        <Button
                            icon={<ArrowLeftOutlined style={{ fontSize: 20 }} />}
                            className="back-btn"
                            onClick={() => navigate("/group")}
                        />
                    </Tooltip>
                    <Title level={2} className="group-title">
                        {groupName} History
                    </Title>
                </div>
            </div>

            <div className='add-btn-div'>
                <Space>
                    <Tooltip title={!showCourse ? "View courses allocated to the group" : "View members of the group"}>
                        <Button
                            icon={!showCourse ? <FolderOpenOutlined /> : <UserOutlined />}
                            onClick={handleViewCourse}
                            className='add-btn'
                        >
                            {!showCourse ? "View Course" : "View Users"}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Add user to the group">
                        {!showCourse && (
                            <Button icon={<UserAddOutlined />} onClick={handleAddNew} className="add-btn">
                                Add User
                            </Button>
                        )}
                    </Tooltip>
                    {showCourse && (
                        <Select
                            value={courseFilter}
                            onChange={(value) => { setCourseFilter(value) }}
                            placeholder="Select Filter"
                        >
                            <Option value="all">All Allocations</Option>
                            <Option value="bundle">Bundles</Option>
                            <Option value="standalone">Courses</Option>
                        </Select>
                    )}
                </Space>
            </div>


            <Divider />

            <div className="group-table">
                <div className="group-subtitle">
                    {showCourse
                        ? courseFilter === "all"
                            ? "Courses and bundles allocated to the group"
                            : courseFilter === "bundle"
                                ? "All Bundles allocated to the group"
                                : "All Courses allocated to the group"
                        : "Users in the group"}
                </div>

                {filteredList.length > 0 && dataLoaded ? (
                    <Table
                        dataSource={filteredList}
                        columns={columns}
                        bordered
                        scroll={{ x: true }}
                        locale={{ emptyText: "No data found." }}
                        rowKey="id"
                        pagination={{ position: 'bottomCenter' }}
                    />
                ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
            </div>

            <AddNewUserModal isModalOpen={isModalOpen}
                getUsers={getUsers}
                handleCloseModal={handleCloseModal}
                setShowToast={setShowToast}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                setLoading={setLoading}
                groupId={id}
                existingUsers={userList}
                courses={courseList}
                bundles={bundleList}
                getBundles={getBundles}
                getCourses={getCourses}
            />



            <Toast message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={() => setShowToast(false)} />


            <ConfirmDeletePopup isOpen={isConfirmPopupOpen}
                onClose={() => setIsConfirmPopupOpen(false)}
                onConfirm={handleDeleteUser} />


            <EditGroupNameModal isModalOpen={EditPopOpen}
                handleCloseModal={handleCloseEdit}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                setShowToast={setShowToast}
                setLoading={setLoading}
                groupName={groupName}
                groupId={id}
                setGroupName={setGroupName} />


            <AllocateCourseModal isModalOpen={allocatecourseModalOpen}
                groupId={id}
                userId={userId}
                getUsers={getUsers}
                getCourses={getCourses}
                getBundles={getBundles}
                handleCloseModal={handleCloseAllocationModal}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                setShowToast={setShowToast}
                setLoading={setLoading} />
        </div>
    );
};

export default AdminHOC(GroupHistory);
