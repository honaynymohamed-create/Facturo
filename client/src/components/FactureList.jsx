import { useState } from 'react';
import axios from 'axios';

function FactureList({ user, factures, refreshFactures }) {
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'payee': return '✅ Payée';
      case 'en-attente': return '⏳ En attente';
      case 'en-retard': return '❌ En retard';
      default: return status;
    }
  };

  const openModal = (facture) => {
    setSelectedFacture(facture);
    setIsPaying(false);
  };

  const closeModal = () => {
    setSelectedFacture(null);
    setIsPaying(false);
  };

  const handlePayment = (method) => {
    axios.put(`http://127.0.0.1:5000/api/factures/${selectedFacture.id}/pay`)
      .then(res => {
        alert(`Paiement de ${selectedFacture.montant} DH par ${method} validé !`);
        refreshFactures();
        closeModal();
      })
      .catch(err => {
        alert("Erreur lors du paiement");
      });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConvert = () => {
    axios.put(`http://127.0.0.1:5000/api/factures/${selectedFacture.id}/convert`)
      .then(res => {
        alert("Devis converti en facture avec succès !");
        refreshFactures();
        closeModal();
      })
      .catch(err => {
        alert("Erreur lors de la conversion");
      });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="card">
      <h2>Liste des {user?.role === 'client' ? 'documents' : 'factures / devis'}</h2>

      <table>
        <thead>
          <tr>
            <th>Numéro</th>
            {isAdmin && <th>Client</th>}
            <th>Date</th>
            <th>Type</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {factures.map((f) => (
            <tr key={f.id}>
              <td>{f.numero}</td>
              {isAdmin && <td>{f.name}</td>}
              <td>{new Date(f.date).toLocaleDateString()}</td>
              <td>
                <span className={`badge`} style={{background: f.type === 'devis' ? '#fef3c7' : '#e0e7ff', color: f.type === 'devis' ? '#d97706' : '#4338ca'}}>
                  {f.type === 'devis' ? 'Devis' : 'Facture'}
                </span>
              </td>
              <td>{f.montant} DH</td>
              <td>
                <span className={`badge ${f.status}`}>
                  {getStatusDisplay(f.status)}
                </span>
              </td>
              <td>
                <button className="button view-btn" onClick={() => openModal(f)}>Voir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Détails Facture */}
      {selectedFacture && (
        <div className="modal-overlay">
          <div className="modal-content card printable-area">
            <h2 style={{borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>
              {selectedFacture.type === 'devis' ? 'Devis' : 'Facture'} : {selectedFacture.numero}
            </h2>
            <div className="modal-body" style={{marginTop: '15px'}}>
               <p><strong>Date d'émission:</strong> {new Date(selectedFacture.date).toLocaleDateString()}</p>
               <p><strong>Destinataire:</strong> {selectedFacture.name || 'Client Inconnu'}</p>
               <p><strong>Prestation / Type:</strong> Services standard</p>
               
               <div style={{background: '#f8fafc', padding: '15px', marginTop: '20px', borderRadius: '8px'}}>
                 <p style={{fontSize: '18px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between'}}>
                   <span>Total à payer:</span> 
                   <span>{selectedFacture.montant} DH</span>
                 </p>
               </div>

               <p className="no-print" style={{marginTop: '20px'}}>
                 <strong>Statut actuel:</strong>{' '}
                 <span className={`badge ${selectedFacture.status}`}>
                   {getStatusDisplay(selectedFacture.status)}
                 </span>
               </p>
            </div>

            {/* Zone de paiement / actions */}
            {isPaying ? (
               <div className="payment-options no-print" style={{marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '10px'}}>
                  <h3 style={{fontSize: '15px', marginBottom: '10px'}}>Choisissez une méthode de paiement :</h3>
                  <div style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                     <button className="button" style={{background: '#3b82f6'}} onClick={() => handlePayment('Carte Bancaire')}>💳 Carte Bancaire</button>
                     <button className="button" style={{background: '#6366f1'}} onClick={() => handlePayment('Virement Bancaire')}>🏦 Virement Bancaire</button>
                     <button className="button" style={{background: 'var(--gray)', marginTop: '10px'}} onClick={() => setIsPaying(false)}>Annuler</button>
                  </div>
               </div>
            ) : (
                <div className="modal-actions no-print" style={{ marginTop: '25px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    
                    {selectedFacture.type === 'devis' ? (
                        <button className="button pay-btn" style={{ background: '#f59e0b' }} onClick={handleConvert}>🔄 Convertir en Facture</button>
                    ) : (
                        (selectedFacture.status === 'en-attente' || selectedFacture.status === 'en-retard') && (
                            <button className="button pay-btn" style={{ background: '#10b981' }} onClick={() => setIsPaying(true)}>Payer</button>
                        )
                    )}

                    <button className="button" style={{ background: '#0ea5e9' }} onClick={handlePrint}>📥 Télécharger / Imprimer</button>
                    <button className="button" style={{ background: 'var(--gray)' }} onClick={closeModal}>Fermer</button>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FactureList;
