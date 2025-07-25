import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from "../../../assets/logo-main2.png";
import userLogo from "../../../assets/profile-account.png";
import { useSelector } from 'react-redux';
import Tooltip from '../tooltip/Tooltip';
import Avatar from './Avatar';
const Navbar = () => {
  const auth = useSelector(state => state.auth)
  const fullName = auth?.name;
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li className="navbar-logo">
          <Link to={auth?.roles?.includes("ADMIN") ? "/admin" : "/user"}>
            <img src={logo} alt="logo" className='logo' style={{ width: '70px', height: 'auto' }} />
          </Link>
        </li>
        <li className="nav-link">
          {auth?.roles?.includes("ADMIN") ? (
            <>
              <Link to="/about" className='navbar-item nav-items'>About Us</Link>
              <div className='navbar-logo profile-logo'>
                <Tooltip tooltipText={`Welcome, ${auth?.name}`}>
                  <Avatar fullName={fullName} />
                </Tooltip>
              </div>
            </>
          ) : auth?.roles?.includes("EMPLOYEE") ? (
            <>
              <Link to="/about" className='navbar-item nav-items'>About Us</Link>
              <Link to="/contact" className='navbar-item nav-items'>Contact Us</Link>
              <div className='navbar-logo profile-logo'>
                <Tooltip tooltipText={`Welcome, ${auth?.name}`}>
                  <Avatar fullName={fullName} />
                </Tooltip>
              </div>
            </>
          ) : (
            <>
              <Link to="/about" className='navbar-item nav-items'>About Us</Link>
              <Link to="/contact" className='navbar-item nav-items'>Contact Us</Link>
            </>
          )
          }
            </li>
        </ul>
    </nav>
    
  )
}

export default Navbar
