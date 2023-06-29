const Database = require('better-sqlite3');

let database = './db/evo.db';
const table = 'reviews';

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

exports.addPostcodes = function () {
  const db = new Database(database);

  const sql = `SELECT * FROM ${table}`;

  try {
    const results = db.prepare(sql).all();

    results.forEach((result) => {
      const sql = `UPDATE ${table} SET postcode = ?
      INNER JOIN towns ON ${tableName}.location = towns.id
      WHERE id = ?`;

      db.prepare(sql).all('towns.postcode', result.id);
    });

    db.close();
  } catch (error) {
    throw error;
  }
};
