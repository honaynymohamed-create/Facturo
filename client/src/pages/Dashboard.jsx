function Dashboard({ clients, factures }) {

  const total = factures.reduce((acc, f) => acc + Number(f.montant), 0);

  const late = factures.filter(f => new Date(f.date) < new Date()).length;

  return (
    <div>

      <h1>📊 Dashboard</h1>

      <div style={{ display: "flex", gap: "20px" }}>

        <div className="card">
          <h2>Total Clients</h2>
          <h1>{clients.length}</h1>
        </div>

        <div className="card">
          <h2>Total Factures</h2>
          <h1>{factures.length}</h1>
        </div>

        <div className="card">
          <h2>Revenus</h2>
          <h1>{total} €</h1>
        </div>

        <div className="card">
          <h2>En retard</h2>
          <h1>{late}</h1>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
