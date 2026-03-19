function FactureList({ factures, clients }) {

  const getStatus = (date) => {
    const today = new Date();
    const d = new Date(date);

    if (d < today) return "late";
    return "pending";
  };

  return (
    <div>

      <h2>📄 Liste des factures</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {factures.map(f => {
            const client = clients.find(c => c.id === f.client_id);
            const status = getStatus(f.date);

            return (
              <tr key={f.id}>
                <td>{client ? client.name : "Inconnu"}</td>
                <td>{f.montant} €</td>
                <td>{new Date(f.date).toLocaleDateString()}</td>

                <td>
                  <span className={`badge ${status}`}>
                    {status === "late" ? "En retard" : "En attente"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}

export default FactureList;
