Basketball Referee Management System
A comprehensive mobile application for managing basketball referee assignments, availability, and game coordination. This system streamlines the traditionally manual process of referee scheduling, transforming spreadsheet-based workflows into an efficient digital platform.
📱 Overview
The Basketball Referee Management System addresses critical inefficiencies in sports officiating coordination by providing a centralized platform where administrators can efficiently oversee referee resources while referees can easily indicate their availability and receive assignments.
Key Features

Role-Based Access Control: Separate interfaces for administrators and referees with appropriate permissions
Availability Management: Interactive calendar interface for referees to set their scheduling preferences
Game Management: Comprehensive game creation, assignment, and tracking system
Automated Notifications: Real-time communication between administrators and referees
Assignment Workflow: Streamlined process from game creation to referee acceptance
Conflict Detection: Automatic prevention of scheduling conflicts and double-bookings

🏗️ Architecture
The system follows a modern client-server architecture with:

Frontend: React Native mobile application with MVVM pattern
Backend: Node.js Express server with RESTful API
Database: SQLite with Sequelize ORM
Authentication: JWT-based security with bcrypt password hashing

Technology Stack
Frontend

React Native
React Navigation (Stack & Tab navigators)
Context API for state management
Axios for API communication
React Native Calendars
Expo Linear Gradient & Vector Icons
AsyncStorage for token persistence

Backend

Node.js & Express.js
Sequelize ORM
SQLite database
JWT (jsonwebtoken)
bcrypt for password hashing
CORS middleware

🎯 User Roles
Administrator

Create and manage games
Assign referees to games
View comprehensive availability overview
Manage user accounts
Send notifications to referees

Referee

Set availability through calendar interface
View assigned games
Accept or decline assignments
Receive notifications
Manage personal profile

📊 Database Schema
The system uses five core models:

User: Stores referee and admin information with role differentiation
Game: Basketball game details including teams, venue, and scheduling
Assignment: Links referees to games with position and status tracking
Availability: Tracks referee availability (AVAILABLE, UNAVAILABLE, TENTATIVE)
Notification: System messaging with type categorization and read status

🔒 Security Features

JWT-based authentication with 24-hour token expiration
bcrypt password hashing (10 salt rounds)
Role-based access control middleware
Input validation through Sequelize models
CORS configuration for secure API access

🧪 Testing
The system has undergone comprehensive testing including:

Authentication flow validation
Role-based access control verification
Game management functionality testing
Availability system validation
Cross-role communication testing
Performance and scalability assessment
Security validation

📖 Academic Background
This project was developed as a diploma thesis at Babeș-Bolyai University, Faculty of Mathematics and Computer Science. The complete academic documentation is available in Licenta_IE_Utiu_Dalia.pdf.

Research Contributions
Practical application of MVVM pattern in mobile development
Implementation of scheduling optimization principles
Role-based mobile application architecture
Real-world sports management system design

🛣️ Future Enhancements

Automated scheduling optimization algorithms
Performance analytics and referee development tracking
Integration with broader league management systems
Advanced offline functionality with data synchronization
Machine learning for demand forecasting
Cross-sport adaptation capabilities
