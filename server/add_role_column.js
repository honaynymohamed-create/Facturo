const mysql = require('mysql2');
const db = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'gestion_factures'});

db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'client'", (err, res) => {
  if (err) {
    console.log('Error adding role column:', err.message);
  } else {
    console.log('Role column added or already exists.');
    console.log('Result:', res);
  }
  db.end();
});

