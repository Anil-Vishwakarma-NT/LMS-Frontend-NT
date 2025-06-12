import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { createUser, updateUser } from "../../../service/UserService";
import {
  validateEmail,
  validateMobile,
  validateNotEmpty,
  validatePassword,
} from "../../../utility/validation";

const { Option } = Select;

const UsersModal = ({
  title,
  isModalOpen,
  getUserLists,
  handleCloseModal,
  handleAddUser,
  selectedUser,
  setToastMessage,
  setToastType,
  setShowToast,
  setLoading,
}) => {
  const [form] = Form.useForm();
  const roleOptions = [
    { id: 2, label: "Manager" },
    { id: 3, label: "Employee" },
  ];

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        userName: selectedUser.employeeId || "",
        email: selectedUser.email || "",
        roleId: selectedUser.role || "",
        password: "", // Hidden during editing
      });
    } else {
      form.resetFields();
    }
  }, [selectedUser, isModalOpen, form]);

  const validateUser = (values) => {
    const errors = {};
    let isValid = true;

    if (!validateNotEmpty(values.firstName)) {
      errors.firstName = "First name is required.";
      isValid = false;
    }
    if (!validateNotEmpty(values.lastName)) {
      errors.lastName = "Last name is required.";
      isValid = false;
    }
    if (!validateNotEmpty(values.email)) {
      errors.email = "Email is required!";
      isValid = false;
    } else if (!validateEmail(values.email)) {
      errors.email = "Enter a valid email!";
      isValid = false;
    }
    // if (!selectedUser && !validatePassword(values.password)) {
    //   errors.password = "Password must meet criteria.";
    //   isValid = false;
    // }

    return { isValid, errors };
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const { isValid, errors } = validateUser(values);
      if (!isValid) {
        form.setFields(errors);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("authtoken");
      const data = await createUser(values, token);
      setToastMessage(data?.message || "User added successfully!");
      setToastType("success");
      setShowToast(true);
      getUserLists()
      handleCloseModal();
    } catch (error) {
      setToastMessage(error?.message || "User already exists!");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      const { isValid, errors } = validateUser(values);
      if (!isValid) {
        form.setFields(errors);
        return;
      }

      setLoading(true);
      const data = await updateUser(values, selectedUser?.id);
      setToastMessage(data?.message || "User updated successfully!");
      setToastType("success");
      setShowToast(true);
      getUserLists();
      handleCloseModal();
    } catch (error) {
      setToastMessage(error?.message || "Update failed!");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={selectedUser ? `Edit User` : `Add New User`}
      visible={isModalOpen}
      onCancel={handleCloseModal}
      footer={[
        <Button key="cancel" onClick={handleCloseModal}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={selectedUser ? handleEdit : handleAdd}
        >
          {selectedUser ? "Save" : "Add"}
        </Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="user_form">
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "First name is required!" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Last name is required!" }]}
        >
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item label="Employee Number" name="userName">
          <Input autoComplete="off" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required!" },
            { type: "email", message: "Invalid email!" },
          ]}
        >
          <Input autoComplete="off" disabled={selectedUser} />
        </Form.Item>

        {!selectedUser && (
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long.",
              },
            ]}
          >
            <Input.Password autoComplete="off" />
          </Form.Item>
        )}

        <Form.Item
          label="Role"
          name="roleId"
          rules={[{ required: true, message: "Role is required!" }]}
        >
          <Select placeholder="Select a Role" disabled={selectedUser}>
            {roleOptions.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UsersModal;
