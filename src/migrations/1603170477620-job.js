'use strict';
const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();
  await client.query(`CREATE TABLE IF NOT EXISTS jobs (
      id uuid PRIMARY KEY,
      title text,
      salary_range text,
      description text,
      create_at timestamp DEFAULT CURRENT_TIMESTAMP,
      tags text[],
      company text,
      logo_url text DEFAULT 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
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
