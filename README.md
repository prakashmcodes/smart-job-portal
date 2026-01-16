# SMART JOB PORTAL

Jump to: [Backend](#backend) - [Frontend](#frontend)


### Implemented:
- User Registration

- User Login

- MySQL database connection

- Password hashing using bcrypt

- JWT token generation

- Full authentication system

- Role-based routing

- Recruiter vs Candidate separation

- Resume upload

- Job details page

- Apply workflow

- Status updates

- Real-world job portal logic

---

<a id="backend"></a>
## Smart Job Portal – Backend {#backend}

This is the backend for the **Smart Job Portal** built using  
**Node.js + Express + MySQL** with JWT authentication.

### Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2
- bcrypt
- jsonwebtoken
- dotenv
- nodemon


## Environment Variables

Create a `.env` file inside the `backend` folder:

```env```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=job_portal
JWT_SECRET=mysecretkey


## MySQL Tables
1. Users Table
sql

```
 CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE, 
  password VARCHAR(255), 
  role ENUM('candidate','recruiter'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); 
```
2. Jobs Table

```

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  requirements TEXT,
  location VARCHAR(100),
  experience VARCHAR(100),
  company_name VARCHAR(255),
  company_about TEXT,
  company_logo VARCHAR(255),
  company_website VARCHAR(255),
  recruiter_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
);
```

3. Applications Tavble
```

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  user_id INT,
  name VARCHAR(100),
  email VARCHAR(100),
  resume VARCHAR(255),
  status ENUM('Applied','Shortlisted','Rejected') DEFAULT 'Applied',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  UNIQUE(job_id, user_id)
);
```

Skill Mapping

```

CREATE TABLE job_skills (
  job_id INT,
  skill_id INT,
  PRIMARY KEY (job_id, skill_id),
  
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);
```


<br>

(You can add other tables later: jobs, applications, saved_jobs, etc.)

Install Dependencies
From inside backend:
npm install

If not installed already: <br>
``` npm install express cors mysql2 dotenv bcrypt jsonwebtoken ``` <br>
```npm install --save-dev nodemon ``` <br>

Run the Server
``` npm run dev ```  <br>

#### POSTMAN TESTING;

### POST/auth/register - Route (Signup with user details like name(required), mail(required), password(required))
``` GET http://localhost:5000/auth/register ``` <br>


### POST/auth/login - Route (Login with user details mail(required), password(required))
``` GET http://localhost:5000/auth/login ``` <br>



### GET/jobs & GET/jobs/:id - Route (For User - Listing jobs with pagination, filters)
``` GET http://localhost:5000/jobs ``` <br>

``` GET http://localhost:5000/jobs?fullstack ``` 


### POST/applications - Route (Application with name, mail, resume)
``` POST http://localhost:5000/applications ```  <br>
```

with user id, job_id, name, mail and resume file 
everything expect job id is unique so it can't use duplicate.
```

___

<a id="frontend"></a>
## Smart Job Portal – Frontend 

This is the frontend for the **Smart Job Portal** built using ***Vite***  
**React JS, React Router, Tailwind CSS, Lucid React** with **Axios**.

---
### Implemented:
- Role based routing
- Candidate, Recruiter Register & Login(Auth)
- Backend + MySQL database connection with axios
- Icons by Lucide React
- UI Designs in Tailwind CSS
- Applications Page for Recruiters, Candidates
- Posting Jobs for Recruites
---

### Tech Stack

- React JS
- React Router 
- Lucide React
- axios
- tailwind CSS
- react hot toast

### Setup to Frontend

Intsall npm for all dependancies <br>

```npm i``` or ```npm install``` <br>

To run project in Browser <br>

```npm run dev```

---

### - Prakash M
