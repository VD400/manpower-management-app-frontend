import React from 'react'
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try{
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST', body: formData
      });
      if (!response.ok){
        setError("Invalid email or password");
        return;
      }
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      window.location.href = '/employees';
    }catch (err){
      setError("Something went wrong, try again");
    }
  };
  return(
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <div style={{width: '350px'}}>
        <h2>Manpower App - Login</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
