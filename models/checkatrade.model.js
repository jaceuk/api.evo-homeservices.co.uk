const db = require('../db/db-connection');
const table = 'checkatrade';

exports.getAll = async function () {
  const sql = `SELECT * FROM ${table}`;

  try {
    const results = await db.query(sql);
    return results;
  } catch (error) {
    throw error;
  }
};
