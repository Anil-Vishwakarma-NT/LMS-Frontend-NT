import React, { useEffect, useState } from "react";
import './Login.css';
import image from "../../assets/login-image.jpeg";
import Button from "../../components/shared/button/Button";
import { userLogin } from "../../service/UserService";
import { login } from "../../redux/authentication/authActions";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import {
  validateEmailOrMobile,
} from "../../utility/validation";
import Toast from "../../components/shared/toast/Toast";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector(state => state.auth);

  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("");


  function parseJwt(token) {
    const base64Url = token.split('.')[1]; // Get payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  }


  useEffect(() => {
    if (auth && auth.accessToken) {
      const t = auth.accessToken;
      const decode = parseJwt(t);
      const role = decode.roles;
      console.log(decode)
      if (role === "admin") {
        console.log("congratulations !!!!");
        // const token = localStorage.getItem('authtoken');
        // console.log(token);
        console.log('token stored in localstorage!!');
        navigate('/admin');
      } else {
        navigate('/user');
      }
    }
  }, [auth?.accessToken]);

  const validateForm = () => {
    let formErrors = {};
    if (!password) formErrors.password = "Password is required!"
    if (!checkboxChecked) formErrors.checkbox = "You must agree!";
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
      setErrors(formErrors)
      return;
    }

  
    try {
      const encodedPassword = btoa(password);
      const data = await userLogin({ "email": userName, "password": password });
      console.log("request sent waiting for response");
      const {roles, sub: email} = parseJwt(data.accessToken);      
      console.log({roles, email,"accessToken": data.accessToken});
      // console.log(response.data);
      dispatch(login(data));
      window.localStorage.setItem('authtoken', data.accessToken);
      console.log("accessToken is ", data.accessToken);
    } catch (error) {
      setToastMessage("Invalid credentials!");
      setToastType("error");
      setShowToast(true);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-img">
          <img src={image} alt="login-side-img" />
        </div>

        <div className="form-container">
          <p className="login-header">Login</p>
          <div className="login-info">
            <p>Welcome back!</p>
            <p>Please log in to access your library account.</p>
          </div>
          <label
            style={{ marginBottom: "5px", marginTop: '5px' }}
            className="label-text"
            htmlFor="email"
          >
            Username:
          </label>
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
          <label
            style={{ marginBottom: "5px", marginTop: '5px' }}
            className="label-text"
            htmlFor="password"
          >
            Password:
          </label>
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
          <div className='checkbox'>
            <input
              type="checkbox"
              required={true}
              checked={checkboxChecked}
              onChange={() => {
                setCheckboxChecked(!checkboxChecked);
                setErrors({ ...errors, checkbox: '' });
              }}
            />
            <div className='checkbox-text'>Agree to all Terms and Conditions?</div>
          </div>
          {errors.checkbox && <div className="error-text">{errors.checkbox}</div>}

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
