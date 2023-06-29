const Database = require('better-sqlite3');

let database = './db/evo.db';
const table = 'reviews';

exports.getAll = function () {
  const db = new Database(database);

  const sql = `SELECT * FROM ${table} ORDER BY date DESC`;

  try {
    const results = db.prepare(sql).all();
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getPostcodes = function () {
  const db = new Database(database);

  const sql = `SELECT DISTINCT postcode FROM locations ORDER BY postcode`;

  try {
    const results = db.prepare(sql).all();
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};

exports.add = function (date, postcode, title, text) {
  const db = new Database(database);

  const sql = `INSERT INTO ${table} (date, postcode, title, text) VALUES (?, ?, ?, ?)`;

  try {
    const results = db.prepare(sql).run(date, postcode, title, text);
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};

exports.delete = function (id) {
  const db = new Database(database);

  const sql = `DELETE FROM ${table} WHERE id = ?`;

  try {
    const results = db.prepare(sql).run(id);
    db.close();
    return results;
  } catch (error) {
    throw error;
  }
};
