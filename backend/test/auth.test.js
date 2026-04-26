const chai = require('chai');
const supertest = require('supertest');
const app = require('../server');

const { expect } = chai;
const request = supertest(app);

// unique email for each test run
const testEmail = `test${Date.now()}@example.com`;
let authToken;

describe('Auth Routes', () => {

  describe('POST /api/auth/register', () => {
    it('should register a new user and return 201', async () => {
      const res = await request
        .post('/api/auth/register')
        .send({ name: 'Test User', email: testEmail, password: '123456' });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('token');
    });

    it('should return 400 if name is missing', async () => {
      const res = await request
        .post('/api/auth/register')
        .send({ email: testEmail, password: '123456' });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });

    it('should return 409 if email already registered', async () => {
      const res = await request
        .post('/api/auth/register')
        .send({ name: 'Test User', email: testEmail, password: '123456' });

      expect(res.status).to.equal(409);
      expect(res.body.success).to.equal(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login and return token', async () => {
      const res = await request
        .post('/api/auth/login')
        .send({ email: testEmail, password: '123456' });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('token');
      authToken = res.body.data.token; // save token for later tests
    });

    it('should return 401 for wrong password', async () => {
      const res = await request
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'wrongpassword' });

      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
    });

    it('should return 400 if email is missing', async () => {
      const res = await request
        .post('/api/auth/login')
        .send({ password: '123456' });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request.get('/api/auth/me');
      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
    });

    it('should return user profile with valid token', async () => {
      const res = await request
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('email');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request.post('/api/auth/logout');
      expect(res.status).to.equal(401);
    });

    it('should logout successfully with valid token', async () => {
      const res = await request
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });
  });

});