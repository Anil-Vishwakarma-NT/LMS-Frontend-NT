import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { login } from "./redux/authentication/authActions";
import Navbar from "./components/shared/navbar/Navbar";
import axios from "axios";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const refreshTokenApi = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      const res = await axios.post(`http://localhost:8091/lms/api/client-api/auth/refresh`, {
        refreshToken,
      });

      console.log("🔄 Token refreshed successfully from App.js:", res.data);

      const { accessToken } = res.data;
      localStorage.setItem("authtoken", accessToken);

      const { email, roles } = jwtDecode(accessToken);
      dispatch(login({ email, roles, accessToken }));

    } catch (err) {
      console.error("Refresh token failed:", err);
      localStorage.clear();
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authtoken");

    if (token && !auth.accessToken) {
      try {
        const decoded = jwtDecode(token);
        const { email, roles, exp } = decoded;

        const currentTime = Math.floor(Date.now() / 1000);

        if (exp < currentTime) {
          console.log("Access token expired. Trying refresh token...");
          refreshTokenApi();
        } else {
          dispatch(login({ email, roles, accessToken: token }));
        }

      } catch (err) {
        console.error("Invalid token format. Clearing storage.");
        localStorage.clear();
        navigate("/login");
      }
    }
  }, [auth.accessToken, dispatch, navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default App;
