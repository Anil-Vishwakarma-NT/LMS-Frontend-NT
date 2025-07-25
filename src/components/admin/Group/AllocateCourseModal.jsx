import { addUser, updateGroup, getUserCoursesInGroup, getUserBundlesInGroup } from "../../../service/GroupService";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { Modal, Form, Input, Select, Button, Row, Checkbox, Col, DatePicker, Typography, Space, Spin } from "antd";
import { fetchAllActiveUsers } from "../../../service/UserService";
import { BookOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const { Option } = Select;
const { Text } = Typography;
const AllocateCourseModal = (
    {
        isModalOpen,
        groupId,
        userId,
        getUsers,
        getCourses,
        getBundles,
        handleCloseModal,
        setToastMessage,
        setToastType,
        setShowToast,
        setLoading,
        loading
    }
) => {
    const [form] = Form.useForm();
    const [searchCourse, setSearchCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [courseMsg, setCourseMsg] = useState("");
    const [bundles, setBundles] = useState([])
    const [bundleMsg, setBundleMsg] = useState("");

    const filteredCourses = courses?.filter(user =>
        user.title.toLowerCase().includes(searchCourse.toLowerCase())
    );


    const filteredBundles = bundles?.filter(user =>
        user.title.toLowerCase().includes(searchCourse.toLowerCase())
    );


    async function getCourseList() {

        const payload = {
            groupId: Number(groupId),
            userId: Number(userId),
        }
        console.log("Payload", payload);
        const activeUsers = await getUserCoursesInGroup(payload);
        const users = activeUsers?.data?.map((user, index) => ({
            courseId: user.courseId,
            title: user.title,
            level: user.courseLevel,
        }));
        setCourses(users);
        setCourseMsg(activeUsers.message);
        console.log("COURSES", users);
        console.log("MESSAGE", activeUsers.message);
    }


    async function getBundleList() {

        const payload = {
            groupId: Number(groupId),
            userId: Number(userId),
        }
        console.log("Payload", payload);
        const activeUsers = await getUserBundlesInGroup(payload);
        const users = activeUsers?.data?.map((user, index) => ({
            bundleId: user.bundleId,
            title: user.bundleName,
        }));
        setBundles(users);
        setBundleMsg(activeUsers.message);
        console.log("BUNDLES", users);
        console.log("MESSAGE", activeUsers.message);
    }


    useEffect(() => {
        form.setFieldsValue({
            groupId: groupId,
            employees: [userId],
            courses: [],
            bundles: []
        });

        getCourseList();
        getBundleList();

    }, [isModalOpen]);

    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                groupId: Number(values.groupId),
                employees: [userId], // ✅ Backend expects this
                courses: values.courses,
                deadline: values.deadline,
                bundles: values.bundles,
                assignedAt: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
            };

            setLoading(true);
            console.log("Sending Payload", payload);

            const data = await addUser(payload);
            getUsers();
            getCourses();
            getBundles();
            setToastMessage(data?.message);
            setToastType("success");
            setShowToast(true);
            handleCloseModal();

        } catch (error) {
            setToastMessage(error?.message || "Error occurred while adding group");
            setToastType("error");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCoursesChange = (value) => {
        if (value.includes("all")) {
            const allCourseIds = filteredCourses.map(course => course.courseId);

            // If all are already selected, deselect all:
            if (selectedCourses?.length === allCourseIds.length) {
                form.setFieldsValue({ courses: [] });
            } else {
                form.setFieldsValue({ courses: allCourseIds });
            }
        } else {
            form.setFieldsValue({ courses: value });
        }
    };


    const selectedCourses = Form.useWatch("courses", form);
    const selectedBundles = Form.useWatch("bundles", form);
    return (
        ((courses?.length > 0 || bundles?.length > 0) ?
            <Modal
                title={`Allocate course to user`}
                visible={isModalOpen}
                onCancel={handleCloseModal}
                footer={
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAdd}
                    >
                        Add user
                    </Button>
                }
                bodyStyle={{ height: 500 }}

            >
                <Form form={form} layout="vertical" name="group_form">
                    <Form.Item name="groupId" noStyle>
                        <Input type="hidden" />
                    </Form.Item>

                    <Form.Item label={
                        <Space>
                            <BookOutlined />
                            <Text strong>
                                Select Course(s) to add
                            </Text>
                        </Space>
                    } name="courses">


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
                            {filteredCourses?.map(course => (
                                <Option
                                    key={course.courseId}
                                    value={course.courseId}
                                    label={course.title}
                                >
                                    <div>
                                        <Text strong>{course.title}</Text>
                                        <br />
                                    </div>
                                </Option>
                            ))}
                            {filteredCourses?.length === 0 && (
                                <div style={{ color: '#999', textAlign: 'center' }}>No matches found</div>
                            )}


                        </Select>
                    </Form.Item>
                    <Form.Item label={
                        <Space>
                            <BookOutlined />
                            <Text strong>
                                Select Bundle(s) to add
                            </Text>
                        </Space>
                    } name="bundles">


                        <Select placeholder={`Select bundle`}
                            showSearch
                            mode="multiple"
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            maxTagCount="responsive"
                            notFoundContent={
                                loading ? <Spin size="small" /> :
                                    `No bundles available`
                            }
                        >
                            {filteredBundles?.map(course => (
                                <Option
                                    key={course.bundled}
                                    value={course.bundleId}
                                    label={course.title}
                                >
                                    <div>
                                        <Text strong>{course.title}</Text>
                                        <br />
                                    </div>
                                </Option>
                            ))}
                            {filteredBundles?.length === 0 && (
                                <div style={{ color: '#999', textAlign: 'center' }}>No matches found</div>
                            )}


                        </Select>
                    </Form.Item>

                    {(selectedCourses?.length > 0 || selectedBundles?.length > 0) && <Form.Item
                        name="deadline"
                        label="Deadline"
                        rules={[{ required: true, message: 'Please select a deadline!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>}
                </Form>
            </Modal> : <Modal
                title={`Allocate course to user`}
                visible={isModalOpen}
                onCancel={handleCloseModal}
                footer={
                    <Button onClick={handleCloseModal}>OK</Button>
                }>
                <Text>{courseMsg}</Text>
                <Text>{bundleMsg}</Text>
            </Modal>)
    );
};
export default AllocateCourseModal;
