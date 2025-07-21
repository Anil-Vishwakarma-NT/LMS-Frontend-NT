import { addUser, updateGroup, getUserCoursesInGroup } from "../../../service/GroupService";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { Modal, Form, Input, Select, Button, Row, Checkbox, Col, DatePicker, Typography, Space, Spin } from "antd";
import { fetchAllActiveUsers } from "../../../service/UserService";
import { BookOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react';


const { Option } = Select;
const { Text } = Typography;
const AllocateCourseModal = (
    {
        isModalOpen,
        groupId,
        userId,
        getUsers,
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
    const [searchCourse, setSearchCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [courseMsg, setCourseMsg] = useState("");

    const filteredCourses = courses?.filter(user =>
        user.title.toLowerCase().includes(searchCourse.toLowerCase())
    );


    async function getCourseList() {

        const payload = {
            groupId: Number(groupId),
            userId: userId,
        }
        console.log("Payload", payload);
        const activeUsers = await getUserCoursesInGroup(payload);
        const users = activeUsers.data?.map((user, index) => ({
            courseId: user.courseId,
            title: user.title,
            level: user.courseLevel,
        }));
        setCourses(users);
        setCourseMsg(activeUsers.message);
        console.log("COURSES", users);
        console.log("MESSAGE", activeUsers.message);
    }


    useEffect(() => {
        form.setFieldsValue({
            groupId: groupId,
            employees: [userId],
            courses: [],
        });

        getCourseList();

    }, [isModalOpen]);

    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                groupId: Number(values.groupId),
                employees: [userId], // ✅ Backend expects this
                courses: values.courses,
                deadline: values.deadline,
                assignedAt: values.assignedAt,
            };

            setLoading(true);
            console.log("Sending Payload", payload);

            const data = await addUser(payload);
            getUsers();
            getCourses();
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

    return (
        (courses?.length > 0 ?
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

                            {/* <Option label="Select All" onClick={handleCoursesChange}>
                                <div>
                                    <Text strong>Select All</Text>
                                </div>
                            </Option> */}

                            {filteredCourses?.map(course => (
                                <Option
                                    key={course.id}
                                    value={course.id}
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

                    {selectedCourses?.length > 0 && <Form.Item
                        name="deadline"
                        label="Deadline"
                        rules={[{ required: true, message: 'Please select a deadline!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>}
                    {selectedCourses?.length > 0 &&
                        <Form.Item
                            name="assignedAt"
                            label="assignedAt"
                            rules={[{ required: true, message: 'Please select a assignment date!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    }
                </Form>
            </Modal> : <Modal
                title={`Allocate course to user`}
                visible={isModalOpen}
                onCancel={handleCloseModal}
                footer={
                    <Button onClick={handleCloseModal}>OK</Button>
                }>
                <Text>{courseMsg}</Text>
            </Modal>)
    );
};
export default AllocateCourseModal;
