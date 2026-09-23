const express = require('express');
const protect = require('../middleware/auth');
const { acceptInvitation } = require('../controllers/invitationController');

const router = express.Router();

router.post('/accept', protect, acceptInvitation);

module.exports = router;
