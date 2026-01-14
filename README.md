# Smart Job Portal – Backend

This is the backend for the **Smart Job Portal** built using  
**Node.js + Express + MySQL** with JWT authentication.

### Implemented:
- User Registration
- User Login
- MySQL database connection
- Password hashing using bcrypt
- JWT token generation

---

### Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2
- bcrypt
- jsonwebtoken
- dotenv
- nodemon

---

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=job_portal
JWT_SECRET=mysecretkey

---


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

<br>

(You can add other tables later: jobs, applications, saved_jobs, etc.)

Install Dependencies
From inside backend:
npm install

If not installed already:
``` npm install express cors mysql2 dotenv bcrypt jsonwebtoken ``` <br>
```npm install --save-dev nodemon ``` <br>

Run the Server
``` npm run dev ```  <br>

#### POSTMAN TESTING;

### POST/auth/register - Route (Signup with user details like name(required), mail(required), password(required))
``` GET http://localhost:5000/auth/register ``` <br>

---

### POST/auth/login - Route (Login with user details mail(required), password(required))
``` GET http://localhost:5000/auth/login ``` <br>

---

### GET/jobs & GET/jobs/:id - Route (For User - Listing jobs with pagination, filters)
``` GET http://localhost:5000/jobs ``` <br>
``` GET http://localhost:5000/jobs?fullstack ``` 

---

### POST/applications - Route (Application with name, mail, resume)
``` POST http://localhost:5000/applications ```  <br>
```

with user id, job_id, name, mail and resume file 
everything expect job id is unique so it can't use duplicate.
```

---

#### Author - ### Prakash M

