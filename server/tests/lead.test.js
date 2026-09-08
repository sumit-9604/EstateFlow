const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Ensure your server exports the app
const User = require('../models/User');

let token;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({}); // Clean users before test
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth & Lead Integration', () => {
    it('should register, login, and create a lead', async () => {
        // 1. Register
        await request(app).post('/api/auth/register').send({
            name: "Test Admin", email: "test@crm.com", password: "password123", role: "Admin"
        });

        // 2. Login
        const loginRes = await request(app).post('/api/auth/login').send({
            email: "test@crm.com", password: "password123"
        });
        token = loginRes.body.token;

        // 3. Create Lead
        const leadRes = await request(app)
            .post('/api/leads')
            .set('x-auth-token', token)
            .send({
                name: "Sumit",
                phone: "9999988888",
                budget: 5000000,
                status: "New"
            });

        expect(leadRes.statusCode).toBe(200);
        expect(leadRes.body.name).toBe("Sumit");
    });
});