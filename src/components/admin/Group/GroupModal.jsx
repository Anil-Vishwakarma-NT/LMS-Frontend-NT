import { addGroup, updateGroup } from "../../../service/GroupService";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { Modal, Form, Input, Select, Button, Checkbox, Row, Col } from "antd";
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


const GroupModal = (
    {
        isModalOpen,
        getGroups,
        handleCloseModal,
        setToastMessage,
        setToastType,
        setShowToast,
        setLoading,
    }
) => {
    const [form] = Form.useForm();
    const [userList, setUserList] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const filteredUsers = userList?.filter(user =>
        user.label.toLowerCase().includes(searchValue.toLowerCase())
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

    const handleSelectAll = () => {
        const allFilteredUserIds = filteredUsers.map(user => user.value);
        form.setFieldsValue({ employees: allFilteredUserIds });
    };
    const handleReset = () => {
        form.setFieldsValue({ employees: [] });
    }

    useEffect(() => {
        form.setFieldsValue({
            groupName: "",
            employees: [],
        });

        getUserList()
    }, [isModalOpen])

    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            if (!values.groupName) {
                form.setFields("Group name required");
                return;
            }
            setLoading(true);
            const data = await addGroup(values);
            console.log(values);
            setToastMessage(data?.message);
            setToastType("success");
            setShowToast(true);
            getGroups();
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
            title={`Add new group`}
            visible={isModalOpen}
            onCancel={handleCloseModal}
            footer={
                <span>
                    <Button
                        key="reset"
                        style={{ marginRight: 8 }}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAdd}
                    >
                        Add Group
                    </Button>


                </span>

            }
            bodyStyle={{ height: 500 }}

        >
            <Form form={form} layout="vertical" name="group_form">
                <Form.Item
                    label="Group Name"
                    name="groupName"
                    rules={[{ required: true, message: "group name is required!" }]}
                >
                    <Input autoComplete="off" />
                </Form.Item>


                <Form.Item label="Employees" >
                    <Row gutter={8} style={{ marginBottom: 16 }}>
                        <Col flex="80px">
                            <Button onClick={handleSelectAll}>Add All</Button>
                        </Col>
                        <Col flex="auto">
                            <Input.Search
                                placeholder="Search by name or email..."
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

            </Form>
        </Modal>
    );
};
export default GroupModal;
