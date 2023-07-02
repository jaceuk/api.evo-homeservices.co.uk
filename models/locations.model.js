const Database = require('better-sqlite3');

const database = './db/evo.db';
const table = 'locations';

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

exports.getLocationsInSameCounty = function (id) {
  const db = new Database(database);

  const sql = `SELECT * FROM ${table} where county = ? ORDER BY name`;

  try {
    const results = db.prepare(sql).all(id);
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};
