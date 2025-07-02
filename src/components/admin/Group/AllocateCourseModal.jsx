import { addUser, updateGroup, getUserCoursesInGroup } from "../../../service/GroupService";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { Modal, Form, Input, Select, Button, Row, Checkbox, Col, DatePicker } from "antd";
import { fetchAllActiveUsers } from "../../../service/UserService";

import { useEffect, useState } from 'react';

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

    const handleSelectAllCourses = () => {
        const allFilteredCoursesIds = filteredCourses.map(course => course.courseId);
        form.setFieldsValue({ courses: allFilteredCoursesIds });
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

                    <Form.Item label="Courses" >
                        <Row gutter={8} style={{ marginBottom: 12 }}>
                            <Col flex="80px">
                                <Button onClick={handleSelectAllCourses}>Add All</Button>
                            </Col>
                            <Col flex="auto">
                                <Input.Search
                                    placeholder="Search by course name"
                                    enterButton
                                    allowClear
                                    value={searchCourse}
                                    onChange={(e) => setSearchCourse(e.target.value)}
                                />
                            </Col>
                        </Row>
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
                <span>All courses are already allocated to the user</span>
            </Modal>)
    );
};
export default AllocateCourseModal;
