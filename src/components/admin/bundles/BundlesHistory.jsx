import { Layout, Typography, Divider } from 'antd';
import { Table, Empty, Button, Tag, Space, Progress, Tooltip } from "antd";
import { BookOutlined, EditOutlined, DeleteOutlined, ExportOutlined, FolderOpenOutlined, FileAddOutlined, UserOutlined } from "@ant-design/icons";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUsersInGroup } from '../../../service/GroupService';
import ConfirmDeletePopup from '../../shared/confirmDeletePopup/ConfirmDeletePopup';
import { deleteSingleUser } from '../../../service/GroupService';
import Toast from '../../shared/toast/Toast';
import { useSelector } from "react-redux";
import AddNewCourseModal from './AddNewCourseModal';
import { getAllBundleCourses, deleteCourseFromBundle } from '../../../service/BundleService';
import EditBundleNameModal from './EditBundleNameModal';
const { Content } = Layout;
const { Title } = Typography;

const GroupHistory = ({ setLoading }) => {

    const { id } = useParams();
    const location = useLocation();
    const [bundleName, setBundleName] = useState(location.state?.name || 'N/A');
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [deleteCourse, setDeleteCourse] = useState([]);
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

    async function getCourses() {
        const response = await getAllBundleCourses(id);
        console.log("RESPONSE FOR COURSES", response)
        const users = response.map((user, index) => ({
            id: user.courseId,
            srno: index + 1,
            name: user.title,
            status: user.active ? "Active" : "Removed"
        }));
        setCourseList(users);
    }

    const handleViewUserClick = (id, name) => {
        console.log("usersAdmin name ", id);

        navigate(`/course-content/${id}`)
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseEdit = () => {
        setEditPopOpen(false);

    };

    const handleAddNew = () => {
        setIsModalOpen(prev => !prev);
    };

    const handleOpenConfirmDeletePopup = (course) => {
        setIsConfirmPopupOpen(true);
        setDeleteCourse(course);
    };
    const handleEditBundle = () => {
        setEditPopOpen(prev => !prev);
    }
    const handleDeleteCourse = async () => {
        try {
            setLoading(true)
            const data = await deleteCourseFromBundle(id, deleteCourse.id);
            setToastMessage(data?.message || "User removed successfully!");
            setToastType("success");
            setShowToast(true);
            getCourses();
        } catch (error) {
            setToastMessage(error?.message || "Error occurred while deleting the User.");
            setToastType("error");
            setShowToast(true);
        } finally {
            setIsConfirmPopupOpen(false);
            setDeleteCourse(null);
            setLoading(false)
        }
    };
    useEffect(() => {
        getCourses();
    }, [id]);


    useEffect(() => {
        setFilteredList(courseList);
        console.log("FilteredList ", filteredList);
    }, [courseList])


    const columns = [
        {
            title: 'Sr No.',
            dataIndex: 'srno',

        },
        {
            title: 'Course Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: "Actions",
            key: "actions",
            width: 250,
            render: (text, record) => (
                <>
                    <Space >
                        <Tooltip title="Remove Course from bundle">
                            <Button
                                icon={<DeleteOutlined />}
                                style={{ marginRight: 8 }}
                                onClick={() => handleOpenConfirmDeletePopup(record)}
                            />
                        </Tooltip>
                        <Tooltip title="View Course content">
                            <Button
                                icon={<ExportOutlined />}
                                onClick={() =>
                                    handleViewUserClick(record?.id, record?.name)
                                }
                            />
                        </Tooltip>
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
                        <Title level={2} style={{ margin: 0 }}>{bundleName}   Details</Title>
                        <Tooltip title="Edit bundle name">
                            <Button style={{ marginLeft: 30 }}
                                icon={<EditOutlined />}
                                onClick={handleEditBundle}
                            >
                            </Button>
                        </Tooltip>

                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }} >

                        <Tooltip title="Add new Course to bundle">
                            <Button style={{ marginLeft: 30 }}
                                icon={<BookOutlined />}
                                onClick={handleAddNew}
                            >
                                Add new Course
                            </Button>
                        </Tooltip>

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
            <AddNewCourseModal isModalOpen={isModalOpen} handleCloseModal={handleCloseModal} setShowToast={setShowToast}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                setLoading={setLoading}
                bundleId={id}
                getCourses={getCourses}
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
                onConfirm={handleDeleteCourse}
            />
            <EditBundleNameModal
                isModalOpen={EditPopOpen}
                handleCloseModal={handleCloseEdit}
                setToastMessage={setToastMessage}
                setToastType={setToastType}
                setShowToast={setShowToast}
                setLoading={setLoading}
                bundleName={bundleName}
                bundleId={id}
                setBundleName={setBundleName}

            />
        </div>
    );
};




export default AdminHOC(GroupHistory);