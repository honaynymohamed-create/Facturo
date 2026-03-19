import { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

import Clients from './pages/Clients';
import Factures from './pages/Factures';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';


function App() {

  const [clients, setClients] = useState([]);
  const [factures, setFactures] = useState([]);
  const [isAuth, setIsAuth] = useState(false); // 🔐

  const getClients = () => {
    axios.get('http://127.0.0.1:5000/api/clients')
      .then(res => setClients(res.data));
  };

  const getFactures = () => {
    axios.get('http://127.0.0.1:5000/api/factures')
      .then(res => setFactures(res.data));
  };

  useEffect(() => {
    if (isAuth) {
      getClients();
      getFactures();
    }
  }, [isAuth]);

  return (
  <div className="app-container">

    {!isAuth ? (
      <Login setIsAuth={setIsAuth} />
    ) : (
      <>
        {/* NAVBAR */}
        <div className="navbar">
          <div className="logo">Facturo</div>

          <div className="links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/clients">Clients</Link>
            <Link to="/factures">Factures</Link>
          </div>
        </div>

        {/* CONTENT */}
        <div className="main-content">
          <Routes>
            <Route path="/clients" element={
              <Clients clients={clients} refreshClients={getClients} />
            } />

            <Route path="/factures" element={
              <Factures 
                clients={clients} 
                factures={factures} 
                refreshFactures={getFactures} 
              />
            } />
<Route 
  path="/dashboard" 
  element={<Dashboard clients={clients} factures={factures} />} 
/>

            <Route path="*" element={<Navigate to="/clients" />} />
          </Routes>
        </div>
      </>
    )}

  </div>
);


}

export default App;
