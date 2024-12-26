import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "./UserContext";
import JoblyApi from "./api";

// Can be used by admins to search for users in order to access their profiles.
const Users = () => {
    const { user } = useContext(UserContext);
    const USER_SEARCH = {
        username: ''
    };
    const [searchData, setSearchData] = useState(USER_SEARCH);
    const [users, setUsers] = useState([]);
    const [noResults, setNoResults] = useState(false); // State to handle no results
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData(searchData => ({ ...searchData, [name]: value }));
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        console.log(user.isAdmin);
        if (user.isAdmin) {
            try {
                console.log('inside search try');
                const userSearch = await JoblyApi.getUser(searchData.username);
                console.log({ userSearch });
                setNoResults(userSearch.length === 0); // Set noResults if no user is found
                if (userSearch) {
                    setUsers([userSearch]);
                    console.log('Retrieved user:', userSearch);
                    console.log('found users:', { users });
                } else {
                    setUsers([]);
                    console.log({ users });
                }
            } catch (error) {
                setUsers([]);
                setNoResults(true); // Set noResults if an error occurs
                console.error("User not found", error);
            }
        } else {
            alert("Unauthorized to view this profile. Returning you to yours.");
            navigate('/profile');
        }
    };

    return (
        <>
            <form className='user-search' onSubmit={handleSearchSubmit}>
                <label htmlFor="username-search">Username:</label>
                <input
                    value={searchData.username}
                    onChange={handleSearchChange}
                    id='username-search'
                    placeholder='Search by username'
                    type='text'
                    name='username'
                />
                <button type="submit">🔍</button>
            </form>
            <div className='user-list'>
                {noResults ? (
                    <p>No user with that username.</p>
                ) : (
                    users.map(foundUser => (
                        <div style={{ border: '1px solid' }} key={foundUser.username}>
                            <p>{foundUser.username}</p>
                            <p>{foundUser.firstName} {foundUser.lastName}</p>
                            <button onClick={() => navigate(`/users/${foundUser.username}`)}>View Profile</button>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default Users;
