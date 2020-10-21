const sql = require('sql-template-strings');
const {v4: uuidv4} = require('uuid');
const db = require('./db');

module.exports = {
  // Method create() will get all information about the job without id and create a new job with those data
  async create(para) {
    try {
      const {rows} = await db.query(sql`
      INSERT INTO jobs
        VALUES (${uuidv4()}, ${para.title}, ${para.salaryrange}, ${
        para.description
      }, current_date, ${para.tags}, ${para.company}, ${para.logoURL})
        RETURNING id, title, tags;
      `);
      return rows[0];
    } catch (error) {
      if (error.constraint === 'users_email_key') {
        return null;
      }

      throw error;
    }
  },
  // Method find() will get id of the job and send back the job if it exist
  async find(id) {
    const {rows} = await db.query(sql`
    SELECT * FROM jobs WHERE id=${id} LIMIT 1;
    `);
    return rows[0];
  }
};
