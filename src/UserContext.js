import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import JoblyApi from './api';

const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  //localStorage is needed to store information about the user even after the app is closed. userContext gets wiped every time the app closes.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ username: decodedToken.username });
        JoblyApi.token = token; // Sets the token in the API helper
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('token'); // Clears corrupted token
      }
    }
  }, []);

  // authenticates user and set token
  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    JoblyApi.token = token;
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    JoblyApi.token = null;
  };


  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
