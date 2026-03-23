const mysql = require('mysql2');
const db = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'gestion_factures'});

console.log('Starting simple invoice_lines migration (XAMPP)...');

db.query(`
  CREATE TABLE IF NOT EXISTS invoice_lines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    description VARCHAR(255),
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(10,2),
    vat_rate DECIMAL(5,2) DEFAULT 20,
    FOREIGN KEY (invoice_id) REFERENCES factures(id)
  )
`, (err) => {
  if (err) console.error('Error lines table:', err.message);
  else console.log('✅ invoice_lines table OK');
  
  // Add total_ttc to factures
  db.query("ALTER TABLE factures ADD COLUMN IF NOT EXISTS total_ttc DECIMAL(10,2)", (err2) => {
    if (err2) console.error('Error total_ttc:', err2.message);
    else console.log('✅ total_ttc column OK');
    db.end();
  });
});
