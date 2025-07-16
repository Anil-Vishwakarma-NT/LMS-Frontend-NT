import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, useNavigation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { login } from "./redux/authentication/authActions";
import { getUserByToken } from "./service/UserService";

import Navbar from "./components/shared/navbar/Navbar";
import Loader from "./components/shared/loader/Loader";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation(); // For data router navigation state

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("authtoken");
    if (token) {
      getUser(token);
    } else {
      navigate("/");
    }
  }, []);

  const getUser = async (token) => {
    try {
      const decoded = jwtDecode(token);
      const { email, roles, exp } = decoded;

      const currentTime = Math.floor(Date.now() / 1000);
      if (exp < currentTime) {
        console.warn("Token expired!");
        localStorage.removeItem("authtoken");
        navigate("/");
        return;
      }

      dispatch(login({ email, roles, accessToken: token }));
      window.localStorage.setItem("authtoken", token);
    } catch (error) {
      console.error("Token parsing error:", error);
      navigate("/");
    } finally {
      setInitialLoading(false);
    }
  };

  if (initialLoading) return <Loader />;

  return (
    <>
      {(navigation.state === "loading") && <Loader />}
      <Navbar />
      <Outlet />
    </>
  );
};

export default App;
