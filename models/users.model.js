const db = require('../db/db-connection');
const table = 'users';

exports.getUser = async function (email) {
  const sql = `SELECT * FROM ${table} WHERE email = ?`;

  try {
    const result = await db.query(sql, [email]);
    return result[0];
  } catch (error) {
    throw error;
  }
};
