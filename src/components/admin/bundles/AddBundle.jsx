
import { getCourses, createBundle } from "../../../service/BundleService";
import { Modal, Form, Input, Select, Button, Checkbox, Row, Col, Spin, Typography, Space } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { useEffect, useState } from 'react';

const { Option } = Select;
const { Text } = Typography;

const AddBundle = ({
    isModalOpen,
    getBundles,
    handleCloseModal,
    setToastMessage,
    setToastType,
    setShowToast,
    setLoading,
    loading
}) => {

    const [form] = Form.useForm();
    const [courseList, setCourseList] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const filteredCourses = courseList?.filter(user =>
        user.label.toLowerCase().includes(searchValue.toLowerCase())
        // user.email.toLowerCase().includes(searchValue.toLowerCase())
    );

    async function getCoursesList() {
        try {
            setLoading(true);
            const courses = await getCourses();
            const courselist = courses.data?.map((course, index) => ({
                value: course.courseId,
                label: course.title,
                courselevel: course.courseLevel
            }))

            setCourseList(courselist);
            setToastMessage(courses?.message);
            setToastType("success");
            setShowToast(true);

        } catch (error) {
            setShowToast(true);
            setToastMessage("Error getting course list to add in bundle.")
            setToastType("error")
            throw new Error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }


    }


    useEffect(() => {
        form.setFieldsValue({
            bundleName: "",
            courses: [],
        })
        getCoursesList();
    }, [isModalOpen])

    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            if (!values.bundleName) {
                form.setFields("Bundle name required");
                return;
            }
            setLoading(true);
            const data = await createBundle(values);
            console.log(values);
            setToastMessage(data?.message);
            setToastType("success");
            setShowToast(true);
            getBundles();
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
            title={`Create new Bundle`}
            visible={isModalOpen}
            onCancel={handleCloseModal}
            footer={
                <span>

                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleAdd}
                    >
                        Create
                    </Button>


                </span>

            }
            bodyStyle={{ height: 500 }}

        >
            <Form form={form} layout="vertical" name="group_form">
                <Form.Item
                    label="bundle Name"
                    name="bundleName"
                    rules={[{ required: true, message: "group name is required!" }]}
                >
                    <Input autoComplete="off" />
                </Form.Item>


                <Form.Item name="courses"
                    label={
                        <Space>
                            <BookOutlined />
                            <Text strong>
                                Select Course(s) to add
                            </Text>
                        </Space>
                    }>
                    <Select placeholder={`Select Courses`}
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
                        {filteredCourses?.map(user => (
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
                        {filteredCourses?.length === 0 && (
                            <div style={{ color: '#999', textAlign: 'center' }}>No matches found</div>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );



};

export default AddBundle;