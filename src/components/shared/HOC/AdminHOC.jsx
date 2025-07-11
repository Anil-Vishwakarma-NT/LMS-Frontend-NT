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

const AdminHOC = (Component) => function HOC() {

  const [loading, setLoading] = useState(false)
  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', img: sideDash },
    { path: '/categories', label: 'Bundles', img: sideCategory },
    { path: '/books', label: 'Courses', img: sideBook },
    { path: '/group', label: 'Groups', img: sideIssuance },
    { path: '/users', label: 'Users', img: sideUsers },
    { path: '/enroll', label: 'Enrollments', img: enrollment }
  ];

  return (
    <>
      {loading && <Loader data-testid="loader" />}
      <div className='adminhoc' data-testid="adminhoc">
        <Sidebar items={sidebarItems} />
        <div className='dash-area'>
          <Component loading={loading} setLoading={setLoading} />
        </div>
      </div>
    </>
  )
}

export default AdminHOC