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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">OpsManager</h1>
          <p className="text-gray-400 text-sm mt-2">Manpower management, simplified.</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h2 className="text-lg font-medium text-gray-700 mb-6">Sign in to your account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1">Email address</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-gray-500 block mb-1">Password</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Sign in
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          OpsManager v1.0 — Built with FastAPI & React
        </p>

      </div>
    </div>
  );
}

export default Login;