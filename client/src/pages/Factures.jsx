import FactureForm from '../components/FactureForm';
import FactureList from '../components/FactureList';

function Factures({ clients, factures, refreshFactures }) {

  return (
    <div>

      <h1>🧾 Factures</h1>

      <div className="card">
        <FactureForm 
          clients={clients} 
          refreshFactures={refreshFactures} 
        />
      </div>

      <FactureList 
        factures={factures} 
        clients={clients} 
      />

    </div>
  );
}

export default Factures;
