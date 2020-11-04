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
    const newTitle =
      jobParameters.title.trim() === ''
        ? job.title
        : jobParameters.title.trim();
    const newSalaryRange =
      jobParameters.salaryRange.trim() === ''
        ? job.salary_range
        : jobParameters.salaryRange.trim();
    const newDescription =
      jobParameters.description.trim() === ''
        ? job.description
        : jobParameters.description.trim();
    const newTags =
      jobParameters.tags.length === 0 ? job.tags : jobParameters.tags;
    const newCompany =
      jobParameters.company.trim() === ''
        ? job.company
        : jobParameters.company.trim();
    const newLogoURL =
      jobParameters.logoURL.trim() === ''
        ? job.logo_url
        : jobParameters.logoURL.trim();

    const {rows} = await db.query(sql`
        UPDATE jobs SET title = ${newTitle}, salary_range = ${newSalaryRange}, description = ${newDescription}, tags = ${newTags}, company = ${newCompany}, logo_url = ${newLogoURL} WHERE id = ${job.id}
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
  async get() {
    const {rows} = await db.query(sql`
        SELECT * FROM jobs
        `);
    return rows;
  },
  async paginationGet(offset, limit) {
    const checkedOffset = offset || 0;
    const checkedLimit = limit || 10;
    const {rows} = await db.query(sql`
        SELECT * FROM jobs OFFSET ${checkedOffset} LIMIT ${checkedLimit}
        `);
    return {jobs: rows, checkedOffset};
  }
};
