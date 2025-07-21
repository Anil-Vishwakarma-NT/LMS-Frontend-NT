import { addGroup, updateGroup } from "../../../service/GroupService";
import AdminHOC from "../../shared/HOC/AdminHOC";
import { Modal, Form, Input, Select, Button, Checkbox, Row, Col, Spin, Typography, Space } from "antd";
import { fetchAllActiveUsers } from "../../../service/UserService";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react';


const { Option } = Select;
const { Text } = Typography;

const GroupModal = (
    {
        isModalOpen,
        getGroups,
        handleCloseModal,
        setToastMessage,
        setToastType,
        setShowToast,
        setLoading,
        loading
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


                <Form.Item name="employees"
                    label={
                        <Space>
                            <UserOutlined />
                            <Text strong>
                                Select User(s) to add
                            </Text>
                        </Space>
                    }>
                    <Select placeholder={`Select employees`}
                        showSearch
                        mode="multiple"
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        maxTagCount="responsive"
                        notFoundContent={
                            loading ? <Spin size="small" /> :
                                `No users available`
                        }
                    >
                        {filteredUsers?.map(user => (
                            <Option
                                key={user.value}
                                value={user.value}
                                label={user.label}
                            >
                                <div>
                                    <Text strong>{user.label}</Text>
                                    <br />
                                </div>
                            </Option>
                        ))}
                        {filteredUsers?.length === 0 && (
                            <div style={{ color: '#999', textAlign: 'center' }}>No matches found</div>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default GroupModal;
