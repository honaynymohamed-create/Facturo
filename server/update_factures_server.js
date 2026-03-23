const mysql = require('mysql2');
const db = mysql.createConnection({host: 'localhost', user: 'root', password: '', database: 'gestion_factures'});

// Simple test: create sample invoice with lines
const sampleLines = [
  {description: 'Consultation service', quantity: 1, unit_price: 500, vat_rate: 20},
  {description: 'Support technique', quantity: 2, unit_price: 100, vat_rate: 20}
];

let invoiceId;
let totalTTC = 0;

// 1. Calc total TTC simple
sampleLines.forEach(line => {
  const ht = line.quantity * line.unit_price;
  const vat = ht * (line.vat_rate / 100);
  totalTTC += ht + vat;
});

const date = new Date().toISOString().split('T')[0];
const numero = 'FAC-' + Date.now();

// 2. Insert facture simple TTC
db.query(
  'INSERT INTO factures (client_id, date, numero, total, total_ttc, status, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
  [23, date, numero, totalTTC, totalTTC, 'en-attente', 'classique'],
  (err, res) => {
    if (err) {
      console.error('Error create facture:', err);
      db.end();
      return;
    }
    invoiceId = res.insertId;
    console.log('✅ Facture created ID:', invoiceId, 'Total TTC:', totalTTC);

    // 3. Insert lines
    sampleLines.forEach(line => {
      db.query(
        'INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, vat_rate) VALUES (?, ?, ?, ?, ?)',
        [invoiceId, line.description, line.quantity, line.unit_price, line.vat_rate],
        (err2) => {
          if (err2) console.error('Line error:', err2);
          else console.log('✅ Line added:', line.description);
        }
      );
    });
    setTimeout(() => db.end(), 1000);
  }
);

