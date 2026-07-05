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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/token`, {
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
    <div>
      <div className="border border-gray-500 bg-gray-50 p-4">
        <h2 className="text-lg font-gray-700 px-4 py-2">Manpower App - Login</h2>
        {error && <p className="text-red-500 bg-red-50">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="flex border border-gray-700 bg-gray-100 mx-4 my-3 px-4 py-3">
          <div>
            <label className="text-xs text-gray-500 px-3 py-2">Email</label>
            <input className="border border-gray-500 text-xs focus:border-blue-400" type='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div>
            <label className="text-xs text-gray-500 px-3 py-2">Password</label>
            <input  className="border border-gray-500 text-xs focus:border-blue-400" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
          </div>
          </div>
          <button className="bg-blue-500 text-white border border-gray-100 rounded-xl hover:bg-blue-700" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
