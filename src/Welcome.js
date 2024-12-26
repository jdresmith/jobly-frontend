import React, { useContext, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from './UserContext';

const Welcome = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
        navigate('/login');
    }
}, [user, navigate]);


  return (
    <>
      {user && (
        <p>Welcome, {user.username}!</p>
      )}
    </>
  );
};

export default Welcome;
