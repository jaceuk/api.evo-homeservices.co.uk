const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db;
const table = 'reviews';

async function dbConnect() {
  return open({
    filename: './db/evo.db',
    driver: sqlite3.Database,
  });
}

exports.getAll = async function () {
  const db = await dbConnect();

  const sql = `SELECT * FROM ${table}`;

  try {
    const result = await db.all(sql);
    db.close();
    return result;
  } catch (error) {
    throw error;
  }
};
