import { useState } from 'react';
import axios from 'axios';

function Clients({ clients, refreshClients }) {

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addClient = () => {
    axios.post('http://127.0.0.1:5000/api/clients', form)
      .then(() => {
        refreshClients();
        setForm({ name: '', email: '', phone: '' });
      });
  };

  const deleteClient = (id) => {
    axios.delete(`http://127.0.0.1:5000/api/clients/${id}`)
      .then(() => refreshClients());
  };

  return (
    <div>

      <h1>👤 Clients</h1>

      {/* FORM */}
      <div className="card">
        <input className="input" name="name" placeholder="Nom" value={form.name} onChange={handleChange} />
        <input className="input" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input className="input" name="phone" placeholder="Téléphone" value={form.phone} onChange={handleChange} />

        <button className="button" onClick={addClient}>
          Ajouter
        </button>
      </div>

      {/* LIST */}
      {clients.map(client => (
        <div className="card" key={client.id}>
          <b>{client.name}</b>
          <p>{client.email}</p>

          <button className="delete-btn" onClick={() => deleteClient(client.id)}>
            Supprimer
          </button>
        </div>
      ))}

    </div>
  );
}

export default Clients;
