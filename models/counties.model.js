const db = require('../db/db-connection');
const table = 'counties';

exports.getAll = async function () {
  const sql = `SELECT * FROM ${table}`;

  try {
    const results = await db.query(sql);
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getById = async function (id) {
  const sql = `SELECT * FROM ${table} WHERE id = ?`;

  try {
    const result = await db.query(sql, [id]);
    return result[0];
  } catch (error) {
    throw error;
  }
};
