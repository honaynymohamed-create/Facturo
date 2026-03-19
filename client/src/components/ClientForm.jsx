import { useState } from 'react';
import axios from 'axios';

function ClientForm({ refreshClients }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const addClient = () => {
    axios.post('http://localhost:5000/api/clients', {
      name,
      email,
      phone
    })
    .then(() => {
      alert("Client ajouté !");
      setName('');
      setEmail('');
      setPhone('');
      refreshClients();
    })
    .catch(err => console.log(err));
  };

  return (
    <div>
      <h2>➕ Ajouter un client</h2>

      <input value={name} placeholder="Nom" onChange={e => setName(e.target.value)} />
      <input value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input value={phone} placeholder="Téléphone" onChange={e => setPhone(e.target.value)} />

      <button onClick={addClient}>Ajouter</button>
    </div>
  );
}

export default ClientForm;
