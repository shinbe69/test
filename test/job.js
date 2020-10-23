// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../server');

chai.use(chaiHttp);
chai.should();
describe('/POST Post a new job', () => {
  let accessToken = '';
  let id = '';
  before(function (done) {
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
        accessToken = response.body.token;
        done();
      });
  });
  describe('/POST Post a new job', () => {
    it('POST /api/jobs', (done) => {
      const jobParameters = {
        title: 'Dev187',
        salaryRange: '$450-$700',
        description: 'Work with customers and dev team',
        tags: ['English', 'Communicate', 'Technical knowledge'],
        company: 'Faba',
        logoURL:
          'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
      };
      chai
        .request(app())
        .post('/api/jobs')
        .set('Authorization', 'Bearer ' + accessToken)
        .send(jobParameters)
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.have
            .property('message')
            .eql('Create the job successful!');
          response.body.job.should.have.property('id');
          response.body.job.should.have
            .property('title')
            .eql(jobParameters.title);
          response.body.job.should.have
            .property('tags')
            .eql(jobParameters.tags);
          id = response.body.job.id;
          done();
        });
    });
  });

  describe('/PUT Update the job has just been create', () => {
    it('PUT /api/jobs', (done) => {
      const jobParameters = {
        id,
        title: 'ChangeTitleToThisLine',
        salaryRange: '$450-$700',
        description: 'Work with customers and dev team',
        tags: ['English', 'Communicate', 'Technical knowledge'],
        company: 'Faba',
        logoURL:
          'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
      };
      chai
        .request(app())
        .put('/api/jobs')
        .set('Authorization', 'Bearer ' + accessToken)
        .send(jobParameters)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have
            .property('message')
            .eql('Update the job successful!');
          done();
        });
    });
  });
});
