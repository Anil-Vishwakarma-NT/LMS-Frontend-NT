import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "./components/shared/navbar/Navbar";
import Loader from "./components/shared/loader/Loader";
const App = () => {
  const navigation = useNavigation();
  return (
    <>
      {navigation.state === "loading" && <Loader />}
      <Navbar />
      <Outlet />
    </>
  );
};
export default App;