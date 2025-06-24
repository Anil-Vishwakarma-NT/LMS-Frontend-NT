import { addUser, updateGroup } from "../../../service/GroupService";
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
        handleCloseModal,
        setToastMessage,
        setToastType,
        setShowToast,
        setLoading,
    }
) => {
    const [form] = Form.useForm();
    const [searchCourse, setSearchCourse] = useState('');

    const filteredCourses = courses?.filter(user =>
        user.name.toLowerCase().includes(searchCourse.toLowerCase())
        // user.email.toLowerCase().includes(searchValue.toLowerCase())
    );


    async function getCourseList() {
        const activeUsers = await fetchAllActiveUsers();
        const users = activeUsers.data.map((user, index) => ({
            value: user.userId,
            label: `${user.firstName} ${user.lastName}`,
        }));
        setUserList(users);
        console.log(users);
    }

    // async function getExistingUsersList() {
    //     const response = await getUsersInGroup(id);
    //     if (!Array.isArray(response)) {
    //         console.error("Expected an array but got:", response);
    //         setUserList([]);
    //         return;
    //     }
    //     const users = response.map((user, index) => ({
    //         id: user.userId,
    //         srno: index + 1,
    //         name: `${user.firstName} ${user.lastName}`,
    //     }));

    //     setExistingUsers(users);
    // }

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

    // const handleEdit = async () => {
    //     try {

    //         const values = await form.validateFields();
    //         if (!values.groupName) {
    //             form.setFields("Group name required");
    //             return;
    //         }

    //         setLoading(true);
    //         const data = updateGroup(values);
    //         setToastMessage(data?.message);
    //         setToastType("success");
    //         setShowToast(true);
    //         getGroups();
    //         handleCloseModal();
    //     } catch (error) {
    //         setToastMessage(error?.message || "Error occurred while adding group");
    //         setToastType("error");
    //         setShowToast(true);
    //     } finally {
    //         setLoading(false);
    //     }
    // }


    return (
        <Modal
            title={`Add new User`}
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


                <Form.Item label="Employees">
                    <Input.Search
                        placeholder="Search by name or email..."
                        enterButton
                        allowClear
                        style={{ width: '100%', marginBottom: 16 }}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <Form.Item
                        name="employees"
                        noStyle
                        rules={[{ required: true, message: 'Please select at least one employee' }]}
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
                                {filteredUsers?.map((user) => (
                                    <Checkbox
                                        key={user.value}
                                        value={user.value}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '6px 8px',
                                            borderRadius: '4px',
                                            transition: 'background 0.5s',
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 500 }}>{user.label}</span>
                                        </div>
                                    </Checkbox>
                                ))}
                                {filteredUsers?.length === 0 && (
                                    <div style={{ color: '#999', textAlign: 'center' }}>No matches found</div>
                                )}
                            </div>
                        </Checkbox.Group>
                    </Form.Item>
                </Form.Item>


                <Form.Item label="Courses">
                    <Input.Search
                        placeholder="Search by course name..."
                        enterButton
                        allowClear
                        style={{ width: '100%', marginBottom: 16 }}
                        value={searchValue}
                        onChange={(e) => setSearchCourse(e.target.value)}
                    />
                    <Form.Item
                        name="courses"
                        noStyle
                        rules={[{ required: true, message: 'Please select at least one employee' }]}
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
                                        key={user.id}
                                        value={user.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '6px 8px',
                                            borderRadius: '4px',
                                            transition: 'background 0.5s',
                                        }}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 500 }}>{user.name}</span>
                                        </div>
                                    </Checkbox>
                                ))}
                                {filteredUsers?.length === 0 && (
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
export default AddNewUserModal;
