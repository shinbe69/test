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
  const jobTestData = [];
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
    for (let i = 0; i < 12; i++) {
      const jobParameters = {
        title: i,
        salaryRange: '$450-$700' + i,
        description: 'Work with customers and dev team' + i,
        tags: ['English', 'Communicate', 'Technical knowledge', i],
        company: 'Faba' + i,
        logoURL:
          'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80' +
          i
      };
      jobTestData.push(jobParameters);
      id.push(uuidv4());
      db.query(sql`
        INSERT INTO jobs
        VALUES (${id[i]}, ${jobParameters.title}, ${jobParameters.salaryRange}, ${jobParameters.description}, current_date, ${jobParameters.tags}, ${jobParameters.company}, ${jobParameters.logoURL})
        `);
    }
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
          expect(response.body.job.title).to.deep.equal(jobParameters.title);
          expect(response.body.job.salary_range).to.deep.equal(
            jobParameters.salaryRange
          );
          expect(response.body.job.description).to.deep.equal(
            jobParameters.description
          );
          expect(response.body.job.tags.length).to.deep.equal(
            jobParameters.tags.length
          );
          jobParameters.tags.forEach(function (value, index, _) {
            expect(response.body.job.tags[index]).to.deep.equal(
              jobParameters.tags[index]
            );
          });
          expect(response.body.job.company).to.deep.equal(
            jobParameters.company
          );
          expect(response.body.job.logo_url).to.deep.equal(
            jobParameters.logoURL
          );
          id.push(response.body.job.id);
          done();
        });
    });
    it('return status 400 and error message when create a job without providing completely parameters! ', (done) => {
      const jobParameters = {
        logoURL:
          'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
      };
      chai
        .request(app())
        .post('/api/jobs')
        .set('Authorization', 'Bearer ' + accessToken)
        .send(jobParameters)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.have
            .property('message')
            .eql('All information must be provided!');
          done();
        });
    });
  });

  describe('/PUT Update the job', () => {
    it('return status 200 and the latest job information when update successfully!', (done) => {
      const jobParameters = {
        id: id[0],
        title: 'newTitle',
        salaryRange: 'newSalaryRange',
        description: 'newDescription',
        tags: ['newTag'],
        company: 'newCompany',
        logoURL: 'newLogoURL'
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
    it('return status 400 and the error message when ID of the job was not provided!', (done) => {
      const jobParameters = {
        title: 'newTitle',
        salaryRange: 'newSalaryRange',
        description: 'newDescription',
        tags: ['newTag'],
        company: 'newCompany',
        logoURL: 'newLogoURL'
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
            .eql('ID must be provided!');
          done();
        });
    });
    it('return status 400 and the error message when nothing was changed!', (done) => {
      const jobParameters = {
        title: 'newTitle',
        salaryRange: 'newSalaryRange',
        description: 'newDescription',
        tags: ['newTag'],
        company: 'newCompany',
        logoURL: 'newLogoURL'
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
            .eql('ID must be provided!');
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
          expect(response.body.job.title).to.deep.equal(jobTestData[0].title);
          expect(response.body.job.salary_range).to.deep.equal(
            jobTestData[0].salaryRange
          );
          expect(response.body.job.description).to.deep.equal(
            jobTestData[0].description
          );
          expect(response.body.job.tags.length).to.deep.equal(
            jobTestData[0].tags.length
          );
          jobTestData[0].tags.forEach(function (value, index, _) {
            expect(response.body.job.tags[index]).to.deep.equal(
              jobTestData[0].tags[index]
            );
          });
          expect(response.body.job.company).to.deep.equal(
            jobTestData[0].company
          );
          expect(response.body.job.logo_url).to.deep.equal(
            jobTestData[0].logoURL
          );
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
            .eql(
              'Get list of jobs paginated successful, the list is below! There is / are ' +
                response.body.result.jobs.length +
                ' in total!'
            );
          for (const [i, jobTestDatum] of jobTestData.entries()) {
            expect(response.result.body.result.jobs[i]).to.be.a.jsonObj();
            expect(response.result.body.job.title).to.deep.equal(
              jobTestDatum.title
            );
            expect(response.result.body.job.salary_range).to.deep.equal(
              jobTestDatum.salaryRange
            );
            expect(response.result.body.job.description).to.deep.equal(
              jobTestDatum.description
            );
            expect(response.result.body.job.tags.length).to.deep.equal(
              jobTestDatum.tags.length
            );
            jobTestData[i].tags.forEach(function (value, index, _) {
              expect(response.result.body.job.tags[index]).to.deep.equal(
                jobTestDatum.tags[index]
              );
            });
            expect(response.result.body.job.company).to.deep.equal(
              jobTestDatum.company
            );
            expect(response.result.body.job.logo_url).to.deep.equal(
              jobTestDatum.logoURL
            );
          }

          done();
        });
    });
    it('return status 200 and a list all of jobs paginated according to offset and limit parameters when get the jobs successful!', (done) => {
      const offset = 1;
      const limit = 5;
      chai
        .request(app())
        .get('/api/jobs?offset=' + offset + '&limit=' + limit)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have
            .property('message')
            .eql(
              'Get list of jobs paginated successful, the list is below! There is / are ' +
                response.body.result.jobs.length +
                ' in total!'
            );
          expect(response.body.result.jobs.length).to.deep.equal(limit);
          expect(
            Number.parseInt(response.body.result.checkedOffset, 10)
          ).to.deep.equal(offset);
          for (let i = 0; i < response.body.result.jobs.length; i++) {
            expect(response.body.result.jobs[i]).to.be.a.jsonObj();
            response.body.result.jobs[i].should.have.property('id');
            response.body.result.jobs[i].should.have.property('title');
            response.body.result.jobs[i].should.have.property('salary_range');
            response.body.result.jobs[i].should.have.property('description');
            response.body.result.jobs[i].should.have.property('create_at');
            response.body.result.jobs[i].should.have.property('tags');
            expect(
              Array.isArray(response.body.result.jobs[i].tags)
            ).to.deep.equal(true);
            response.body.result.jobs[i].should.have.property('company');
            response.body.result.jobs[i].should.have.property('logo_url');
          }

          done();
        });
    });
    it('return status 200 and a list all of jobs paginated according to default offset and limit parameters in case both are not set when get the jobs successful!', (done) => {
      chai
        .request(app())
        .get('/api/jobs')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have
            .property('message')
            .eql(
              'Get list of jobs paginated successful, the list is below! There is / are ' +
                response.body.result.jobs.length +
                ' in total!'
            );
          expect(response.body.result.jobs.length).to.deep.equal(10);
          expect(
            Number.parseInt(response.body.result.checkedOffset, 10)
          ).to.deep.equal(0);
          for (let i = 0; i < response.body.result.jobs.length; i++) {
            expect(response.body.result.jobs[i]).to.be.a.jsonObj();
            response.body.result.jobs[i].should.have.property('id');
            response.body.result.jobs[i].should.have.property('title');
            response.body.result.jobs[i].should.have.property('salary_range');
            response.body.result.jobs[i].should.have.property('description');
            response.body.result.jobs[i].should.have.property('create_at');
            response.body.result.jobs[i].should.have.property('tags');
            expect(
              Array.isArray(response.body.result.jobs[i].tags)
            ).to.deep.equal(true);
            response.body.result.jobs[i].should.have.property('company');
            response.body.result.jobs[i].should.have.property('logo_url');
          }

          done();
        });
    });
    it('return status 200 and a list all of jobs paginated according to default offset parameters in case it is not set when get the jobs successful!', (done) => {
      const limit = 5;
      chai
        .request(app())
        .get('/api/jobs?&limit=' + limit)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have
            .property('message')
            .eql(
              'Get list of jobs paginated successful, the list is below! There is / are ' +
                response.body.result.jobs.length +
                ' in total!'
            );
          expect(response.body.result.jobs.length).to.deep.equal(limit);
          expect(
            Number.parseInt(response.body.result.checkedOffset, 10)
          ).to.deep.equal(0);
          for (let i = 0; i < response.body.result.jobs.length; i++) {
            expect(response.body.result.jobs[i]).to.be.a.jsonObj();
            response.body.result.jobs[i].should.have.property('id');
            response.body.result.jobs[i].should.have.property('title');
            response.body.result.jobs[i].should.have.property('salary_range');
            response.body.result.jobs[i].should.have.property('description');
            response.body.result.jobs[i].should.have.property('create_at');
            response.body.result.jobs[i].should.have.property('tags');
            expect(
              Array.isArray(response.body.result.jobs[i].tags)
            ).to.deep.equal(true);
            response.body.result.jobs[i].should.have.property('company');
            response.body.result.jobs[i].should.have.property('logo_url');
          }

          done();
        });
    });
    it('return status 200 and a list all of jobs paginated according default limit parameters in case it is not set when get the jobs successful!', (done) => {
      const offset = 1;
      chai
        .request(app())
        .get('/api/jobs?offset=' + offset)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have
            .property('message')
            .eql(
              'Get list of jobs paginated successful, the list is below! There is / are ' +
                response.body.result.jobs.length +
                ' in total!'
            );
          expect(response.body.result.jobs.length).to.deep.equal(10);
          expect(
            Number.parseInt(response.body.result.checkedOffset, 10)
          ).to.deep.equal(offset);
          for (let i = 0; i < response.body.result.jobs.length; i++) {
            expect(response.body.result.jobs[i]).to.be.a.jsonObj();
            response.body.result.jobs[i].should.have.property('id');
            response.body.result.jobs[i].should.have.property('title');
            response.body.result.jobs[i].should.have.property('salary_range');
            response.body.result.jobs[i].should.have.property('description');
            response.body.result.jobs[i].should.have.property('create_at');
            response.body.result.jobs[i].should.have.property('tags');
            expect(
              Array.isArray(response.body.result.jobs[i].tags)
            ).to.deep.equal(true);
            response.body.result.jobs[i].should.have.property('company');
            response.body.result.jobs[i].should.have.property('logo_url');
          }

          done();
        });
    });
    it('return status 200 and a job got id user provided when using only id parameters to get the jobs successful!', (done) => {
      chai
        .request(app())
        .get('/api/jobs?id=' + id[1])
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have
            .property('message')
            .eql(
              'Get list of jobs paginated successful, the list is below! There is / are ' +
                1 +
                ' in total!'
            );
          expect(response.body.result.jobs[0]).to.be.a.jsonObj();
          response.body.result.jobs[0].should.have.property('id');
          response.body.result.jobs[0].should.have.property('title');
          response.body.result.jobs[0].should.have.property('salary_range');
          response.body.result.jobs[0].should.have.property('description');
          response.body.result.jobs[0].should.have.property('create_at');
          response.body.result.jobs[0].should.have.property('tags');
          expect(
            Array.isArray(response.body.result.jobs[0].tags)
          ).to.deep.equal(true);
          response.body.result.jobs[0].should.have.property('company');
          response.body.result.jobs[0].should.have.property('logo_url');

          done();
        });
    });
    it('return status 200 and a job got id user provided when user sent id, offset and limit parameters to get the jobs successful!', (done) => {
      const offset = 1;
      const limit = 5;
      chai
        .request(app())
        .get('/api/jobs?id=' + id[1] + '&offset=' + offset + '&limit=' + limit)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.have
            .property('message')
            .eql(
              'Get list of jobs paginated successful, the list is below! There is / are ' +
                1 +
                ' in total!'
            );
          expect(response.body.result.jobs[0]).to.be.a.jsonObj();
          response.body.result.jobs[0].should.have.property('id');
          expect(response.body.result.jobs[0].id).to.deep.equal(id[1]);
          response.body.result.jobs[0].should.have.property('title');
          response.body.result.jobs[0].should.have.property('salary_range');
          response.body.result.jobs[0].should.have.property('description');
          response.body.result.jobs[0].should.have.property('create_at');
          response.body.result.jobs[0].should.have.property('tags');
          expect(
            Array.isArray(response.body.result.jobs[0].tags)
          ).to.deep.equal(true);
          response.body.result.jobs[0].should.have.property('company');
          response.body.result.jobs[0].should.have.property('logo_url');

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
