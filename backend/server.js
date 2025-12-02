// // const express = require('express');
// // const cors = require('cors');
// // const dotenv = require('dotenv');
// // const path = require('path');

// // // Load environment variables
// // dotenv.config();

// // // Initialize Express app
// // const app = express();
// // const PORT = process.env.PORT || 8080;

// // console.log('Starting server setup...');

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // // Request logging middleware
// // app.use((req, res, next) => {
// //   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
// //   next();
// // });

// // console.log('Middleware configured...');

// // // Test route
// // app.get('/api/test', (req, res) => {
// //   console.log('Test route called');
// //   res.json({ success: true, message: 'Backend connection successful!' });
// // });

// // console.log('Routes configured...');

// // // Start server first, then worry about database
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
  
// //   // Now try to initialize database
// //   try {
// //     // Import database configuration
// //     const db = require('./config/db.config');
    
// //     console.log('Database modules loaded, testing connection...');
    
// //     // Test database connection
// //     db.testConnection()
// //       .then(connected => {
// //         if (connected) {
// //           console.log('Database connection established.');
          
// //           // Routes - only add these after we know the database works
// //           try {
// //             app.use('/api/auth', require('./routes/auth.routes'));
// //             app.use('/api/users', require('./routes/user.routes'));
// //             console.log('Routes loaded successfully');
// //           } catch (routeError) {
// //             console.error('Error loading routes:', routeError);
// //           }
          
// //           // Sync database
// //           db.sequelize.sync({ alter: true })
// //             .then(() => console.log('Database synced'))
// //             .catch(syncError => console.error('Database sync error:', syncError));
// //         }
// //       })
// //       .catch(err => {
// //         console.error('Database connection failed:', err);
// //       });
// //   } catch (dbInitError) {
// //     console.error('Error initializing database modules:', dbInitError);
// //   }
// // });

// // console.log('Server initialization complete, waiting for connections...');
// // Update the routes section in server.js

// // Routes - only add these after we know the database works
// try {
//     console.log('Loading routes...');
    
//     // Auth routes
//     app.use('/api/auth', require('./routes/auth.routes'));
    
//     // User routes
//     app.use('/api/users', require('./routes/user.routes'));
    
//     // Game routes
//     app.use('/api/games', require('./routes/game.routes'));
    
//     // Assignment routes
//     app.use('/api/assignments', require('./routes/assignment.routes'));
    
//     // Availability routes
//     app.use('/api/availability', require('./routes/availability.routes'));
    
//     // Notification routes
//     app.use('/api/notifications', require('./routes/notification.routes'));
    
//     console.log('All routes loaded successfully');
//   } catch (routeError) {
//     console.error('Error loading routes:', routeError);
//   }
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

console.log('Starting server setup...');

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

console.log('Middleware configured...');

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route called');
  res.json({ success: true, message: 'Backend connection successful!' });
});

console.log('Routes configured...');

// Start server first, then worry about database
app.listen(PORT, '0.0.0.0', () => {  // <-- UPDATED: Listen on all interfaces
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at http://172.25.64.1:${PORT}`);  // Your IP address
  
  // Now try to initialize database
  try {
    // Import database configuration
    const db = require('./config/db.config');
    
    console.log('Database modules loaded, testing connection...');
    
    // Test database connection
    db.testConnection()
      .then(connected => {
        if (connected) {
          console.log('Database connection established.');
          
          // Routes - only add these after we know the database works
          try {
            console.log('Loading routes...');
            
            // Auth routes
            app.use('/api/auth', require('./routes/auth.routes'));
            
            // User routes
            app.use('/api/users', require('./routes/user.routes'));
            
            // Game routes
            app.use('/api/games', require('./routes/game.routes'));
            
            // Assignment routes
            app.use('/api/assignments', require('./routes/assignment.routes'));
            
            // Availability routes
            app.use('/api/availability', require('./routes/availability.routes'));
            
            // Notification routes
            app.use('/api/notifications', require('./routes/notification.routes'));
            
            console.log('All routes loaded successfully');
          } catch (routeError) {
            console.error('Error loading routes:', routeError);
          }
          
          // Sync database
          db.sequelize.sync({ alter: true })
            .then(() => console.log('Database synced'))
            .catch(syncError => console.error('Database sync error:', syncError));
        }
      })
      .catch(err => {
        console.error('Database connection failed:', err);
      });
  } catch (dbInitError) {
    console.error('Error initializing database modules:', dbInitError);
  }
});

console.log('Server initialization complete, waiting for connections...');