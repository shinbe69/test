const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');
const db = require('./db');

module.exports = {
  async create(jobParameters) {
    const {rows} = await db.query(sql`
      INSERT INTO jobs
        VALUES (${uuidv4()}, ${jobParameters.title}, ${
      jobParameters.salaryRange
    }, ${jobParameters.description}, current_date, ${jobParameters.tags}, ${
      jobParameters.company
    }, ${jobParameters.logoURL})
        RETURNING *;
      `);
    return rows[0];
  },
  async find(id) {
    const {rows} = await db.query(sql`
    SELECT * FROM jobs WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },
  async update(job, jobParameters) {
    const newTitle = jobParameters.title
      ? jobParameters.title.trim()
      : job.title;
    const newSalaryRange = jobParameters.salaryRange
      ? jobParameters.salaryRange.trim()
      : job.salary_range;
    const newDescription = jobParameters.description
      ? jobParameters.description.trim()
      : job.description;
    const newCompany = jobParameters.company
      ? jobParameters.company.trim()
      : job.company;
    const newLogoURL = jobParameters.logoURL
      ? jobParameters.logoURL.trim()
      : job.logo_url;

    const {rows} = await db.query(sql`
        UPDATE jobs SET title = ${newTitle}, salary_range = ${newSalaryRange}, description = ${newDescription}, tags = ${jobParameters.tags}, company = ${newCompany}, logo_url = ${newLogoURL} WHERE id = ${job.id}
          RETURNING *;
        `);
    return rows[0];
  },
  async delete(id) {
    const {rows} = await db.query(sql`
        DELETE FROM jobs WHERE id = ${id}
        RETURNING id;
        `);
    return rows[0];
  },
  async get(id, offset, limit) {
    if (id) {
      const {rows} = await db.query(sql`
        SELECT * FROM jobs WHERE id = ${id}
        `);
      return {jobs: rows};
    }

    const checkedOffset = offset || 0;
    const checkedLimit = limit || 10;
    const {rows} = await db.query(sql`
        SELECT * FROM jobs OFFSET ${checkedOffset} LIMIT ${checkedLimit}
        `);
    return {jobs: rows, checkedOffset};
  }
};
