const mysql2 = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const db = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const checkConnection = () => {
  db.getConnection((err, connection) => {
    if (err) {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
      }
    }
    if (connection) {
      connection.release();
    }
    return;
  });
};

checkConnection();

exports.query = async (sql, values) => {
  return new Promise((resolve, reject) => {
    const callback = (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    };
    // execute will internally call prepare and query
    db.execute(sql, values, callback);
  }).catch((err) => {
    const mysqlErrorList = Object.keys(HttpStatusCodes);
    // convert mysql errors which in the mysqlErrorList list to http status code
    err.status = mysqlErrorList.includes(err.code)
      ? HttpStatusCodes[err.code]
      : err.status;

    throw err;
  });
};

// like ENUM
const HttpStatusCodes = Object.freeze({
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
  ER_DUP_ENTRY: 409,
});
