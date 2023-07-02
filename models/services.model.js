const Database = require('better-sqlite3');

const database = './db/evo.db';
const table = 'services';

exports.getByWebsite = function (id) {
  const db = new Database(database);

  const sql = `SELECT * FROM ${table} WHERE website = ?`;

  try {
    const results = db.prepare(sql).all(id);
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};
