import React, { useState, useEffect } from "react";
import Modal from "../../shared/modal/Modal";
import Button from "../../shared/button/Button";
import { createUser, updateUser } from "../../../service/UserService";
import {
  validateEmail,
  validateMobile,
  validateNotEmpty,
  validatePassword,
} from "../../../utility/validation";
import ConfirmLogoutPopup from "../../shared/confirmLogoutPopup/ConfirmLogoutPopup";

const UsersModal = ({
  title,
  isModalOpen,
  handleCloseModal,
  handleAddUser,//to re render the page when modal is closed
  selectedUser,
  setToastMessage,
  setToastType,
  setShowToast,
  setLoading,

}) => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    roleId: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [userPassword, setUserPassword] = useState("")

  const roleOptions = [
    { id: 2, label: "Manager" },
    { id: 3, label: "Employee" },
  ];

  useEffect(() => {
    if (selectedUser) {
      setUserData({
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        userName: selectedUser.userName || "",
        email: selectedUser.email || "",
        roleId: selectedUser.roleId || "",
        // password: "",
      });
    } else {
      setUserData({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        roleId: "",
        password: "",
      });
    }
    setErrors({});
  }, [selectedUser, isModalOpen]);

  const validateUser = () => {
    const trimmedData = {
      ...userData,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.trim(),
      password: userData.password.trim(),
    };

    const newErrors = {};
    let isValid = true;

    if (!validateNotEmpty(trimmedData.firstName)) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    }

    if (!validateNotEmpty(trimmedData.lastName)) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    }

    if (!validateNotEmpty(trimmedData.email)) {
      newErrors.email = "Email is required!";
      isValid = false;
    } else if (!validateEmail(trimmedData.email)) {
      newErrors.email = "Enter a valid email!";
      isValid = false;
    }

    if (!selectedUser && !validatePassword(trimmedData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleAdd = async () => {
    if (validateUser()) {
      console.log("inside if");
      try {
        setLoading(true);
        const token = localStorage.getItem("authtoken");
        const data = await createUser(userData, token);
        setToastMessage(data?.message || "User added successfully!");
        setToastType("success");
        setShowToast(true);
        handleCloseModal();
      } catch (error) {
        setToastMessage(
          error?.message || "User already exists with same credentials!"
        );
        setToastType("error");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async () => {
    if (validateUser()) {
      try {
        setLoading(true);
        console.log(userData);
        const data = await updateUser(userData, selectedUser?.id);
        setToastMessage(data?.message || "User updated successfully!");
        setToastType("success");
        setShowToast(true);
        handleAddUser();
        handleCloseModal();
      } catch (error) {
        setToastMessage(error?.message || "Update failed!");
        setToastType("error");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={title}>
      <div className="form-group">
        <label htmlFor="firstName" className="label-text">First Name:</label>
        <input
          className="login-input"
          type="text"
          id="firstName"
          value={userData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <div className="error-text">{errors.firstName}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="lastName" className="label-text">Last Name:</label>
        <input
          className="login-input"
          type="text"
          id="lastName"
          value={userData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <div className="error-text">{errors.lastName}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="userName" className="label-text">Employee Number:</label>
        <input
          className="login-input"
          type="text"
          id="userName"
          value={userData.userName}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="label-text">Email:</label>
        <input
          className="login-input"
          type="text"
          id="email"
          value={userData.email}
          onChange={handleChange}
        />
        {errors.email && <div className="error-text">{errors.email}</div>}
      </div>

      {!selectedUser &&
        <div className="form-group">
          <label htmlFor="password" className="label-text">Password:</label>
          <input
            className="login-input"
            type="password"
            id="password"
            value={userData.password}
            onChange={handleChange}

          />
          {errors.password && <div className="error-text">{errors.password}</div>}
        </div>}

      <div className="form-group">
        <label htmlFor="roleId" className="label-text">Role:</label>
        <select
          className="login-input"
          id="roleId"
          value={userData.roleId}
          onChange={handleChange}
        >
          <option value="">--Select a Role--</option>
          {roleOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-button">
        {!selectedUser ? (
          <Button onClick={handleAdd} type="submit" text="Add" />
        ) : (
          <Button onClick={handleEdit} type="submit" text="Save" />
        )}
      </div>
    </Modal>
  );
};

export default UsersModal;
