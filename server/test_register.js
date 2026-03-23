const mysql = require('mysql2');
const db = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'gestion_factures'});

// Simulate exact user input: name='test', email='test@test.com', password='123', phone='addr', address='999'
const name = 'test';
const email = 'test@test.com';
const password = '123';
const phone = 'addr';
const address = '999';

console.log('Testing registration with:', {name, email, password, phone, address});

// Step 1: INSERT users
db.query(
  'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
  [email, password, 'client'],
  (err, userResult) => {
    if (err) {
      console.log('ERROR users INSERT:', err.code, err.message);
      db.end();
      process.exit();
      return;
    }
    const userId = userResult.insertId;
    console.log('users INSERT success, userId:', userId);

    // Step 2: INSERT clients
    db.query(
      'INSERT INTO clients (name, email, phone, address, user_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, address, userId],
      (err2, clientResult) => {
        if (err2) {
          console.log('ERROR clients INSERT:', err2.code, err2.message);
          // Cleanup user if client failed
          db.query('DELETE FROM users WHERE id = ?', [userId]);
        } else {
          console.log('SUCCESS full registration, clientId:', clientResult.insertId);
        }
        db.end();
        process.exit();
      }
    );
  }
);
