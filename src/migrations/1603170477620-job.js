'use strict';
const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`CREATE TABLE IF NOT EXISTS jobs (
      id uuid PRIMARY KEY,
      title text,
      salaryRange text,
      description text,
      createAt timestamp DEFAULT CURRENT_TIMESTAMP,
      tags text[],
      company text,
      logoURL text DEFAULT 'https://unsplash.com/photos/g2E2NQ5SWSU'
);`);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
  DROP TABLE jobs;
  `);

  await client.release(true);
  next();
};
