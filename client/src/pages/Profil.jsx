import { useState } from 'react';
import axios from 'axios';

function Profil({ user, setAuthUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.put('http://127.0.0.1:5000/api/profile', {
      user_id: user.id,
      client_id: user.client_id,
      ...formData
    })
    .then(() => {
      alert("Profil mis à jour !");
      setAuthUser({ ...user, ...formData });
      setIsEditing(false);
    })
    .catch(() => alert("Erreur lors de la mise à jour"));
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '40px auto' }}>
      <h1>👤 Mon Profil</h1>
      <p style={{ color: 'var(--gray)', marginBottom: '20px' }}>Gérez vos informations personnelles</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Nom Complet</label>
          <input 
            className="input" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Email</label>
          <input 
            className="input" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Téléphone</label>
          <input 
            className="input" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Adresse</label>
          <input 
            className="input" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>
      </div>

      <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
        {isEditing ? (
          <>
            <button className="button" style={{ background: '#10b981', flex: 1 }} onClick={handleSave}>Enregistrer</button>
            <button className="button" style={{ background: 'var(--gray)', flex: 1 }} onClick={() => setIsEditing(false)}>Annuler</button>
          </>
        ) : (
          <button className="button" style={{ width: '100%' }} onClick={() => setIsEditing(true)}>Modifier mes informations</button>
        )}
      </div>

      {/* Logout button below edit buttons */}
      <button 
        className="button" 
        style={{ 
          width: '100%', 
          marginTop: '15px', 
          background: '#ef4444',
          color: 'white'
        }} 
        onClick={() => setAuthUser(null)}
      >
        Déconnexion
      </button>
    </div>
  );
}

export default Profil;
