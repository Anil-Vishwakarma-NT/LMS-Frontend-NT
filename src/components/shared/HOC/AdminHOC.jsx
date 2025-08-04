import React, { useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import './AdminHOC.css'
import sideDash from "../../../assets/dashboard.svg";
import sideUsers from "../../../assets/user.svg";
import sideCategory from "../../../assets/bundle.svg";
import sideBook from "../../../assets/course.svg";
import sideIssuance from "../../../assets/group.svg";
import enrollment from "../../../assets/enrollment.svg"
import Loader from '../loader/Loader';
import { ArrowLeftOutlined } from "@ant-design/icons";



const AdminHOC = (Component) => function HOC() {
  const [loading, setLoading] = useState(false);


  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', img: sideDash },
    { path: '/bundles', label: 'Bundles', img: sideCategory },
    { path: '/books', label: 'Courses', img: sideBook },
    { path: '/group', label: 'Groups', img: sideIssuance },
    { path: '/users', label: 'Users', img: sideUsers },
    { path: '/enroll', label: 'Enrollments', img: enrollment },
  ];
  const [visible, setVisible] = useState(true);

  return (
    <>
      {loading && <Loader />}
      <div className="admin-layout">
        <aside className={visible ? "admin-sidebar" : "admin-toggle"}>
          <button onClick={() => setVisible(!visible)} className="sidebar-toggle-btn">
            {!visible ? "☰" : <ArrowLeftOutlined />}
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
export default AdminHOC;