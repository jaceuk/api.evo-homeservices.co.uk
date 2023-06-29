const Database = require('better-sqlite3');

let database = './db/evo.db';
const table = 'reviews';

exports.getAll = function () {
  const db = new Database(database);

  const sql = `SELECT * FROM ${table}`;

  try {
    const result = db.prepare(sql).all();
    db.close();
    return result;
  } catch (error) {
    throw error;
  }
};
