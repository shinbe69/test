// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../server');
const {v4: uuidv4} = require('uuid');
const db = require('../src/persistence/db');
const sql = require('sql-template-strings');
const expect = chai.expect;

chai.use(chaiHttp);
chai.should();
describe('/CREATE, UPDATE, DELETE AND GET JOB', () => {
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
    it('Return status 201 and the new job when create success! ', (done) => {
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
          id = response.body.job.id;
          done();
        });
    });
  });

  describe('/PUT Update the job', () => {
    it('Return status 200 and object job when id found', (done) => {
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
          expect(response.body.job.id).to.deep.equal(jobParameters.id);
          expect(response.body.job.title).to.deep.equal(jobParameters.title);
          expect(response.body.job.salary_range).to.deep.equal(
            jobParameters.salaryRange
          );
          expect(response.body.job.description).to.deep.equal(
            jobParameters.description
          );
          expect(response.body.job.tags).to.deep.equal(jobParameters.tags);
          expect(response.body.job.company).to.deep.equal(
            jobParameters.company
          );
          expect(response.body.job.logo_url).to.deep.equal(
            jobParameters.logoURL
          );
          done();
        });
    });

    it('Return status 400 when id is not found!', (done) => {
      const jobParameters = {
        id: uuidv4(),
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
          response.should.have.status(400);
          response.body.should.have
            .property('message')
            .eql('There is no job with this id!');
          done();
        });
    });
  });
  after(async function () {
    const {rows} = await db.query(sql`
        DELETE FROM jobs WHERE id = ${id}
          RETURNING *;
        `);
    if (rows) {
      console.log('All test data was deleted!');
    }
  });
});
