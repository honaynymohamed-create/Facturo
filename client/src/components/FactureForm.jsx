import { useState } from 'react';
import axios from 'axios';

function FactureForm({ clients, refreshFactures }) {

  const [form, setForm] = useState({
    client_id: '',
    montant: '',
    date: '',
    type: 'classique'
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
        setForm({ client_id: '', montant: '', date: '', type: 'classique' });
      });
  };

  return (
    <div>

      <h3 style={{marginBottom: '15px'}}>➕ Ajouter un document</h3>

      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px'}}>
        <select 
          className="input"
          name="type"
          value={form.type}
          onChange={handleChange}
          style={{flex: 1}}
        >
          <option value="classique">Facture Classique</option>
          <option value="devis">Devis</option>
        </select>

        <select 
          className="input"
          name="client_id"
          value={form.client_id}
          onChange={handleChange}
          style={{flex: 1}}
        >
          <option value="">Choisir client</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px'}}>
        <input 
          className="input"
          name="montant"
          placeholder="Montant (DH)"
          value={form.montant}
          onChange={handleChange}
          style={{flex: 1}}
        />

        <input 
          className="input"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          style={{flex: 1}}
        />
      </div>

      <button className="button" style={{width: '100%'}} onClick={addFacture}>
        Ajouter le document
      </button>

    </div>
  );
}

export default FactureForm;
