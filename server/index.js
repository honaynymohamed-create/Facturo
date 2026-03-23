const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

// Connexion MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gestion_factures'
});

// TEST
app.get('/', (req, res) => {
  res.send('API marche');
});


// ================= CLIENTS =================

// GET clients
app.get('/api/clients', (req, res) => {
  db.query('SELECT * FROM clients', (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});

// ADD client
app.post('/api/clients', (req, res) => {
  const { name, email, phone } = req.body;

  db.query(
    'INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)',
    [name, email, phone],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Client ajouté");
    }
  );
});

// DELETE client
app.delete('/api/clients/:id', (req, res) => {
  db.query('DELETE FROM clients WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.send(err);
    res.send("Client supprimé");
  });
});


// ================= FACTURES =================

// GET factures + client name + lines summary simple
app.get('/api/factures', (req, res) => {
  const clientId = req.query.client_id;
  let sql = `
    SELECT f.*, c.name as client_name,
      (SELECT COUNT(*) FROM invoice_lines WHERE invoice_id = f.id) as line_count
    FROM factures f
    JOIN clients c ON f.client_id = c.id
  `;
  let params = [];
  if (clientId) {
    sql += ' WHERE f.client_id = ?';
    params = [clientId];
  }
  sql += ' ORDER BY f.date DESC';

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.send(result);
  });
});

// ADD facture SIMPLE LINES VAT TTC
app.post('/api/factures', (req, res) => {
  const { client_id, date, type, lines } = req.body; // lines = [{desc, qty, price, vat}]

  const docType = type || 'classique';
  const prefix = docType === 'devis' ? 'DEV-' : 'FAC-';
  const numero = prefix + Date.now();

  let status = "en-attente";
  const today = new Date();
  const factureDate = new Date(date);
  if (factureDate < today && docType !== 'devis') status = "en-retard";

  // Simple TTC calc
  let totalHT = 0;
  let totalTTC = 0;
  lines.forEach(line => {
    const ht = line.qty * line.price;
    const vat = ht * (line.vat / 100);
    totalHT += ht;
    totalTTC += ht + vat;
  });

  const sql = `
    INSERT INTO factures (client_id, montant, date, numero, total, total_ttc, status, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [client_id, totalTTC, date, numero, totalHT, totalTTC, status, docType], (err, result) => {
    if (err) return res.status(500).send(err.message);

    const invoiceId = result.insertId;

    // Insert lines simple
    lines.forEach(line => {
      db.query(
        'INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, vat_rate) VALUES (?, ?, ?, ?, ?)',
        [invoiceId, line.desc, line.qty, line.price, line.vat],
        (err2) => { if (err2) console.log('Line err:', err2.message); }
      );
    });

    res.send({ message: "Facture ajoutée", id: invoiceId, totalTTC });
  });
});

// PAY facture
app.put('/api/factures/:id/pay', (req, res) => {
  const { id } = req.params;
  
  db.query(
    'UPDATE factures SET status = ? WHERE id = ?',
    ['payee', id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Facture payée" });
    }
  );
});

// CONVERT devis vers facture
app.put('/api/factures/:id/convert', (req, res) => {
  const { id } = req.params;
  
  db.query(
    'UPDATE factures SET type = ?, status = ? WHERE id = ?',
    ['classique', 'en-attente', id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ message: "Devis converti en facture" });
    }
  );
});


// ================= PROFIL =================

app.put('/api/profile', (req, res) => {
  const { user_id, client_id, name, email, phone, address } = req.body;
  
  // Mettre à jour la table users
  db.query('UPDATE users SET email = ? WHERE id = ?', [email, user_id], (err) => {
    if (err) return res.status(500).send(err);
    
    if (client_id) {
      // Mettre à jour la table clients
      db.query(
        'UPDATE clients SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
        [name, email, phone, address, client_id],
        (err2) => {
          if (err2) return res.status(500).send(err2);
          res.send({ message: "Profil mis à jour" });
        }
      );
    } else {
      res.send({ message: "Profil (Admin) mis à jour" });
    }
  });
});

// ================= LOGIN & REGISTER =================

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, result) => {

      if (err) return res.send(err);

      if (result.length > 0) {
        const user = result[0];
        if (user.role === 'client') {
           db.query('SELECT * FROM clients WHERE user_id = ?', [user.id], (err2, clientRes) => {
               if (!err2 && clientRes.length > 0) {
                   user.client_id = clientRes[0].id;
                   user.name = clientRes[0].name;
                   user.phone = clientRes[0].phone;
                   user.address = clientRes[0].address;
               }
               res.send({ message: "OK", user });
           });
        } else {
           res.send({ message: "OK", user });
        }
      } else {
        res.status(401).send({ message: "Invalid credentials" });
      }
    }
  );
});

// ADD client (Register avec création user)
app.post('/api/register', (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Insert user
  db.query(
    'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
    [email, password, 'client'],
    (err, userResult) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
           return res.status(400).send({ message: "Email déjà utilisé" });
        }
        return res.status(500).send(err);
      }
      
      const userId = userResult.insertId;

      // Insert client
      db.query(
        'INSERT INTO clients (name, email, phone, address, user_id) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone, address, userId],
        (err, clientResult) => {
          if (err) return res.status(500).send(err);
          const user = {
            id: userId,
            email,
            role: 'client',
            client_id: clientResult.insertId,
            name,
            phone,
            address
          };
          res.send({ message: "Compte créé", user });
        }
      );
    }
  );
});


// ================= SERVER =================

app.listen(5000, () => {
  console.log('Serveur lancé sur http://localhost:5000');
});
