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
app.delete('/api/clients/:id', (req, res) => {
  db.query('DELETE FROM clients WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.send(err);
    res.send("Client supprimé");
  });
});
app.get('/api/factures', (req, res) => {
  db.query(
    `SELECT factures.*, clients.name 
     FROM factures 
     JOIN clients ON factures.client_id = clients.id`,
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});

// ADD facture
app.post('/api/factures', (req, res) => {
  const { client_id, montant, date } = req.body;

  db.query(
    'INSERT INTO factures (client_id, montant, date) VALUES (?, ?, ?)',
    [client_id, montant, date],
    (err, result) => {
      if (err) return res.send(err);
      res.send("Facture ajoutée");
    }
  );
});

// LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN DATA:", email, password); // 👈 AJOUTE

  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, result) => {
      console.log("RESULT:", result); // 👈 AJOUTE

      if (err) return res.send(err);

      if (result.length > 0) {
        res.send({ message: "OK", user: result[0] });
      } else {
        res.status(401).send({ message: "Invalid credentials" });
      }
    }
  );
});


app.listen(5000, () => {
  console.log('Serveur lancé sur http://localhost:5000');
});
