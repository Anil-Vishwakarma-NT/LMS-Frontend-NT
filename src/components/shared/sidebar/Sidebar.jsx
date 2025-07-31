import React, { useState } from 'react';
import './Sidebar.css';
import { NavLink, useNavigate } from 'react-router-dom'
import Button from '../button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/authentication/authActions';
import { logoutUser } from '../../../service/UserService';
import ConfirmLogoutPopup from '../confirmLogoutPopup/ConfirmLogoutPopup';

const Sidebar = ({ items, visible }) => {
  const [isPopopOpen, setIsPopopOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);

  const handleLogoutAuth = () => {
    dispatch(logout());
    handleLogout();
  };

  const handleLogout = () => {
    console.log("Auth in logout user ", auth);
    logoutUser();
    localStorage.getItem("authToken")
    console.log("logout user called");
    navigate('/');
  }

  const openPopop = () => setIsPopopOpen(true);
  const closePopop = () => setIsPopopOpen(false);

  return (
    <div className={`sidebar ${visible ? 'sidebar-show' : 'sidebar-hide'}`}>

      <div className='sidebar-items'>

        {items && items.length && items.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? "sidebar-item-active" : "sidebar-item")}>
            <img className="side-logo" src={item.img} alt={item.label} />
            <div className="sidebar-text">{item.label}</div>
          </NavLink>
        ))}
        <div className="sidebar-logout-btn">
          <Button text="Logout" type="submit" onClick={openPopop} />
        </div>
      </div>
      <ConfirmLogoutPopup
        isOpen={isPopopOpen}
        onClose={closePopop}
        onConfirm={handleLogoutAuth}
      />
    </div>
  );
};
export default Sidebar;