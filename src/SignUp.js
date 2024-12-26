import React from 'react';
import { NavLink } from 'react-router-dom';
import "./SignUp.css";

const SignUp = ({ handleSignUpChange, handleSignUpSubmit, signUpData }) => {
    return (
      <>
        <form onSubmit={handleSignUpSubmit}>
            <input 
                type="text" 
                name="username" 
                value={signUpData.username} 
                onChange={handleSignUpChange} 
                placeholder="Username" 
            />
            <input 
                type="password" 
                name="password" 
                value={signUpData.password} 
                onChange={handleSignUpChange} 
                placeholder="Password" 
            />
            <input 
                type="text" 
                name="firstName" 
                value={signUpData.firstName} 
                onChange={handleSignUpChange} 
                placeholder="First Name" 
            />
            <input 
                type="text" 
                name="lastName" 
                value={signUpData.lastName} 
                onChange={handleSignUpChange} 
                placeholder="Last Name" 
            />
            <input 
                type="email" 
                name="email" 
                value={signUpData.email} 
                onChange={handleSignUpChange} 
                placeholder="Email" 
            />
            <button type="submit">Sign Up</button>
        </form>
        <p>Already a user? <NavLink exact to="/login">Login</NavLink> here.</p>
      </>
    );
};

export default SignUp;
