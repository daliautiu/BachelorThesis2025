// routes/assignment.routes.js
const express = require('express');
const assignmentController = require('../controllers/assignment.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Get assignments for the logged-in user
router.get('/', verifyToken, assignmentController.getUserAssignments);

// Create an assignment - Admin only
router.post('/', [verifyToken, isAdmin], assignmentController.createAssignment);

// Accept an assignment
router.put('/:id/accept', verifyToken, assignmentController.acceptAssignment);

// Decline an assignment
router.put('/:id/decline', verifyToken, assignmentController.declineAssignment);

// Delete an assignment - Admin only
router.delete('/:id', [verifyToken, isAdmin], assignmentController.deleteAssignment);

module.exports = router;