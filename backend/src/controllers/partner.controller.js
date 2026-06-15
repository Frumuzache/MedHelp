const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const DatabaseService = require('../services/database.service');

const PARTNERS_COLLECTION = 'Partners';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

async function getCollection() {
  return DatabaseService.goToCollection(PARTNERS_COLLECTION);
}

function signPartnerJWT(partner) {
  const secret = process.env.JWT_SECRET_KEY;
  const payload = {
    email: partner.email,
    _id: partner._id,
    firstName: partner.firstName,
    role: 'partner',
  };
  return jwt.sign(payload, secret, { expiresIn: '15m' });
}

const PartnerController = {
  register: async (req, res) => {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const collection = await getCollection();
      const exists = await collection.findOne({ email: value.email });
      if (exists) {
        return res.status(409).json({ message: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(value.password, 10);
      await collection.insertOne({
        ...value,
        password: hashedPassword,
        role: 'partner',
        createdAt: new Date().toISOString(),
      });

      return res.status(201).json({ message: 'Partner registered!' });
    } catch (err) {
      console.error('Partner register failed:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  login: async (req, res) => {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const collection = await getCollection();
      const partner = await collection.findOne({ email: value.email });
      if (!partner) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const valid = await bcrypt.compare(value.password, partner.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = signPartnerJWT(partner);
      return res.status(200).json({ message: 'Partner logged in!', token });
    } catch (err) {
      console.error('Partner login failed:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = PartnerController;