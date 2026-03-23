const mysql = require('mysql2');
const db = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'gestion_factures'});
db.query(
  'INSERT INTO clients (name, email, phone, address, user_id) VALUES (?, ?, ?, ?, ?)',
  ['test', 'test@test.com', '123', 'addr', 999],
  (err, res) => {
    console.log("ERROR:", err);
    console.log("RESULT:", res);
    process.exit();
  }
);
