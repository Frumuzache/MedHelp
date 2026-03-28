// Sample route
// Replace this with your actual routes

const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'Example route' });
});

module.exports = router;
