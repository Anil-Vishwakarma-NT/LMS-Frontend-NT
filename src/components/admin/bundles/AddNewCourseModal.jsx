import { addUser, updateGroup } from "../../../service/GroupService";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { Modal, Form, Input, Select, Button, Checkbox, Col, Spin, Row, DatePicker, Space, Typography } from "antd";
import { fetchAllActiveUsers } from "../../../service/UserService";
import { UserOutlined, TeamOutlined, BookOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { addCourseToBundle, CoursesToAdd } from "../../../service/BundleService";



const { Option } = Select;
const { Text } = Typography;

const AddNewCourseModal = (
    {
        isModalOpen,
        bundleId,
        getCourses,
        handleCloseModal,
        setToastMessage,
        setToastType,
        setShowToast,
        setLoading,
        loading
    }
) => {
    const [form] = Form.useForm();
    const [courseList, setCourseList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchCourse, setSearchCourse] = useState('');

    const filteredCourses = courseList?.filter(user =>
        user.label.toLowerCase().includes(searchCourse.toLowerCase())
    );

    async function getCourseList() {
        const activeUsers = await CoursesToAdd(bundleId);
        const users = activeUsers?.map((user, index) => ({
            value: user.courseId,
            label: user.title,
        }));
        setCourseList(users);
        console.log(users);
    }


    const handleSelectAllCourses = () => {
        const allFilteredCoursesIds = filteredCourses.map(course => course.id);
        form.setFieldsValue({ courses: allFilteredCoursesIds });
    };
    const handleResetEmployees = () => {
        form.setFieldsValue({ employees: [] });
    }
    const handleResetCourses = () => {
        form.setFieldsValue({ courses: [] });
    }


    useEffect(() => {
        form.setFieldsValue({
            bundleId: bundleId,
            courses: [],
        });
        getCourseList();

    }, [isModalOpen]);



    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            values.bundleId = Number(values.bundleId);

            setLoading(true);
            console.log("Values", values);
            console.log("Group Id", form.getFieldValue("groupId"))// this will set userList // Is this an array or valid object?

            const data = await addCourseToBundle(values);
            setToastMessage(data?.message);
            setToastType("success");
            setShowToast(true);
            getCourses();
            handleCloseModal();

        } catch (error) {
            setToastMessage(error?.message || "Error occurred while adding group");
            setToastType("error");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };


    const selectedCourses = Form.useWatch("courses", form);

    return ((courseList?.length > 0 ?
        <Modal
            title={`Add New Course`}
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={
                <span>
                    <Button key="submit" type="primary" onClick={handleAdd}>
                        Add Course(s)
                    </Button>
                </span>
            }
            bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: 12 }}
            style={{ top: 20 }}
        >
            <Form form={form} layout="vertical" name="group_form">
                <Form.Item name="bundleId" noStyle>
                    <Input type="hidden" />
                </Form.Item>
                {/* COURSES */}
                <Form.Item name="courses"
                    label={
                        <Space>
                            <BookOutlined />
                            <Text strong>
                                Select Course(s) to add
                            </Text>
                        </Space>
                    }
                    rules={[{ required: true, message: `Please select a course` }]}
                >
                    <Select placeholder={`Select course`}
                        showSearch
                        mode="multiple"
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        maxTagCount="responsive"
                        notFoundContent={
                            loading ? <Spin size="small" /> :
                                `No courses available`
                        }
                    >
                        {filteredCourses.map(course => (
                            <Option
                                key={course.value}
                                value={course.value}
                                label={course.label}
                            >
                                <div>
                                    <Text strong>{course.label}</Text>
                                    <br />
                                </div>
                            </Option>
                        ))}

                    </Select>
                </Form.Item>
            </Form>
        </Modal> : <Modal
            title={`Add New Course`}
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={
                <Button
                    onClick={handleCloseModal}>OK</Button>
            }>
            <span>All courses are already present in the bundle.</span>
        </Modal>)

    );
};
export default AddNewCourseModal;
