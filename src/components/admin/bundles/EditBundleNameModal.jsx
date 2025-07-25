import { Modal, Form, Button, Input } from "antd";
import { useEffect } from "react";
import { updateCourse } from "../../../service/BookService";
import { updateBundle } from "../../../service/BundleService";
const EditBundleNameModal = ({ isModalOpen,
    handleCloseModal,
    setToastMessage,
    setToastType,
    setShowToast,
    setLoading,
    bundleName,
    bundleId,
    setBundleName }) => {



    const [form] = Form.useForm();


    useEffect(() => {
        console.log("Bundle Details ", bundleName);
        form.setFieldsValue({
            bundleName: bundleName,
            isActive: true
        });
    }, [isModalOpen])
    const handleEdit = async () => {
        try {
            const values = await form.validateFields();
            values.isActive = true;
            console.log("BUNDLE UPDATION VALUES ", values);
            setLoading(true);
            const response = await updateBundle(values, bundleId);
            setBundleName(values.bundleName)
            handleCloseModal();
            setShowToast(true);
            setToastMessage("Bundle updated");
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
            title={'Edit Bundle name'}
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
                    label="Bundle Name"
                    name="bundleName"
                    rules={[{ required: true, message: "bundle name is required!" }]}
                >
                    <Input autoComplete="off" />
                </Form.Item>


            </Form>
        </Modal>
    );



};

export default EditBundleNameModal;