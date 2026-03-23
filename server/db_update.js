const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_factures'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL via XAMPP');

  const queries = [
    // 1. Create users table if not exists (or update it)
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'client'
    )`,

    // 2. Ensure clients has address and user_id
    // First check if columns exist by trying to add them (ignore if duplicate)
    // Actually, let's just do a generic approach or standard queries.
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS address VARCHAR(255)`,
    `ALTER TABLE clients ADD COLUMN IF NOT EXISTS user_id INT`,
    // If ALTER TABLE ADD COLUMN IF NOT EXISTS doesn't work in old MariaDB, we can catch it.

    // 3. Ensure factures has type
    `ALTER TABLE factures ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'classique'`
  ];

  let completed = 0;

  queries.forEach(q => {
    db.query(q, (error, results) => {
      if (error) {
        // Ignorer l'erreur si la colonne existe déjà (Duplicate column name)
        if (error.code !== 'ER_DUP_FIELDNAME' && error.code !== 'ER_PARSE_ERROR') {
             console.log('Error on query:', q, error.message);
        }
      } else {
         console.log('Success:', q);
      }
      
      completed++;
      if (completed === queries.length) {
         console.log('Database schema update finished.');
         
         // Insert a default admin if none exists
         db.query("INSERT IGNORE INTO users (email, password, role) VALUES ('admin@admin.com', 'admin', 'admin')", () => {
             db.end();
         });
      }
    });
  });
});
