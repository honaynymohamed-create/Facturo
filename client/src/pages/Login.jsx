import { useState } from 'react';
import axios from 'axios';

function Login({ setIsAuth }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    axios.post('http://127.0.0.1:5000/api/login', {
      email,
      password
    })
    .then(res => {
      alert("Login réussi !");
      setIsAuth(true);
    })
    .catch(() => {
      alert("Email ou mot de passe incorrect");
    });
  };
return (
  <div className="login-container">
    <div className="login-box">
<div className="logo">Facturo</div>
<br />
<br />
<input 
  className="input" 
  placeholder="Email" 
  onChange={e => setEmail(e.target.value)} 
/>     
 <br />

<input 
  className="input" 
  type="password" 
  placeholder="Password" 
  onChange={e => setPassword(e.target.value)} 
/>     
 <br />


<button className="button" onClick={login}>    
      Se connecter
      </button>
    </div>
  </div>
);

}

export default Login;
