// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../server');

chai.use(chaiHttp);
chai.should();
// Test Login using POST method
describe('/POST post new job', () => {
  it('POST /api/job', (done) => {
    const authentication = {
      email: 'admin@fabatechnology.com',
      password: 'admin123'
    };
    chai
      .request(app())
      .post('/api/sessions')
      .send(authentication)
      .end((err, response) => {
        response.should.have.status(200);
        const accessToken = response.body.token;
        // After getting token finished, we set Authorization field in Header of request to create a new job
        const job = {
          title: 'Dev1',
          salaryrange: '$450-$700',
          description: 'Work with customers and dev team',
          tags: ['English', 'Communicate', 'Technical knowledge'],
          company: 'Faba',
          logoURL: 'https://unsplash.com/photos/g2E2NQ5SWSU'
        };
        chai
          .request(app())
          .post('/api/job')
          .set('Authorization', 'Bearer ' + accessToken)
          .send(job)
          .end((err, response) => {
            response.should.have.status(201);
            // Response.body.should.be.a('json');
            response.body.should.have
              .property('message')
              .eql('Create the job successful!');
            response.body.job.should.have.property('id');
            response.body.job.should.have.property('title').eql(job.title);
            response.body.job.should.have.property('tags').eql(job.tags);
          });
        done();
      });
  });
});
