# Task-Manager-Server
Welcome to Task Manager Backend, a powerful backend solution for managing tasks with ease. This project is built using MongoDB, Express, and Node.js, providing a robust foundation for task management. Whether you are developing a personal project or an enterprise-level application, Task Manager Backend has you covered. This repository contains the backend codebase for a powerful task manager application built using Node.js, MongoDB, and Express. The backend system serves as the robust foundation for managing tasks, users, deadlines, and associated functionalities seamlessly.

## Key Specifications
### Technologies Used:
- MongoDB: A NoSQL database used for storing task-related data.

- Express: A web application framework for Node.js, facilitating the creation of robust APIs.

- Node.js: A runtime environment for executing JavaScript code server-side.

### Purpose:
- MongoDB: Used to store and retrieve task data efficiently.

- Express: Provides a set of features for building web and mobile applications, including robust routing.

- Node.js: Powers the server-side logic, handling requests and responses.

### Endpoints
- api/register POST - Register a new user

- api/login POST - Log in to the system

- api/verify-token GET - Verify the token at the frontend

- api/all-tasks GET - Retrieve all tasks

- api/task/:taskId GET - Retrieve a task by ID

- api/task POST - Add a new task

- api/task/:taskId PUT/PATCH - Update an existing task

- api/task/:taskId DELETE - Delete a task

- api/task-by-status GET - Filter tasks by status

- api/task-by-create-date GET - Filter tasks by creation date

- api/task-by-deadline-date GET - Filter tasks by deadline date

- api/task-by-title GET - Search for tasks by title

- api/analytics GET - Get task-related information for graph plotting and visualizations

### Packages Used
- cors: Enables Cross-Origin Resource Sharing.

- body-parser: Parses incoming request bodies in a middleware before your handlers.

- jsonWebToken: Implements JSON Web Tokens for user authentication.

- bcrypt: Provides password hashing and verification.

- node-cron: Schedules cron jobs for periodic tasks.

- nodemon: Monitors for any changes in your source code and automatically restarts the server.

- mongoose: An ODM library for MongoDB and Node.js, simplifying interaction with the database.

- dotenv: Loads environment variables from a .env file.

### Architecture
The project follows a Model, Routes, and Controllers architecture:

- Model: Defines the data structure and schema for tasks in MongoDB.

- Routes: Handles incoming HTTP requests and routes them to the appropriate controller.

- Controllers: Contains the logic for handling different API endpoints.

## Getting Started
### Clone the repository:

+ git clone https://github.com/your-username/Task-Manager-Backend.git
  
### Install dependencies:

+ cd Task-Manager-Backend
+ npm install
  
### Set up your environment variables:

- Create a .env file in the root of your project and add the necessary environment variables. You can use the provided .env.example as a template.

### Run the development server:

+ npm run dev
 
### Folder Structure

Task-Manager-Backend/
  
|-- controllers/

|-- models/

|-- routes/

|-- .env

|-- .env.example

|-- .gitignore

|-- app.js

|-- package.json

|-- README.md

### Contributing
- Feel free to contribute to the project by opening issues or submitting pull requests. Your feedback and contributions are highly appreciated!
