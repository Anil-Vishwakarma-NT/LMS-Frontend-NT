import React, { useState } from 'react'
import Sidebar from '../sidebar/Sidebar';
import userProfile from "../../../assets/man.png";
import userHistory from "../../../assets/clock.png";
import userIssuance from "../../../assets/occupation.png";
import { ArrowLeftOutlined } from "@ant-design/icons";
import './AdminHOC.css';


import Loader from '../loader/Loader';


const UserHOC = (Component) => function HOC() {

  const [loading, setLoading] = useState(false)

  const sidebarItems = [
    { path: "/user", label: "Dashboard", img: userHistory },
    { path: "/my-courses", label: "Courses", img: userHistory },
    { path: "/my-groups", label: "Groups", img: userHistory }
  ];
  const [visible, setVisible] = useState(true);

  return (
    <>
      {loading && <Loader />}
      <div className="admin-layout">
        <aside className={visible ? "admin-sidebar" : "admin-toggle"}>
          <button onClick={() => setVisible(!visible)} className="sidebar-toggle-btn">
            {!visible ? "☰ " : <ArrowLeftOutlined />}
          </button>
          {visible && <Sidebar items={sidebarItems} visible={visible} />}
        </aside>
        <main className="admin-main">
          <Component loading={loading} setLoading={setLoading} />
        </main>
      </div>
    </>
  );
}

export default UserHOC;