## Project Overview
Pet Guardian is a gamified wellness web application developed for ST0503 Backend Web Development CA2.

The application allows users to complete wellness challenges to earn points, redeem badges, and unlock virtual pet companions. It integrates a frontend website with a Node.js + MySQL backend developed in CA1, focusing on secure authentication, gamification, and user interaction.

## Features Implemented

### Public (Before Login)
- View homepage and navigation
- Browse available challenges, badges, and pets (read-only)

### Authenticated Users (After Login)
- Register and login using JWT authentication
- View user profile with badges, challenges and pets
- Complete wellness challenges
- Earn points for completed challenges
- Redeem badges
- Purchase pets using accumulated points
- View current points balance in navbar

## Frontend–Backend Integration

The frontend communicates with the backend server using the Fetch API.

- HTTP requests are sent to RESTful endpoints (GET, POST, PUT, DELETE)
- JWT tokens are stored in localStorage after login
- Tokens are attached to requests using the Authorization header:
  Authorization: Bearer <token>
- JSON responses are processed and reflected in the UI dynamically

Protected actions such as completing challenges, redeeming badges, or buying pets require a valid JWT token.

## Authentication & Security

- JWT (JSON Web Token) is used for authentication
- Tokens are issued upon successful login
- Protected routes require a valid token
- Passwords are hashed using bcrypt on the backend
- Frontend handles expired or invalid tokens by prompting users to log in again

## UI & UX Design

- Built using HTML, CSS, and Bootstrap 5
- Page-specific styling is applied to avoid affecting other pages
- A pet-themed design is used to enhance user engagement
- Interactive UI elements include hover effects, modals, and dynamic navbar updates

## Error Handling

- User-friendly alerts and modals are shown for authentication errors
- Invalid actions (e.g. insufficient points) are handled gracefully
- Backend error responses are captured and displayed on the frontend

## Languages, technologies and packages used

- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- Fetch API
- Node.js (Backend)
- Nodemon
- Dotenv
- Express.js
- MySQL2
- JWT
- bcrypt

## How to Run the Project

1. Clone the repository
2. Run `npm install` to install all the packages required
3. Ensure the backend server (CA2) is running with `npm run dev`
4. Open http://localhost:3000/index.html to access the homepage
5. Register a new account or login to access full features

## Notes for Interview

- The project follows a clear separation of concerns
- Frontend focuses on UI, interaction, and API consumption
- Backend handles business logic, authentication, and database access
- Code is modular and organised for maintainability



