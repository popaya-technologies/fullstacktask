const mysql = require('mysql2');
const path = require('path');


require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MYSQL DATABASE CONNECTION FAILED:', err.message);
    console.log('Current Resolved Environment Configs:');
    console.log({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
  } else {
    console.log('✅ DATABASE STATUS: Connected successfully to MySQL instance!');
    connection.release();
  }
});

const promisePool = pool.promise();
module.exports = promisePool;