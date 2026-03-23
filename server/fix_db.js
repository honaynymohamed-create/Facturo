const mysql = require('mysql2');
const db = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'gestion_factures'});
db.query('ALTER TABLE clients ADD COLUMN address VARCHAR(255)', () => console.log('address ok'));
db.query('ALTER TABLE clients ADD COLUMN user_id INT', () => console.log('user_id ok'));
db.query("ALTER TABLE factures ADD COLUMN type VARCHAR(50) DEFAULT 'classique'", () => console.log('type ok'));
db.query("DELETE FROM users WHERE role = 'client' AND id NOT IN (SELECT user_id FROM clients WHERE user_id IS NOT NULL)", () => console.log('cleanup ok'));
setTimeout(() => { db.end(); console.log("DB Fixed"); }, 1000);
