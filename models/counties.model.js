const Database = require('better-sqlite3');

const database = './db/evo.db';
const table = 'counties';

exports.getAll = function () {
  const db = new Database(database);

  const sql = `SELECT * FROM ${table}`;

  try {
    const results = db.prepare(sql).all();
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};
