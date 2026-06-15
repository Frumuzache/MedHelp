const express = require('express');
const router = express.Router();
const PartnerController = require('../controllers/partner.controller');

router.post('/register', PartnerController.register);
router.post('/login', PartnerController.login);

module.exports = router;