import { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

import Clients from './pages/Clients';
import Factures from './pages/Factures';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profil from './pages/Profil';
import './App.css';

function App() {

  const [clients, setClients] = useState([]);
  const [factures, setFactures] = useState([]);
  const [user, setUser] = useState(null); // replaces isAuth


  const getClients = () => {
    // Les clients ne devraient pas voir la liste des autres clients
    if (user?.role === 'client') return;

    axios.get('http://127.0.0.1:5000/api/clients')
      .then(res => setClients(res.data))
      .catch(err => console.error(err));
  };

  const getFactures = () => {
    axios.get('http://127.0.0.1:5000/api/factures')
      .then(res => {
        if (user?.role === 'client') {
          // Filtrer les factures du client connecté
          const myFactures = res.data.filter(f => f.client_id === user.client_id);
          setFactures(myFactures);
        } else {
          setFactures(res.data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (user) {
      getClients();
      getFactures();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

return (
  <div className="app-container">

    {!user ? (
      <Login setAuthUser={setUser} />
    ) : (
      <>
        {/* NAVBAR */}
        <div className="navbar">
          <div className="logo">Facturo</div>

          <div className="links">
            {user.role === 'admin' && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/clients">Clients</Link>
                <Link to="/factures">Factures</Link>
              </>
            )}
            {user.role === 'client' && (
              <>
                <Link to="/factures">Mes Factures</Link>
                <Link to="/profil">Mon Profil</Link>
              </>
            )}
            <button className="button" style={{ marginLeft: '20px', padding: '6px 12px', background: '#ef4444' }} onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="main-content">
          <Routes>

            {user.role === 'admin' ? (
              <>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard user={user} clients={clients} factures={factures} />} />
                <Route path="/clients" element={<Clients clients={clients} refreshClients={getClients} />} />
                <Route path="/factures" element={<Factures user={user} clients={clients} factures={factures} refreshFactures={getFactures} />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard user={user} clients={clients} factures={factures} refreshFactures={getFactures} />} />
                <Route path="/factures" element={<Factures user={user} clients={clients} factures={factures} refreshFactures={getFactures} />} />

                {/* Vrai Profil route */}
                <Route path="/profil" element={<Profil user={user} setAuthUser={setUser} />} />

                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}

          </Routes>
        </div>
      </>
    )}

  </div>
);
}

export default App;
