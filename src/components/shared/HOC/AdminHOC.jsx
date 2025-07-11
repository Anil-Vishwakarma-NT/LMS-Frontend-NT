import React, { useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import './AdminHOC.css'
import sideDash from "../../../assets/dashboard.png";
import sideUsers from "../../../assets/profile.png";
import sideCategory from "../../../assets/categories.png";
import sideBook from "../../../assets/magic-book.png";
import sideIssuance from "../../../assets/clock.png";
import Loader from '../loader/Loader';

const AdminHOC = (Component) => function HOC() {

  const [loading, setLoading] = useState(false)
  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', img: sideDash },
    { path: '/categories', label: 'Bundles', img: sideCategory },
    { path: '/books', label: 'Courses', img: sideBook },
    { path: '/group', label: 'Groups', img: sideIssuance },
    { path: '/users', label: 'Users', img: sideUsers },
    { path: '/enroll', label: 'Enrollments', img: sideIssuance }
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