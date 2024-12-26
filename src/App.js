import React, {useState, useEffect, useContext} from 'react';
import {Routes, Route, useNavigate, useParams} from 'react-router-dom';
import {UserContext } from './UserContext';
import Login from './Login';
import SignUp from './SignUp';
import Welcome from './Welcome';
import NavBar from './NavBar';
import Companies from './Companies';
import Company from './Company'
import Jobs from './Jobs';
import Job from './Job';
import Profile from './Profile';
import useLocalStorageState from './hooks/useLocalStorageState';
import JoblyApi from './api';
import Users from './Users';
import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([])
  const [jobs, setJobs] = useState([]);
  const [token, setToken] = useLocalStorageState('token', null) //sets state in the localStorage
  const {user, loginUser } = useContext(UserContext);
  const navigate = useNavigate();
  

  const [signUpData, setSignUpData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
}); /**we don't want admin status sent to the backend because it poses a security risk because a user could enter a token with isAdmin set to true on registering! */

const [loginData, setLoginData] = useState({
  username: '',
  password: ''
});


// useEffect(() => {
//     console.log('Token initialized:', token);
//     setIsLoading(false);
// }, [token]); this one did not update the token in JoblyApi

//sets JoblyApi.token to the token in localStorage for communicating with the backend routes.
useEffect(() => {
  if (token) {
    JoblyApi.token = token;
  }
  setIsLoading(false);
}, [token]);


const handleSignUpChange = (e) => {
  const { name, value } = e.target;
  setSignUpData(data => ({
      ...data,
      [name]: value
  }));
};

const handleLoginChange = (e) => {
  const { name, value } = e.target;
  setLoginData(data => ({
      ...data,
      [name]: value
  }));
};



const handleSignUpSubmit = async (e) => {
      //incorporate the new useLocalStorage hook setting the token state in here too.
      e.preventDefault();
      console.log('prevented default on sign up')
      try {
        const newUser = await JoblyApi.postUser(signUpData);
        const token = await JoblyApi.login({
          username: signUpData.username,
          password: signUpData.password
        });
        console.log('sign up token:', token)
        setToken(token);
        loginUser(token);
        navigate('/welcome');
      } catch (error) {
        alert('Error signing up');
        console.log(error);
      }
};

const handleLoginSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = await JoblyApi.login(loginData);
        JoblyApi.token = token; // this is to set the token in the API helper
        localStorage.setItem('token', token);  // Store token in local storage
        const user = await JoblyApi.getUser(loginData.username);
        loginUser(user, token); // this is to update the context with the user's data
        setToken(token) //this sets token in localStorage and JoblyApi
        navigate('/welcome');
      } catch (error) {
        alert('Invalid credentials');
      }
};


const addCompany = (handle, name, numEmployees, description, logoUrl) => {
  setCompanies(companies => [...companies, {handle, name, numEmployees, description, logoUrl}]);
}

const addJob = (id, title, salary, equity, companyHandle) =>{
    setJobs({id, title, salary, equity, companyHandle})
}

console.log(companies);
console.log(jobs);

if(isLoading) {
    return <p>Loading &hellip;</p>
}



return (
    <div>
          <NavBar />
            <Routes>
                { /**think about a useNavigate to /signup 
                 * Search for Protected Routes & Authentication with react router for React 18*/ }
                <Route path='/' element={<SignUp 
                  handleSignUpChange={handleSignUpChange}
                  handleSignUpSubmit={handleSignUpSubmit}
                  signUpData={signUpData} 
                />} />
                <Route path='/login' element={<Login 
                  handleLoginChange={handleLoginChange}
                  handleLoginSubmit={handleLoginSubmit}
                  loginData={loginData} 
                />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path='/companies' element={<Companies addCompany={addCompany} />} />
                <Route path='/companies/:handle' element={<Company />} />
                <Route path='/jobs' element={<Jobs addJob={addJob} />} />
                <Route path='/jobs/:id' element={<Job />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/users' element={<Users />} />
                <Route path='/users/:username' element={<Profile />} />
            </Routes>
    </div>
)

}
export default App;

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
