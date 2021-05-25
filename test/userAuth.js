//During the test the env variable is set to test
process.env.NODE_ENV = 'dev';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
//let auth = require('../src/server/routes/v1/auth.js');
let should = chai.should();
chai.use(chaiHttp)

let base_url = 'http://localhost:3000';
describe('/POST user', () => {
    it('it sould post the user info', (done) => {
        const user = {
            firstName: " Husne Ara",
            lastName: "Asma",
            email: "asma@gmail.com",
            password: '123',
            phone: '8979488948',
            roleId: 1,
        };
        chai.request(base_url)
            .post('/v1/auth/user/signup')
            .send(user)
            .end((err, res) => {
                if (!err) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('message');
                    res.body.should.have.property('success').eq('1');
                    done();
                } else {
                    console.log('error', err)
                }
            });
    });
});
