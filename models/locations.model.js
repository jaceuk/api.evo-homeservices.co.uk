const db = require('../db/db-connection');
const table = 'locations';

exports.getAll = async function () {
  const sql = `SELECT * FROM ${table}`;

  try {
    const results = await db.query(sql);
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getLocationsInSameCounty = async function (id) {
  const sql = `SELECT * FROM ${table} where county = ? ORDER BY name`;

  try {
    const results = await db.query(sql, [id]);
    return results;
  } catch (error) {
    throw error;
  }
};
