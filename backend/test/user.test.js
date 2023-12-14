const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');
const User = require("../models/user.js");

chai.use(chaiHttp);
const expect = chai.expect;

describe('User API Tests', () => {
    it('Signin user - Failure', async () => {
        const email = "john_doe@example.com";
        const password = "secret123";

        try {
            const user = await User.findOne({ email, password });

            const res = await chai.request(app)
                .post('/users/verify/')
                .send({ email, password });
            
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');

        } catch (error) {
            console.error('Error during test:', error);
            throw error;
        }
    });

    it('Signin user - Success', async () => {
        const email = 'sagarkataru12@gmail.com';
        const password = 'Sagar0923@';

        try {
            const user = await User.findOne({ email, password });
            const res = await chai.request(app)
                .post('/users/verify/')
                .send({ email, password });

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
        } catch (error) {
            console.error('Error during test:', error);
            throw error;
            
        }
    });
});
