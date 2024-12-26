import React, { useState, useEffect, useContext } from "react";
import JoblyApi from "./api";
import { UserContext } from './UserContext';
import { useNavigate, useParams } from 'react-router-dom';

/** Ensure the user is logged in to get to this path
 * Conditionally render a form to edit the user info
 * Pass the update handler function in as props from App
 * Ensure the user in session is the user the profile belongs to or navigate away
 */
const Profile = () => {
    const { user, logoutUser } = useContext(UserContext);
    const [checkedEdit, setCheckedEdit] = useState(false);
    const [profileUser, setProfileUser] = useState(null);

    /** The admin input field will be conditionally rendered in the Edit Profile Form */
    const [updateData, setUpdateData] = useState({
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        isAdmin: ''
    });

    const navigate = useNavigate();
    const { username } = useParams();
    console.log({ usernameInProfile: username });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Fetches the user's details.
    useEffect(() => {
        const fetchUser = async () => {
            if (user) {
                try {
                    let fetchedUser;
                    if (user.isAdmin && username) {
                        fetchedUser = await JoblyApi.getUser(username);
                    } else {
                        // If the user is not an admin, only fetch their own profile
                        fetchedUser = await JoblyApi.getUser(user.username);
                    }
                    setProfileUser(fetchedUser);
                } catch (error) {
                    console.error("Error fetching user", error);
                    if (error.response && error.response.status === 404) {
                        alert('No such user exists.');
                    } else {
                        alert('An error occurred while fetching the user.');
                    }
                    navigate('/profile');
                }
            } else {
                navigate('/login');
            }
        }
        fetchUser();
    }, [user, username, navigate]);

    // Checks if the current user is logged in and authorized to view the profile.
    useEffect(() => {
        if (user && profileUser) {
            if (profileUser.username !== user.username && !user.isAdmin) {
                alert("Not authorized to view this user.");
                navigate('/profile')
                if (user && !user.isAdmin) {
                    navigate('/welcome');
                } else if (user.isAdmin) {
                    navigate('/users');
                }
            }
        }
    }, [profileUser, user, navigate]);

    const toggleEditForm = () => {
        setCheckedEdit(!checkedEdit);
    }

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateData(data => ({
            ...data, [name]: value
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            console.log({ userInContextProfile: user });

            // Create a copy of the updateData, omitting the password if it is invalid or empty
            const validUpdateData = { ...updateData };

            if (!updateData.password || updateData.password.length < 5) {
                delete validUpdateData.password;
            }
            // Ensure isAdmin is correctly set to a boolean value
            if (user.isAdmin) {
                validUpdateData.isAdmin = updateData.isAdmin === "true";
            } else {
                validUpdateData.isAdmin = updateData.isAdmin === "false";
            }

            if(!updateData.email){
                validUpdateData.email = profileUser.email;
            }

            if(!updateData.firstName){
                validUpdateData.firstName = profileUser.firstName;
            }

            if(!updateData.lastName){
                validUpdateData.lastName = profileUser.lastName;
            }

            try {
                await JoblyApi.patchUser(profileUser.username, validUpdateData);
                console.log("Success updating profile");
                setUpdateData({
                    password: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    isAdmin: ''
                });
            } catch (error) {
                alert('Error editing profile. Please try again later');
                console.log("Error:", error);
            }
        }
    }

    /** If a user deletes their own account, they will be logged out and brought to the signup form on the homepage.
     * If it is not the user's own account they are given an alert and redirected to the welcome page.
     */
    const handleDelete = async () => {
        try {
            await JoblyApi.deleteUser(profileUser.username);
            if (user.username === profileUser.username) {
                alert('Sorry to see you go. Account has been deleted.');
                logoutUser();
                localStorage.removeItem('token');
                navigate('/');
            } else {
                alert("Account Deleted");
                navigate('/welcome');
            }
        } catch (error) {
            alert('Error deleting user. Please try again later.');
            console.log({deleteUserError: error})
        }
    };

    if (!user) {
        return <p>Loading &hellip;</p>;
    }

    if (profileUser === null) {
        return <p>Loading profile&hellip;</p>;
    }

    // Form that conditionally renders a field to edit admin status if the current user is an admin
    return (
        <>
            <h1>{profileUser.firstName} {profileUser.lastName}</h1>
            <p><b>Username:</b> {profileUser.username}</p>
            <p><b>Email:</b> {profileUser.email}</p>
            <button onClick={toggleEditForm}>
                {checkedEdit ? 'Cancel' : 'Edit Profile'}
            </button>
            {checkedEdit && (
                <form onSubmit={handleUpdateSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={updateData.firstName}
                        onChange={handleUpdateChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={updateData.lastName}
                        onChange={handleUpdateChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={updateData.email}
                        onChange={handleUpdateChange}
                    />
                    {user.username === profileUser.username && <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={updateData.password}
                        onChange={handleUpdateChange}
                    />}
                    {user.isAdmin &&
                        <>
                            <select name="isAdmin" value={updateData.isAdmin} onChange={handleUpdateChange}>
                                <option disabled> Admin Status</option>
                                <option value="true">Admin</option>
                                <option value="false">User</option>
                            </select>
                        </>}
                    <button type="submit">Save Changes</button>
                </form>
            )}
            {(user.isAdmin || user.username === profileUser.username) && <button onClick={handleDelete}>Delete User</button>}
        </>
    );
}

export default Profile;
