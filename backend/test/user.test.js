const request = require('supertest');
const app = require('../server'); // Assure-toi que ton `server.js` exporte `app`
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Tests CRUD utilisateurs', () => {
  let userId;

  test('Ajoute un utilisateur', async () => {
    const response = await request(app).post('/api/users').send({
      email: 'test@example.com',
      password: 'MonSuperMotDePasse123'
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Utilisateur ajouté');
    userId = response.body.user._id; // Récupération de l'ID pour les tests suivants
  });

  test('Récupère tous les utilisateurs', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Modifie un utilisateur', async () => {
    const response = await request(app).put(`/api/users/${userId}`).send({
      email: 'modif@example.com',
      password: 'NouveauMotDePasse123'
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Utilisateur modifié');
  });

  test('Supprime un utilisateur', async () => {
    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Utilisateur supprimé');
  });
});
