const chai = require('chai');
const supertest = require('supertest');
const app = require('../server');

const { expect } = chai;
const request = supertest(app);

const testEmail = `notes${Date.now()}@example.com`;
let authToken;
let noteId;

describe('Notes Routes', () => {

  before(async () => {
    await request
      .post('/api/auth/register')
      .send({ name: 'Notes Tester', email: testEmail, password: '123456' });

    const login = await request
      .post('/api/auth/login')
      .send({ email: testEmail, password: '123456' });

    authToken = login.body.data.token;
  });

  describe('POST /api/notes', () => {
    it('should create a note and return 201', async () => {
      const res = await request
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Note', content: 'Test content' });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('_id');
      noteId = res.body.data._id;
    });

    it('should return 400 if title is missing', async () => {
      const res = await request
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test content' });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.equal(false);
    });

    it('should return 401 if no token', async () => {
      const res = await request
        .post('/api/notes')
        .send({ title: 'Test Note', content: 'Test content' });

      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/notes', () => {
    it('should return all notes for user', async () => {
      const res = await request
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.be.an('array');
    });

    it('should return 401 if no token', async () => {
      const res = await request.get('/api/notes');
      expect(res.status).to.equal(401);
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return single note', async () => {
      const res = await request
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data).to.have.property('title');
    });

    it('should return 404 for invalid note id', async () => {
      const res = await request
        .get('/api/notes/000000000000000000000000')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(404);
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update note and return 200', async () => {
      const res = await request
        .put(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title', content: 'Updated content' });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data.title).to.equal('Updated Title');
    });

    it('should return 404 for invalid note id', async () => {
      const res = await request
        .put('/api/notes/000000000000000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title', content: 'Updated content' });

      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete note and return 200', async () => {
      const res = await request
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });

    it('should return 404 for already deleted note', async () => {
      const res = await request
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).to.equal(404);
    });
  });

});
