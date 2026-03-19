import { useState } from 'react';
import axios from 'axios';

function FactureForm({ clients, refreshFactures }) {

  const [form, setForm] = useState({
    client_id: '',
    montant: '',
    date: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addFacture = () => {
    if (!form.client_id || !form.montant || !form.date) {
      alert("Remplir tous les champs !");
      return;
    }

    axios.post('http://localhost:5000/api/factures', form)
      .then(() => {
        refreshFactures();
        setForm({ client_id: '', montant: '', date: '' });
      });
  };

  return (
    <div>

      <h3>➕ Ajouter facture</h3>

      <select 
        className="input"
        name="client_id"
        value={form.client_id}
        onChange={handleChange}
      >
        <option value="">Choisir client</option>
        {clients.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input 
        className="input"
        name="montant"
        placeholder="Montant"
        value={form.montant}
        onChange={handleChange}
      />

      <input 
        className="input"
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />

      <button className="button" onClick={addFacture}>
        Ajouter
      </button>

    </div>
  );
}

export default FactureForm;
