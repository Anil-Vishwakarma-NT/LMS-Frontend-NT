import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { login } from "./redux/authentication/authActions";
import Navbar from "./components/shared/navbar/Navbar";
const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    const token = localStorage.getItem("authtoken");
    if (token && !auth.accessToken) {
      try {
        const decoded = jwtDecode(token);
        const { email, roles, exp } = decoded;
        const currentTime = Math.floor(Date.now() / 1000);
        if (exp < currentTime) {
          localStorage.clear();
          navigate("/login");
        } else {
          dispatch(login({ email, roles, accessToken: token }));
        }
      } catch {
        localStorage.clear();
        navigate("/login");
      }
    }
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export default App;