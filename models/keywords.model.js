const Database = require('better-sqlite3');

const database = './db/evo.db';
const table = 'keywords';

exports.getByWebsite = function (id) {
  const db = new Database(database);

  const sql = `SELECT keyword FROM ${table} INNER JOIN services ON ${table}.service = services.id
  WHERE services.website = ? OR services.website = ?`;

  try {
    const results = db.prepare(sql).all(id, 'both');
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getByService = function (id) {
  const db = new Database(database);

  const sql = `SELECT keyword FROM ${table} WHERE service = ?`;

  try {
    const results = db.prepare(sql).all(id);
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};
