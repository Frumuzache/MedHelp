const express = require('express');
const router = express.Router();

const AiController = require('../controllers/ai.controller');

router.post('/chat', AiController.chat);
router.post('/reset', AiController.reset);

module.exports = router;