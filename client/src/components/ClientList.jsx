import axios from 'axios';

function ClientList({ clients, refreshClients }) {

  const deleteClient = (id) => {
    axios.delete(`http://localhost:5000/api/clients/${id}`)
      .then(() => {
        alert("Client supprimé !");
        refreshClients();
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h1>📋 Liste des clients</h1>
      

      {clients.map(client => (
        <div key={client.id}>
          <b>{client.name}</b> - {client.email}
          <button onClick={() => deleteClient(client.id)}>Supprimer</button>
        </div>
      ))}
    </div>
  );
}

export default ClientList;
