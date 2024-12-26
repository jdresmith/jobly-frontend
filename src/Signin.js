import { useRef, useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "./UserContext";

const SignIn = () =>{
    const {setAuth} = useContext(UserContext)//sets Auth state and stores it in the global context
    const userRef = useRef();
    const errRef = useRef();

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)
    const [signInData, setSignInData] = useState({
        username: '',
        password: ''
    });

    const handleSignInChange = (e) => {
        const { name, value } = e.target;
        setSignInData(data => ({
            ...data,
            [name]: value
        }));
    };

    useEffect(()=>{
        userRef.current.focus();
    })

    useEffect(()=>{
        setErrMsg('');
    }, [signInData])

    const handleSignInSubmit = async (e) =>{
        e.preventDefault();
        console.log(`Sign in form data: ${signInData}`)
        setSignInData()
    }
    
    /**
     * const handleLoginSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const token = await JoblyApi.login(loginData);
    
          JoblyApi.token = token; // this is to set the token in the API helper
          const user = await JoblyApi.getUser(loginData.username);
    
          loginUser(user); // this is to update the context with the user's data
          setToken(token) //this sets token in localStorage
          navigate('/welcome');
        } catch (error) {
          alert('Invalid credentials');
        }
    };
    */
    return (
        <section>
            <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'}>{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSignInSubmit}>
                <label htmlFor="username">Username:</label>
                <input type="text" 
                name="username" 
                id="username"
                onChange={handleSignInChange} 
                ref={userRef}
                value={signInData.username}
                required
                />

                <label htmlFor="password">Username:</label>
                <input type="password" 
                name="password" 
                id="password"
                onChange={handleSignInChange}
                value={signInData.password}
                required
                />
                <button type="submit">Sign In</button>
                <p>New user? <NavLink to="/">Sign Up</NavLink> here.</p>
            </form> 
        </section>
    )
}
export default SignIn;