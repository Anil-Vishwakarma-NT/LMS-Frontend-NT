import React, {useState} from 'react'
import Sidebar from '../sidebar/Sidebar';
import userProfile from "../../../assets/man.png";
import userHistory from "../../../assets/clock.png";
import userIssuance from "../../../assets/occupation.png";

const UserHOC = (Component) => function HOC() {

const sidebarItems = [
  { path: "/user", label: "Employee Dashboard", img: userHistory },
  { path: "/my-courses", label: "My Courses", img: userHistory }, 
];

  return (
    <div className='adminhoc'>
        <Sidebar items={sidebarItems} />
        <div className='dash-area'>
            <Component />
        </div>
    </div>
  )
}

export default UserHOC