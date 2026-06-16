const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET_KEY = 'test-secret';

jest.mock('../services/database.service', () => ({
  goToCollection: jest.fn(),
  connectToMongoDB: jest.fn(),
}));

const DatabaseService = require('../services/database.service');
const partnerRoutes = require('../routes/partner.routes');

const app = express();
app.use(express.json());
app.use('/partners', partnerRoutes);

const mockCollection = {
  findOne: jest.fn(),
  insertOne: jest.fn(),
  find: jest.fn(() => ({ sort: jest.fn(() => ({ toArray: jest.fn().mockResolvedValue([]) })) })),
};

beforeEach(() => {
  jest.clearAllMocks();
  DatabaseService.goToCollection.mockResolvedValue(mockCollection);
});

// --- Registration ---
describe('POST /partners/register', () => {
  it('returns 400 when required fields are missing', async () => {
    const res = await request(app).post('/partners/register').send({ email: 'doc@test.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 for an invalid email', async () => {
    const res = await request(app).post('/partners/register').send({
      email: 'not-an-email',
      firstName: 'Dr',
      lastName: 'Smith',
      password: 'password123',
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when password is too short', async () => {
    const res = await request(app).post('/partners/register').send({
      email: 'doc@test.com',
      firstName: 'Dr',
      lastName: 'Smith',
      password: 'short',
    });
    expect(res.status).toBe(400);
  });

  it('returns 409 when email is already registered', async () => {
    mockCollection.findOne.mockResolvedValue({ email: 'doc@test.com' });
    const res = await request(app).post('/partners/register').send({
      email: 'doc@test.com',
      firstName: 'Dr',
      lastName: 'Smith',
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });

  it('returns 201 for valid registration', async () => {
    mockCollection.findOne.mockResolvedValue(null);
    mockCollection.insertOne.mockResolvedValue({ insertedId: 'abc123' });
    const res = await request(app).post('/partners/register').send({
      email: 'new@test.com',
      firstName: 'Dr',
      lastName: 'Smith',
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Partner registered!');
  });
});

// --- Login ---
describe('POST /partners/login', () => {
  it('returns 401 when partner does not exist', async () => {
    mockCollection.findOne.mockResolvedValue(null);
    const res = await request(app).post('/partners/login').send({
      email: 'nobody@test.com',
      password: 'password123',
    });
    expect(res.status).toBe(401);
  });

  it('returns 400 for missing credentials', async () => {
    const res = await request(app).post('/partners/login').send({ email: 'doc@test.com' });
    expect(res.status).toBe(400);
  });
});

// --- Auth middleware ---
describe('GET /partners/sessions (requires partner JWT)', () => {
  it('returns 401 when no token is provided', async () => {
    const res = await request(app).get('/partners/sessions');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No token provided');
  });

  it('returns 403 when token belongs to a patient (wrong role)', async () => {
    const token = jwt.sign({ email: 'p@test.com', role: 'patient' }, 'test-secret');
    const res = await request(app)
      .get('/partners/sessions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Partner access required');
  });

  it('returns 403 for a tampered / invalid token', async () => {
    const res = await request(app)
      .get('/partners/sessions')
      .set('Authorization', 'Bearer this.is.fake');
    expect(res.status).toBe(403);
  });

  it('returns 200 with a valid partner token', async () => {
    const token = jwt.sign({ email: 'doc@test.com', role: 'partner' }, 'test-secret');
    const res = await request(app)
      .get('/partners/sessions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.sessions).toEqual([]);
  });
});
