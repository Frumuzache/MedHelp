const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller')
const AuthService = require('../services/auth.service');

router.post('/login', UserController.loginUser);
router.post('/register', UserController.registerUser);
router.get('/profile', UserController.getUserProfile);
router.get('/sessions', AuthService.validateJWT, UserController.getSessions);

module.exports = router;