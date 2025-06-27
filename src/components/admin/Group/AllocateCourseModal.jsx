import { addUser, updateGroup, getUserCoursesInGroup } from "../../../service/GroupService";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { Modal, Form, Input, Select, Button, Checkbox, Col, DatePicker } from "antd";
import { fetchAllActiveUsers } from "../../../service/UserService";

import { useEffect, useState } from 'react';




const userOptions = [
    { value: 1000000000001, label: "Alice Johnson" },
    { value: 1000000000002, label: "Bob Smith" },
    { value: 1000000000003, label: "Charlie Davis" },
    { value: 1000000000004, label: "Dana Lee" },
    { value: 1000000000005, label: "Evan Brown" },
    { value: 1000000000006, label: "Fiona Garcia" },
    { value: 1000000000007, label: "George Martin" },
    { value: 1000000000008, label: "Hannah Wilson" },
    { value: 1000000000009, label: "Ian Clark" },
    { value: 1000000000010, label: "Julia Adams" }
];


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
    }
) => {
    const [form] = Form.useForm();
    const [searchCourse, setSearchCourse] = useState('');
    const [courses, setCourses] = useState([]);


    const filteredCourses = courses?.filter(user =>
        user.title.toLowerCase().includes(searchCourse.toLowerCase())
        // user.email.toLowerCase().includes(searchValue.toLowerCase())
    );


    async function getCourseList() {

        const payload = {
            groupId: Number(groupId),
            userId: userId,
        }
        console.log("Payload", payload);
        const activeUsers = await getUserCoursesInGroup(payload);
        const users = activeUsers.map((user, index) => ({
            courseId: user.courseId,
            title: user.title,
            level: user.courseLevel,
        }));
        setCourses(users);
        console.log(users);
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

            // Ensure proper structure
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

    return (
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

                <Form.Item label="Courses">
                    <Input.Search
                        placeholder="Search by course name..."
                        enterButton
                        allowClear
                        style={{ width: '100%', marginBottom: 16 }}
                        value={searchCourse}
                        onChange={(e) => setSearchCourse(e.target.value)}
                    />
                    <Form.Item
                        name="courses"
                        noStyle
                        rules={[{ required: true, message: 'Please select at least one Course' }]}
                    >
                        <Checkbox.Group style={{ width: '100%' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    maxHeight: '350px',
                                    overflowY: 'auto',
                                    paddingRight: '55px',
                                    gap: '10px',
                                }}
                            >
                                {filteredCourses?.map((user) => (
                                    <Checkbox
                                        key={user.courseId}
                                        value={user.courseId}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '6px 8px',
                                            borderRadius: '4px',
                                            transition: 'background 0.5s',
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 500 }}>{user.title}</span>
                                        </div>
                                    </Checkbox>
                                ))}
                                {filteredCourses?.length === 0 && (
                                    <div style={{ color: '#999', textAlign: 'center' }}>No matches found</div>
                                )}
                            </div>
                        </Checkbox.Group>
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    name="deadline"
                    label="Deadline"
                    rules={[{ required: true, message: 'Please select a deadline!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="assignedAt"
                    label="assignedAt"
                    rules={[{ required: true, message: 'Please select a assignment date!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

            </Form>
        </Modal>
    );
};
export default AllocateCourseModal;
