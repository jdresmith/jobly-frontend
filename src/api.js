import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get")
        ? data
        : {};
  console.log('JoblyApi at work')
    try {
      console.log('inside try for JoblyApi')
      const userResponse = (await axios({ url, method, data, params, headers })).data;
      console.log('user response done')
      console.log({ url, method, data, params, headers })
      console.log({userResponse})
      return userResponse;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

    /** Get all companies or search companies by name, minEmployees, and maxEmployees */
  static async getCompanies({ name = '___', minEmployees, maxEmployees } = {}) {
    const query = {name, minEmployees, maxEmployees};
    if (name) query.name = name;
    if (minEmployees !== undefined) query.minEmployees = minEmployees;
    if (maxEmployees !== undefined) query.maxEmployees = maxEmployees;

    let res = await this.request('companies/', query, 'get');
    console.log({companiesRes: res.companies})
    return res.companies;
  }


  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`, {}, 'get');
    console.log({companyRes: res.company})
    return res.company;
  }

  /** Create a new company */

  static async postCompany(data) {
    let res = await this.request(`companies`, data, 'post');
    return res.company;
  }

  /** Update a company */

  static async patchCompany(handle, data) {
    let res = await this.request(`companies/${handle}`, data, 'patch');
    return res.company;
  }

  /** Delete a company */

  static async deleteCompany(handle) {
    let res = await this.request(`companies/${handle}`, {}, 'delete');
    console.log({companyDeleteRes: res.message})
    return res.message;
  }


  // User API routes

  /** Get details on a user by username. */
  static async getUser(username) {
    let res = await this.request(`users/${username}`, {}, 'get');
    return res.user;
  }

  /** Get all users */

  static async getUsers(){
    let res = await this.request('users', {}, 'get');
    return res.users;
  }

  /** Register a new user. */
  static async postUser(data) {
    console.log('creating user:', data)
    let res = await this.request('auth/register', data, 'post');
    console.log({res});
    return res.token;
  }

  /** Update a user. */
  static async patchUser(username, data) {
    let res = await this.request(`users/${username}`, data, 'patch');
    console.log({usernameInPatchUser: username})
    console.log({res})
    return res;
  }

  /** Delete a user. */
  static async deleteUser(username) {
    let res = await this.request(`users/${username}`, {}, 'delete');
    return res.message;
  }

  /** Login for users */
  static async login(data) {
    let res = await this.request('auth/token', data, 'post');
    JoblyApi.token = res.token;
    return res.token;
  }

  // Jobs API routes

  /** Get details on a job by id. */
  static async getJob(id) {
    let res = await this.request(`jobs/${id}`, {}, 'get');
    return res.job;
  }

  static async getJobs({ title = '', minSalary, hasEquity } = {}) {
    const query = {title, minSalary, hasEquity};
    if (title) query.title = title;
    if (minSalary !== undefined) query.minSalary = minSalary;
    if (hasEquity !== undefined) query.hasEquity = hasEquity;

    let res = await this.request('jobs', query, 'get');
    return res.jobs;
  }

  /** Post a new job. */
  static async postJob(data) {
    let res = await this.request('jobs', data, 'post');
    return res.job;
  }

  /** Update job details. */
  static async patchJob(id, data) {
    let res = await this.request(`jobs/${id}`, data, 'patch');
    return res.job;
  }

  /** Delete a job. */
  static async deleteJob(id) {
    let res = await this.request(`jobs/${id}`, {}, 'delete');
    return res.message;
  }
  
  //Apply for a job
  static async applyToJob(username, id) {
    let res = await this.request(`users/${username}/jobs/${id}`, {}, 'post');
    console.log(res.applied)
    return res.applied;
  }

  //Retrieves all the jobs a user has already applied to.
  static async getAppliedJobs(username) {
    let res = await this.request(`users/${username}/jobs`, {}, 'get');
    console.log(res.jobs)
    return res.jobs;
  }
  // obviously, you'll add a lot here ...
}

// for now, put token ("testuser" / "password" on class)
// JoblyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//     "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//     "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default JoblyApi;