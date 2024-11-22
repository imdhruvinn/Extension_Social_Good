# AdminPage

## Overview

This project is an admin panel website that allows administrators to view and manage user data stored in a MongoDB database. The admin panel includes login authentication, a paginated list of registered users, and detailed views of each user’s information (email, phone number, and emotion analysis). The backend is built using **Node.js** and **Express.js**, while the frontend is designed with **HTML**, **CSS**, and **JavaScript**.

## File Structure

```
AdminPage/
│
├── src/
│   ├── controllers/
│   │   └── authController.js     # Handles authentication logic (login validation)
│   ├── models/
│   │   └── User.js               # MongoDB model schema for users
│   ├── routes/
│   │   └── userRoutes.js         # Routes for fetching and managing users
│   ├── public/
│   │   ├── index.html            # Admin login page
│   │   ├── users.html            # User listing page
│   │   ├── user_info.html        # User details page (for individual users)
│   │   ├── js/
│   │   │   └── validation.js     # JavaScript logic for login validation
│   │   ├── css/
│   │   │   └── style.css         # CSS for the login page
│   │   │   └── user.css          # CSS for the users list and user details pages
│   └── server.js                 # Main Express server
│
├── package.json                  # Project dependencies and scripts
├── README.md                     # Project documentation
└── .env                          # Environment variables (e.g., MongoDB connection string)
```

## Key Features

1. **Login Authentication**:
   - Admins must log in to access the system. If the credentials are incorrect, appropriate error messages are shown.
2. **User List with Pagination**:
   - Lists all users fetched from MongoDB with pagination (10 users per page). The admin can navigate between pages using "Previous" and "Next" buttons.
3. **User Details View**:

   - Clicking on a user’s email from the users' list will navigate to a detailed user information page showing their email, phone number, and emotion data.

4. **MongoDB Data Storage**:
   - User data, including email, phone number, and emotion information, is stored in MongoDB and fetched through Express.js API routes.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v14.x or later)
- **MongoDB** (local MongoDB server or MongoDB Atlas cloud database)

## Setup and Installation

### 1. Clone the Repository or set File Directory

```bash
git clone <repository-url>
cd AdminProject
```

if You use visual Studio Code than set file directory by typing in VSC terminal

cd Admin

### 2. Install Dependencies

```bash
npm install
```

in VSC terminal write:

npm install

This will install all the required Node.js packages defined in `package.json`.

### 3. Set Up MongoDB Connection

Ensure MongoDB is running on your system or that you have access to a MongoDB Atlas instance.

- Create a `.env` file in the root directory and add the MongoDB URI (replace `<YOUR_MONGO_URI>` with your actual MongoDB connection string):

```
MONGO_URI=mongodb://localhost:27017/adminDB
```

### 4. Start the Application

To start the admin website and the backend server, run:

```bash
npm start
```

This will start the server on `http://localhost:3000/`.

### 5. Access the Admin Panel

Open your web browser and go to:

```
http://localhost:3000/index.html
```

This will load the admin login page.

### 6. Admin Login

The default credentials are:

- **Username**: `admin123@gmail.com`
- **Password**: `password456`

After logging in successfully, you'll be redirected to the **Users List** page, which fetches and displays users stored in MongoDB.

## Detailed Explanation of Files

### 1. **Controllers**

- **`authController.js`**: Contains the logic for user authentication, including password validation for login. This ensures the admin can access the system only with correct credentials.

### 2. **Models**

- **`User.js`**: Defines the **User** schema for MongoDB. Each user in the database is represented by fields such as `name`, `email`, `phone`, and `emotion`.

### 3. **Routes**

- **`userRoutes.js`**: Defines API routes for interacting with user data:
  - **GET /api/users**: Fetches a paginated list of users from MongoDB.
  - **GET /api/users/:email**: Fetches details of an individual user by their email.

### 4. **Frontend Files**

- **`index.html`**: The admin login page.
- **`users.html`**: Displays a paginated list of users.
- **`user_info.html`**: Shows detailed information for a specific user when their email is clicked.
- **`validation.js`**: Contains client-side JavaScript for validating login input fields and handling form submissions.
- **`style.css`**: Styling for the login page.
- **`user.css`**: Styling for the users list and user details pages.

### 5. **Server**

- **`server.js`**: The main server file. It connects to MongoDB, serves static files, and sets up API endpoints for managing user data.

## API Endpoints

- **GET /api/users?page=1**: Fetch a paginated list of users (10 users per page).
- **GET /api/users/:email**: Fetch detailed information for a user by email.

## Running the Application

1. **Start MongoDB**: Ensure your MongoDB server is running locally or accessible via a cloud instance.
2. **Run the Server**: Execute `npm start` to launch the server.
3. **Open Admin Panel**: Navigate to `http://localhost:3000/index.html` in your browser to access the admin login page.

---
