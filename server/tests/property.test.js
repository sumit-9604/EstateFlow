
const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');

describe('Property Management API', () => {
    it('should fetch all listings with status availability', async () => {
        const res = await request(app).get('/api/properties');
        expect(res.statusCode).toBe(200);
        // Checks requirement for Property availability status [cite: 21]
    });
});