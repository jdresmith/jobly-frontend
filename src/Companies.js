import React, { useState, useEffect, useContext } from "react";
import JoblyApi from './api';
import Company from './Company';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const Companies = ({addCompany}) => {
    const { user } = useContext(UserContext);
    const COMPANY_SEARCH = {
        name: '',
        minEmployees: '',
        maxEmployees: ''
    }
    const [searchData, setSearchData] = useState(COMPANY_SEARCH);
    const [companies, setCompanies] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const navigate = useNavigate();
   
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSearchChange = (e) =>{
        const {name, value} = e.target;
        setSearchData(searchData =>({...searchData, [name]: value}))
    }
    
    const handleSearchSubmit = async(e) => {
        e.preventDefault();
        if(user){
            console.log({userInContextCompanies: user});

            //Create a copy of the searchData, omitting data if it is invalid or empty.
            const validSearchData = {...searchData};

            if (!searchData.name) {
                validSearchData.name = '___';
            }
            
            if (!searchData.minEmployees || searchData.minEmployees < 0) {
                validSearchData.minEmployees = '0';
            }

            
            if (!searchData.minEmployees || searchData.maxEmployees < searchData.minEmployees) {
                validSearchData.maxEmployees = '1000';
            }

            try{
                const companySearch = await JoblyApi.getCompanies(validSearchData);
                console.log({companySearchResult: companySearch});
                setCompanies(companySearch);
                setNoResults(companySearch.length === 0);
            }catch(error){
                alert("Error retrieving companies. Please try again later.")
                console.log({companiesError: error})
                navigate('/companies');
            }
            
        }
    }


    return(
        <>
            <form className='company-search' onSubmit={handleSearchSubmit}>
                <input
                    value={searchData.name}
                    onChange={handleSearchChange}
                    id='company-search'
                    placeholder='Search by name'
                    type='text'
                    name='name'
                />
                <input
                    value={searchData.minEmployees}
                    onChange={handleSearchChange}
                    id='min-employees'
                    placeholder='Min Employees'
                    type='number'
                    name='minEmployees'
                />
                <input
                    value={searchData.maxEmployees}
                    onChange={handleSearchChange}
                    id='max-employees'
                    placeholder='Max Employees'
                    type='number'
                    name='maxEmployees'
                />
                <button type="submit">🔍</button>
            </form>
            <div className='company-list'>
                {noResults ? (
                    <p>No company with that name.</p>
                ) : (
                    companies.map(company => (
                        <Company key={company.handle} company={company} />
                    ))
                )}
            </div>
        </>
    )
}
export default Companies;