import React, { useState } from 'react'
import Sidebar from '../sidebar/Sidebar';
import sideDash from "../../../assets/dashboard.svg";
import sideBook from "../../../assets/course.svg";
import sideIssuance from "../../../assets/group.svg";
import { ArrowLeftOutlined } from "@ant-design/icons";
import './AdminHOC.css';


import Loader from '../loader/Loader';


const UserHOC = (Component) => function HOC() {

  const [loading, setLoading] = useState(false)

  const sidebarItems = [
    { path: "/user", label: "Dashboard", img: sideDash },
    { path: "/my-courses", label: "Courses", img: sideBook },
    { path: "/my-groups", label: "Groups", img: sideIssuance }
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