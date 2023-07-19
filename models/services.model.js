const db = require('../db/db-connection');
const table = 'services';

exports.getByWebsite = function (id) {
  const sql = `SELECT * FROM ${table} WHERE website = ? OR website = ?`;

  try {
    const results = db.query(sql, [id, 'both']);
    return results;
  } catch (error) {
    throw error;
  }
};
