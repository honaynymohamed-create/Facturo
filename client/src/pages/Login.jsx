import { useState } from 'react';
import axios from 'axios';

function Login({ setAuthUser }) {
  const [isRegister, setIsRegister] = useState(false);

  // States pour connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // States supplémentaires pour inscription
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleAuth = () => {
    if (isRegister) {
      axios.post('http://127.0.0.1:5000/api/register', {
        name, email, password, phone, address
      })
        .then(res => {
          // Rediriger/Connecter automatiquement après l'inscription
          if (res.data.user) {
            setAuthUser(res.data.user);
          } else {
            alert("Inscription réussie, connectez-vous maintenant !");
            setIsRegister(false);
          }
        })
        .catch(err => {
          alert("Erreur lors de l'inscription : " + (err.response?.data?.message || err.message));
        });
    } else {
      axios.post('http://127.0.0.1:5000/api/login', {
        email, password
      })
        .then(res => {
          setAuthUser(res.data.user);
        })
        .catch(() => {
          alert("Email ou mot de passe incorrect");
        });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo" style={{ textAlign: 'center', marginBottom: '20px' }}>Facturo</div>

        {isRegister && (
          <>
            <input className="input" placeholder="Nom Complet" onChange={e => setName(e.target.value)} />
            <input className="input" placeholder="Téléphone" onChange={e => setPhone(e.target.value)} />
            <input className="input" placeholder="Adresse" onChange={e => setAddress(e.target.value)} />
            <input className="input" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input className="input" type="password" placeholder="Mot de passe" onChange={e => setPassword(e.target.value)} />
          </>
        )}
        <button className="button" style={{ width: '100%', marginTop: '10px' }} onClick={handleAuth}>
          {isRegister ? "S'inscrire" : "Se connecter"}
        </button>

        <p style={{ textAlign: 'center', cursor: 'pointer', color: 'var(--blue-dark)', fontSize: '13px', marginTop: '15px' }} onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Déjà un compte ? Se connecter" : "Créer un compte client"}
        </p>
      </div>
    </div>
  );
}

export default Login;
