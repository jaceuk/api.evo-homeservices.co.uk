const db = require('../db/db-connection');
const table = 'keywords';

exports.getByWebsite = function (id) {
  const sql = `SELECT keyword FROM ${table} INNER JOIN services ON ${table}.service = services.id
  WHERE services.website = ? OR services.website = ?`;

  try {
    const results = db.query(sql, [id, 'both']);
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getByService = function (id) {
  const sql = `SELECT keyword FROM ${table} WHERE service = ?`;

  try {
    const results = db.query(sql, [id]);
    return results;
  } catch (error) {
    throw error;
  }
};
