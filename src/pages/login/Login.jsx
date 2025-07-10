import React, { useState } from "react";
import './Login.css';
import image from "../../assets/login-image-trial.jpg";
import Button from "../../components/shared/button/Button";
import { userLogin } from "../../service/UserService";
import { login } from "../../redux/authentication/authActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import {
  validateEmailOrMobile,
} from "../../utility/validation";
import Toast from "../../components/shared/toast/Toast";
import JSEncrypt from "jsencrypt";
import Password from "antd/es/input/Password";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");

  const publicKey = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHZxpdXzzP3VeM50CLkYx5Ih4jZN
W9/SyLNzJgBujCmOe49QnJNKD79eM/VUFHAGPLO5f1Krh9J1PoOZAEeimzdOnkFf
zn6y8H7z4vwjIHAkzvW/uJBcV7PJRgPIr7awpn7J4TsU0zxCBb3CNgkwLrM5KmZG
u/bvWV47VOzzM+ObAgMBAAE=
-----END PUBLIC KEY-----`;

  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  const validateForm = () => {
    let formErrors = {};
    if (!password) formErrors.password = "Password is required!"
    if (!userName) {
      formErrors.userName = "Username is required!";
    } else if (!validateEmailOrMobile(userName)) {
      formErrors.userName = "Enter a valid email or 10-digit mobile number";
    }
    return formErrors;
  };

  const handleLoginClick = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey);
      const encodedPassword = encryptor.encrypt(password);

      const response = await userLogin({ email: userName, password });

      const {
        roles,
        email,
        userId,
        fullName
      } = parseJwt(response.accessToken);

      const normalizedRoles = Array.isArray(roles) ? roles : [roles];

    dispatch(login({
        roles: normalizedRoles,
        email,
        accessToken: response.accessToken
      }));

   
      localStorage.setItem('authtoken', response.accessToken);
    
      if (normalizedRoles.includes("ADMIN")) {
        console.log("entered admin");
        navigate("/admin");
      } else if (normalizedRoles.includes("EMPLOYEE")) {
        navigate("/user", { state: { userId, name: fullName } });
      } else {
        navigate("/");
      }

    } catch (error) {
      setToastMessage("Invalid credentials!");
      setToastType("error");
      setShowToast(true);
    }
  };

  return (
    <div className="login-page" style={{ backgroundColor: '#ccdcfa' }}>
      <div className="login-container">
        <div className="login-img">
          <img src={image} alt="login-side-img" />
        </div>

        <div className="form-container">
          <p className="login-header">Login</p>
          <div className="login-info">
            <p>Welcome back!</p>
            <p>Please log in to access your learning management system.</p>
          </div>

          <label className="label-text" htmlFor="email">Username:</label>
          <input
            className="login-input"
            type="text"
            id="mobile"
            value={userName}
            onChange={e => {
              setUserName(e.target.value);
              setErrors({ ...errors, userName: '' });
            }}
            required
          />
          {errors.userName && <div className="error-text">{errors.userName}</div>}

          <label className="label-text" htmlFor="password">Password:</label>
          <input
            className="login-input"
            type="password"
            id="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: '' });
            }}
            required
          />
          {errors.password && <div className="error-text">{errors.password}</div>}
          {/* <div className='checkbox'>
            <input
              type="checkbox"
              checked={checkboxChecked}
              onChange={() => {
                setCheckboxChecked(!checkboxChecked);
                setErrors({ ...errors, checkbox: '' });
              }}
            />
            <div className='checkbox-text'>Agree to all Terms and Conditions?</div>
          </div> */}
          {/* {errors.checkbox && <div className="error-text">{errors.checkbox}</div>} */}

          <Button text="Login" type="submit" onClick={handleLoginClick} />
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default Login;