import FactureForm from '../components/FactureForm';
import FactureList from '../components/FactureList';

function Factures({ user, clients, factures, refreshFactures }) {

  return (
    <div>

      <h1>🧾 {user?.role === 'client' ? 'Mes Factures' : 'Factures'}</h1>

      {user?.role === 'admin' && (
        <div className="card">
          <FactureForm 
            clients={clients} 
            refreshFactures={refreshFactures} 
          />
        </div>
      )}

      <FactureList 
        user={user}
        factures={factures} 
        refreshFactures={refreshFactures}
      />

    </div>
  );
}

export default Factures;
