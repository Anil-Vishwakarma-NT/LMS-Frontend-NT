import { addUser, updateGroup } from "../../../service/GroupService";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { Modal, Form, Input, Select, Button, Checkbox, Col, Row, DatePicker } from "antd";
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


const AddNewUserModal = (
    {
        isModalOpen,
        getUsers,
        existingUsers,
        courses,
        groupId,
        handleCloseModal,
        setToastMessage,
        setToastType,
        setShowToast,
        setLoading,
    }
) => {
    const [form] = Form.useForm();
    const [userList, setUserList] = useState([]);
    // const [existingUsers, setExistingUsers] = useState([]);
    const [notAddedUsers, setNotAddedUSers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchCourse, setSearchCourse] = useState('');

    const filteredUsers = notAddedUsers?.filter(user =>
        user.label.toLowerCase().includes(searchValue.toLowerCase())
        // user.email.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredCourses = courses?.filter(user =>
        user.name.toLowerCase().includes(searchCourse.toLowerCase())
        // user.email.toLowerCase().includes(searchValue.toLowerCase())
    );


    async function getUserList() {
        const activeUsers = await fetchAllActiveUsers();
        const users = activeUsers.data.map((user, index) => ({
            value: user.userId,
            label: `${user.firstName} ${user.lastName}`,
        }));
        setUserList(users);
        console.log(users);
    }

    const handleSelectAllEmployees = () => {
        const allFilteredUserIds = filteredUsers.map(user => user.value);
        form.setFieldsValue({ employees: allFilteredUserIds });
    };
    const handleSelectAllCourses = () => {
        const allFilteredCoursesIds = filteredCourses.map(user => user.value);
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
            groupId: groupId,
            employees: [],
            courses: [],

        });

        getUserList();

    }, [isModalOpen]);

    // ✅ New useEffect for filtering users
    useEffect(() => {
        if (userList.length > 0 && existingUsers.length > 0) {
            const usr = userList.filter(
                user => !existingUsers.some(existing => existing.id === user.value)
            );
            setNotAddedUSers(usr);
        } else if (userList.length > 0) {
            // If no existing users, assume all are not added
            setNotAddedUSers(userList);
        }

        console.log("Group Id", form.getFieldValue("groupId"))// this will set userList
    }, [userList, existingUsers]);





    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            values.groupId = Number(values.groupId);
            values.deadline = values.deadline ? values.deadline.format('YYYY-MM-DDThh:mm:ss') : null;
            values.assignedAt = values.assignedAt ? values.assignedAt.format('YYYY-MM-DDThh:mm:ss') : null;

            // if (!values.groupName) {
            //     form.setFields("Group name required");
            //     return;
            // }
            // const formData = new FormData();
            // formData.append("groupId", groupId);
            // formData.append("employees", form.getFieldValue("employees"));
            setLoading(true);
            console.log("Values", values);
            console.log("Group Id", form.getFieldValue("groupId"))// this will set userList // Is this an array or valid object?
            // console.log("form values", formData);
            // for (let [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            // }

            const data = await addUser(values);
            setToastMessage(data?.message);
            setToastType("success");
            setShowToast(true);
            getUsers();
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
            title={`Add New User`}
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={
                <span>
                    <Button key="reset" onClick={handleResetEmployees} style={{ marginRight: 8 }}>
                        Reset Employees
                    </Button>
                    <Button key="reset" onClick={handleResetCourses} style={{ marginRight: 8 }}>
                        Reset Courses
                    </Button>
                    <Button key="submit" type="primary" onClick={handleAdd}>
                        Add Group
                    </Button>
                </span>
            }
            bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: 12 }}
            style={{ top: 20 }}
        >
            <Form form={form} layout="vertical" name="group_form">
                <Form.Item name="groupId" noStyle>
                    <Input type="hidden" />
                </Form.Item>

                {/* EMPLOYEES */}
                <Form.Item label="Employees">
                    <Row gutter={8} style={{ marginBottom: 12 }}>
                        <Col flex="80px">
                            <Button onClick={handleSelectAllEmployees}>Add All</Button>
                        </Col>
                        <Col flex="auto">
                            <Input.Search
                                placeholder="Search by name or email"
                                enterButton
                                allowClear
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Form.Item
                        name="employees"
                        noStyle
                        rules={[{ required: true, message: 'Please select at least one employee' }]}
                    >
                        <Checkbox.Group style={{ width: '100%' }}>
                            <div
                                style={{
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    paddingRight: '8px',
                                }}
                            >
                                {filteredUsers?.map((user) => (
                                    <Checkbox key={user.value} value={user.value}>
                                        {user.label}
                                    </Checkbox>
                                ))}
                                {filteredUsers?.length === 0 && (
                                    <div style={{ color: '#999', textAlign: 'center' }}>No matches found</div>
                                )}
                            </div>
                        </Checkbox.Group>
                    </Form.Item>
                </Form.Item>

                {/* COURSES */}
                <Form.Item label="Courses">
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
                    <Form.Item name="courses" noStyle>
                        <Checkbox.Group style={{ width: '100%' }}>
                            <div
                                style={{
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px',
                                    paddingRight: '8px',
                                }}
                            >
                                {filteredCourses?.map((course) => (
                                    <Checkbox key={course.id} value={course.id}>
                                        {course.name}
                                    </Checkbox>
                                ))}
                                {filteredCourses?.length === 0 && (
                                    <div style={{ color: '#999', textAlign: 'center' }}>No matches found</div>
                                )}
                            </div>
                        </Checkbox.Group>
                    </Form.Item>
                </Form.Item>

                {/* DEADLINE + ASSIGNED AT */}
                <Form.Item
                    name="deadline"
                    label="Deadline"
                    rules={[{ required: true, message: 'Please select a deadline!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    name="assignedAt"
                    label="Assigned At"
                    rules={[{ required: true, message: 'Please select assignment date!' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>

    );
};
export default AddNewUserModal;
