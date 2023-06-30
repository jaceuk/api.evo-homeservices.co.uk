const Database = require('better-sqlite3');

const database = './db/evo.db';
const table = 'users';

exports.getUser = function (email) {
  const db = new Database(database);

  const sql = `SELECT * FROM ${table} WHERE email = ?`;

  try {
    const results = db.prepare(sql).get(email);
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};
