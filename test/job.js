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
chai.use(require('chai-json'));
chai.should();
describe('/CREATE, UPDATE, DELETE AND GET JOB', () => {
  let accessToken = '';
  const id = [];
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
    const jobParameters = {
      title: 'Test',
      salaryRange: '$450-$700',
      description: 'Work with customers and dev team',
      tags: ['English', 'Communicate', 'Technical knowledge'],
      company: 'Faba',
      logoURL:
        'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
    };
    id.push(uuidv4());
    db.query(sql`
        INSERT INTO jobs
        VALUES (${id[0]}, ${jobParameters.title}, ${jobParameters.salaryRange}, ${jobParameters.description}, current_date, ${jobParameters.tags}, ${jobParameters.company}, ${jobParameters.logoURL})
        `);
  });

  describe('/POST Post a new job', () => {
    it('return status 201 and the new job information when create successful! ', (done) => {
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
          id.push(response.body.job.id);
          done();
        });
    });
  });

  describe('/PUT Update the job', () => {
    it('return status 200 and the latest job information when update successfully!', (done) => {
      const jobParameters = {
        id: id[0],
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

    it('return status 400 when job is not found!', (done) => {
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

  describe('/DELETE Delete the job', () => {
    it('return status 200 when delete the job successful!', (done) => {
      chai
        .request(app())
        .delete('/api/jobs')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({id: id[0]})
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have
            .property('message')
            .eql('Delete the job got the ID: ' + id[0] + ' successful!');
          done();
        });
    });

    it('return status 400 when the job is not found!', (done) => {
      chai
        .request(app())
        .delete('/api/jobs')
        .set('Authorization', 'Bearer ' + accessToken)
        .send({id: uuidv4()})
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have
            .property('message')
            .eql('There is no job with this id!');
          done();
        });
    });
  });

  describe('/GET Get all of jobs', () => {
    it('return status 200 and a list all of jobs in json file when get the jobs successful!', (done) => {
      chai
        .request(app())
        .get('/api/jobs')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have
            .property('message')
            .eql('Get all jobs successful, list of jobs is below!');
          expect(response.body.jobs).to.be.a.jsonObj();
          done();
        });
    });
  });
  after(function () {
    id.forEach(async function (value) {
      const {rows} = await db.query(sql`
        DELETE FROM jobs WHERE id = ${value} 
          RETURNING *;
        `);
      if (!rows) {
        console.log('Delete test data failed!');
        return false;
      }
    });
    console.log('Test data was deleted!');
  });
});
