const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const sql = require('sql-template-strings');

const db = require('../persistence/db');

module.exports.up = async function (next) {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const client = await db.connect();
  await client.query(sql`
  INSERT INTO users (id, email, password)
  VALUES (${uuidv4()}, 'admin@fabatechnology.com', ${hashedPassword})
  RETURNING id, email;
  `);

  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(sql`
  DELETE FROM users WHERE email = 'admin@fabatechnology';
  `);
  next();
};
