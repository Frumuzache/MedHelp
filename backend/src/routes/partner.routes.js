const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PartnerController = require('../controllers/partner.controller');

function requirePartner(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role !== 'partner') {
      return res.status(403).json({ error: 'Partner access required' });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

router.post('/register', PartnerController.register);
router.post('/login', PartnerController.login);
router.get('/sessions', requirePartner, PartnerController.getSessions);
router.post('/sessions/:id/summarize', requirePartner, PartnerController.summarizeSession);

module.exports = router;