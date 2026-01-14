# Smart Job Portal – Backend

This is the backend for the **Smart Job Portal** built using  
**Node.js + Express + MySQL** with JWT authentication.

### Iplemented:
- User Registration
- User Login
- MySQL database connection
- Password hashing using bcrypt
- JWT token generation

---

### = Tech Stack

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

###### GET/Jobs - Route (Listing jobs with pagination, filters)
``` GET http://localhost:5000/jobs ``` 
``` GET http://localhost:5000/jobs?fullstack ``` 

---

#### Author - ### Prakash M

