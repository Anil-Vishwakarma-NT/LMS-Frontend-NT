import { Modal, Form, Button, Input } from "antd";
import { useEffect } from "react";
import { updateCourse } from "../../../service/BookService";
import { updateGroup } from "../../../service/GroupService";
const EditGroupNameModal = ({ isModalOpen,
    handleCloseModal,
    setToastMessage,
    setToastType,
    setShowToast,
    setLoading,
    groupName,
    groupId,
    setGroupName }) => {



    const [form] = Form.useForm();


    useEffect(() => {
        console.log("Group Details ", groupName);
        form.setFieldsValue({
            groupName: groupName,
            groupId: groupId,
        });
    }, [isModalOpen])
    const handleEdit = async () => {
        try {
            const values = await form.validateFields();
            values.groupId = form.getFieldValue("groupId")
            // alert(values.groupId + values.groupName);
            setLoading(true);
            const response = await updateGroup(values);
            setGroupName(values.groupName)
            handleCloseModal();
            setShowToast(true);
            setToastMessage("Group updated");
            setToastType("success");
        }
        catch (error) {
            setToastMessage(error?.message || "Error occurred while adding group");
            setToastType("error");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    }



    return (
        <Modal
            title={'Edit group name'}
            onCancel={handleCloseModal}
            visible={isModalOpen}
            footer={
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleEdit}
                >
                    Edit Name
                </Button>
            }
        >
            <Form form={form} layout="vertical" name="group_form">
                <Form.Item
                    label="Group Name"
                    name="groupName"
                    rules={[{ required: true, message: "group name is required!" }]}
                >
                    <Input autoComplete="off" />
                </Form.Item>


            </Form>
        </Modal>
    );



};

export default EditGroupNameModal;