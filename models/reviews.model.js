const db = require('../db/db-connection');
const table = 'reviews';

exports.getAll = async function () {
  const sql = `SELECT * FROM ${table} ORDER BY date DESC`;

  try {
    const results = await db.query(sql);
    return results;
  } catch (error) {
    throw error;
  }
};

exports.getPostcodes = async function () {
  const sql = `SELECT DISTINCT postcode FROM locations ORDER BY postcode`;

  try {
    const results = await db.query(sql);
    return results;
  } catch (error) {
    throw error;
  }
};

exports.add = async function (date, postcode, title, text) {
  const sql = `INSERT INTO ${table} (date, postcode, title, text) VALUES (?, ?, ?, ?)`;

  try {
    const result = await db.query(sql, [date, postcode, title, text]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.delete = async function (id) {
  const sql = `DELETE FROM ${table} WHERE id = ?`;

  try {
    const result = await db.query(sql, [id]);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.get = async function (id) {
  const sql = `SELECT * FROM ${table} WHERE id = ?`;

  try {
    const result = await db.query(sql, [id]);
    return result[0];
  } catch (error) {
    throw error;
  }
};

exports.update = async function (date, postcode, title, text, id) {
  const sql = `UPDATE  ${table} SET date = ?, postcode = ?, title = ?, text = ? WHERE id = ?`;

  try {
    const result = await db.query(sql, [date, postcode, title, text, id]);
    return result;
  } catch (error) {
    throw error;
  }
};
