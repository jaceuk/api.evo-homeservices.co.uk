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

exports.getTemplateByServiceAndLocation = async function (
  serviceId,
  locationId
) {
  const sql = `SELECT template FROM templates where service = ? AND location = ?`;

  try {
    const result = await db.query(sql, [serviceId, locationId]);
    return result[0];
  } catch (error) {
    throw error;
  }
};
