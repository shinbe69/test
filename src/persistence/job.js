const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');
const db = require('./db');

module.exports = {
  async create(jobParameters) {
    try {
      const {rows} = await db.query(sql`
      INSERT INTO jobs
        VALUES (${uuidv4()}, ${jobParameters.title}, ${
        jobParameters.salaryRange
      }, ${jobParameters.description}, current_date, ${jobParameters.tags}, ${
        jobParameters.company
      }, ${jobParameters.logoURL})
        RETURNING id, title, salary_range, description, create_at, tags, company, logo_url ;
      `);
      return rows[0];
    } catch (error) {
      if (error.constraint === 'users_email_key') {
        return null;
      }

      throw error;
    }
  },
  async find(id) {
    const {rows} = await db.query(sql`
    SELECT * FROM jobs WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  },

  async update(isJobExist, jobParameters) {
    try {
      let newTitle = jobParameters.title;
      let newSalaryRange = jobParameters.salaryRange;
      let newDescription = jobParameters.description;
      let newTags = jobParameters.tags;
      let newCompany = jobParameters.company;
      let newLogoURL = jobParameters.logoURL;
      if (newTitle.trim() === '') {
        newTitle = isJobExist.title;
      }

      if (newSalaryRange.trim() === '') {
        newSalaryRange = isJobExist.salaryRange;
      }

      if (newDescription.trim() === '') {
        newDescription = isJobExist.description;
      }

      if (newTags.length === 0) {
        newTags = isJobExist.tags;
      }

      if (newCompany.trim() === '') {
        newCompany = isJobExist.company;
      }

      if (newLogoURL.trim() === '') {
        newLogoURL = isJobExist.logoURL;
      }

      const {rows} = await db.query(sql`
        UPDATE jobs SET title = ${newTitle}, salary_range = ${newSalaryRange}, description = ${newDescription}, tags = ${newTags}, company = ${newCompany}, logo_url = ${newLogoURL} WHERE id = ${isJobExist.id}
          RETURNING id, title, salary_range, description, create_at, tags, company, logo_url ;
        `);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};
