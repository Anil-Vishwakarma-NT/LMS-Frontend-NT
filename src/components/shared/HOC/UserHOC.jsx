import React, {useState} from 'react'
import Sidebar from '../sidebar/Sidebar';
import userProfile from "../../../assets/man.png";
import userHistory from "../../../assets/clock.png";
import userIssuance from "../../../assets/occupation.png";


import Loader from '../loader/Loader';


const UserHOC = (Component) => function HOC() {

  const [loading, setLoading] = useState(false)

const sidebarItems = [
  { path: "/user", label: "Employee Dashboard", img: userHistory },
  { path: "/my-courses", label: "My Courses", img: userHistory }, 
];

  return (
    <>
    {loading && <Loader data-testid="loader" />}
    <div className='adminhoc'>
        <Sidebar items={sidebarItems} />
        <div className='dash-area'>
            <Component loading={loading} setLoading={setLoading} />
        </div>
    </div>
    </>
  )
}

export default UserHOC