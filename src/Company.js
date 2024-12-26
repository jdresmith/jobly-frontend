import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import JoblyApi from './api';

const Company = ({ company }) => {
  const { handle } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  console.log({ handleInCompany: handle });
  console.log({ userIsAdmin: user.isAdmin });
  console.log({ companyForEachCompany: company });

  const handleDelete = async () => {
    try {
      await JoblyApi.deleteCompany(company.handle);
      navigate('/companies');
    } catch (error) {
      alert('Error deleting company. Please try again later.');
      console.log({ companyDeleteError: error });
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCompany = async () => {
      if (user) {
        try {
          let fetchedCompany;
          if (handle) {
            fetchedCompany = await JoblyApi.getCompany(handle);
          }
        } catch (error) {
          console.error("Error fetching company", error);
          if (error.response && error.response.status === 404) {
            alert('No such company exists.');
          } else {
            alert('An error occurred while fetching the company.');
          }
        }
      } else {
        navigate('/login');
      }
    };
    fetchCompany();
  }, [user, handle, navigate]);

  if (!company) return <p>Loading...</p>;

  return (
    <div style={{ border: '1px solid' }}>
      <h2>{company.name}</h2>
      <p>Number of Employees: {company.numEmployees.toString()}</p>
      <p>Description: {company.description}</p>
      <p>Company Handle: {company.handle}</p>
      {company.logoUrl &&
        <img
          src={company.logoUrl}
          alt={`${company.name} logo`}
          className='company-logo'
        />
      }
      {user.isAdmin && <button onClick={handleDelete}>Delete Company</button>}
      <h3>Jobs</h3>
      <ul>
        {company.jobs.map(job => (
          <li key={job.id}>
            {job.title}: ${job.salary !== null ? job.salary : 'N/A'}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/jobs')}>See All Jobs</button>
    </div>
  );
};

export default Company;
