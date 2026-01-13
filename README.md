# Smart Job Portal – Backend

This is the backend for the **Smart Job Portal** built using  
**Node.js + Express + MySQL** with JWT authentication.

Iimplemented:
- User Registration
- User Login
- MySQL database connection
- Password hashing using bcrypt
- JWT token generation

---

## Tech Stack

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
```Copy code```
``` CREATE TABLE users (```
  ``` id INT AUTO_INCREMENT PRIMARY KEY, ```
  ``` name VARCHAR(100), ```
  ``` email VARCHAR(100) UNIQUE, ```
  ``` password VARCHAR(255), ```
  ``` role ENUM('candidate','recruiter'), ```
  ``` created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ```
);```
(You can add other tables later: jobs, applications, saved_jobs, etc.)

Install Dependencies
From inside backend:

bash
Copy code
npm install
If not installed already:

bash
Copy code
``` npm install express cors mysql2 dotenv bcrypt jsonwebtoken ```
```npm install --save-dev nodemon ```
Run the Server
bash

``` npm run dev ```

#### Author - ### Prakash M

