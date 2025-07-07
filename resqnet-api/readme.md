ResQNet – API
ResQNet is a comprehensive disaster response and relief coordination platform powered by the MERN stack. This backend service is developed using Node.js and Express.js, ensuring secure, scalable, and real-time communication for managing emergencies.

Key Features
Instant Alert Broadcasting: Real-time alerts to notify users about emergencies and disasters.
Shelter & Hospital Directory: Efficient tracking and management of available shelters and medical facilities.
Volunteer Coordination: Assign, manage, and track volunteer tasks and participation.
Emergency Planning Tools: Users can create and update personalized emergency response plans.
Supply Donations: Supports in-kind donations (medical, food, etc.) and monitors distribution.
Community Threads: Forums where users can share updates and communicate during crises.
Real-Time Map Integration: Visual display of incidents and resource locations.
Stripe-Powered Donations: Secure monetary donations using Stripe payment gateway.


Tech Stack:
Backend: Node.js, Express.js
Database: MongoDB
Real-Time Communication: Socket.IO (WebSocket)
Authentication & Authorization: JWT
Payment Integration: Stripe


Folder Structure (API)
bash
Copy
Edit
/controllers      -> Handles core logic for each route
/models           -> Mongoose schemas
/routes           -> Express route definitions
/utils            -> Utility functions (auth, error handling, etc.)
/config           -> Environment configs and DB connection


API Modules:
User & Auth Management
Alerts & Incidents
Rescue Responders
Volunteer Tasks
Donation Handling
Shelter/Hospital Registration
Emergency Planning
Community Forum (Posts & Replies)


How to Run
npm install
npm start
node server.js

Ensure MongoDB and your .env file are properly configured.