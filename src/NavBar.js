import React, { useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import './NavBar.css';

const NavBar = () => {
  const { user, logoutUser } = useContext(UserContext);
  console.log(user)
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
        navigate('/login');
    }
  }, [user, navigate]);
    //have a conditional for what is shown in your NavBar instead of line by line condtionals.
    return (
    <nav>
      
      {user && user.username ? (
    <>
      <NavLink className='NavBarLinks' exact to="/companies">Companies</NavLink>
      <NavLink className='NavBarLinks' exact to="/jobs">Jobs</NavLink>
      <NavLink className='NavBarLinks' exact to={`/profile`}>Profile</NavLink>
      <NavLink className='NavBarLinks' exact to={`/welcome`}>Home</NavLink>
      {user.isAdmin && <NavLink className='NavBarLinks' to="/users">Users</NavLink>}
      <i>{user.username}</i> 👤
      <button onClick={logoutUser}>Logout</button>
    </>
  ) : (
    <>
        <NavLink className='NavBarLinks' to="/login">Login</NavLink>
        <NavLink className='NavBarLinks' to="/">Sign Up</NavLink>
    </>
  )}
    </nav>
  );
};

export default NavBar;
