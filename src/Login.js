import React from 'react';
import { NavLink } from 'react-router-dom';

const Login = ({ handleLoginChange, handleLoginSubmit, loginData }) => {
    return (
        <>
            <form onSubmit={handleLoginSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    value={loginData.username} 
                    onChange={handleLoginChange} 
                    placeholder="Username" 
                />
                <input 
                    type="password" 
                    name="password" 
                    value={loginData.password} 
                    onChange={handleLoginChange} 
                    placeholder="Password" 
                />
                <button type="submit">Login</button>
            </form>
            <p>New user? <NavLink to="/">Sign Up</NavLink> here.</p>
        </>
    );
};

export default Login;
