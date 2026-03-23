import FactureList from '../components/FactureList';

function Dashboard({ user, clients, factures, refreshFactures }) {

  if (user?.role === 'client') {
    return (
      <div>
        <h1>📊 Tableau de bord Client</h1>
        <p style={{marginBottom: '20px', color: 'var(--gray)'}}>
          Bienvenue sur votre espace, {user?.name || 'Client'}. Voici l'état de vos factures.
        </p>
        <FactureList user={user} factures={factures} refreshFactures={refreshFactures} />
      </div>
    );
  }

  const total = factures.reduce((acc, f) => acc + Number(f.montant), 0);
  const late = factures.filter(f => f.status === 'en-retard').length;

  return (
    <div>

      <h1>📊 Dashboard Administrateur</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>

        <div className="card stat-card">
          <h2>Total Clients</h2>
          <h1 className="stat-value">{clients.length}</h1>
        </div>

        <div className="card stat-card">
          <h2>Total Factures</h2>
          <h1 className="stat-value">{factures.length}</h1>
        </div>

        <div className="card stat-card">
          <h2>Revenus (DH)</h2>
          <h1 className="stat-value">{total}</h1>
        </div>

        <div className="card stat-card">
          <h2>En retard</h2>
          <h1 className="stat-value" style={{color: 'var(--danger-text)'}}>{late}</h1>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
