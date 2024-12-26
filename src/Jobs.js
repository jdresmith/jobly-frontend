import React, { useState, useEffect, useContext } from "react";
import JoblyApi from './api';
import Job from './Job';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const Jobs = ({ addJob }) => {
    const { user } = useContext(UserContext);
    const JOB_SEARCH = {
        title: '',
        minSalary: '',
        hasEquity: false
    };

    const [searchData, setSearchData] = useState(JOB_SEARCH);
    const [jobs, setJobs] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSearchChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setSearchData(searchData => ({ ...searchData, [name]: val }));
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        console.log({userInContextJobs: user})

        //Create a copy of the searchData, omitting data if it is invalid or empty.
        const validSearchData = {...searchData};

        if(!searchData.title){
            validSearchData.title = '___';
        }

        if(!searchData.minSalary){
            validSearchData.minSalary = '0'
        }

        if(!searchData.hasEquity){
           delete validSearchData.hasEquity
        }

        if(user){
            try{
                const jobSearch = await JoblyApi.getJobs(validSearchData)
                console.log({jobsSearchResult: jobSearch});
                setJobs(jobSearch)
                setNoResults(jobSearch.length === 0);
            }catch(error){
                alert("Error retrieving job. Please try again later.")
            }
        }
        
    };

    return (
        <>
            <form className='job-search' onSubmit={handleSearchSubmit}>
                <input
                    value={searchData.title}
                    onChange={handleSearchChange}
                    id='job-title'
                    placeholder='Search by title'
                    type='text'
                    name='title'
                />
                <input
                    value={searchData.minSalary}
                    onChange={handleSearchChange}
                    id='min-salary'
                    placeholder='Min Salary'
                    type='number'
                    name='minSalary'
                />
                <label htmlFor='has-equity'>
                    <input
                        checked={searchData.hasEquity}
                        onChange={handleSearchChange}
                        id='has-equity'
                        type='checkbox'
                        name='hasEquity'
                    />
                    Has Equity
                </label>
                <button type="submit">🔍</button>
            </form>
            <div className='job-list'>
                {noResults ? (
                <p>No job with that title.</p>
                ) :(
                jobs.map(job => (
                    <Job key={job.id} job={job} />
                ))
            )}
            </div>
        </>
    );
}

export default Jobs;