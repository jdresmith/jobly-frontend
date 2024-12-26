import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import JoblyApi from './api';

const Job = ({ job }) => {
    const [appliedForJob, setAppliedForJob] = useState(false)
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    /**Check if the user has applied for the job when the component mounts */
    useEffect(() => {
        const checkIfApplied = async () => {
            try {
                if (user) {
                    const appliedJobs = await JoblyApi.getAppliedJobs(user.username);
                    const hasApplied = appliedJobs.includes(job.id);
                    setAppliedForJob(hasApplied);
                }
            } catch (error) {
                console.error("Error checking applied jobs:", error);
            }
        };

        checkIfApplied();
    }, [user, job.id]);

    const handleApply = async() =>{
        try{
            await JoblyApi.applyToJob(user.username, job.id)
            setAppliedForJob(true)
        }catch(error){
            alert("Error applying. Please try again later.")
            console.log(error)
        }
    }
    
    const handleDelete = async () => {
        try {
            await JoblyApi.deleteJob(job.id);
            alert('Job deleted successfully.');
            navigate('/jobs');
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Error deleting job. Please try again later.');
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    
    return ( 
            <div className="job-info" style={{ border: '1px solid' }}>
                <h2>{job.title}</h2>
                <p><b>Salary:</b> ${job.salary.toLocaleString()}</p>
                <p><b>Equity:</b> {job.equity > 0 ? job.equity : "None"}</p>
                <p><b>Company:</b> {job.companyHandle}</p>
                <button onClick={handleApply} disabled={appliedForJob}>{appliedForJob ? 'Applied' : 'Apply'}</button>
                {user.isAdmin && <button onClick={handleDelete}>Delete Job</button>}
            </div>

    );
}

export default Job;
