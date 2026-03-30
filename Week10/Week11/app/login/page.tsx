'use client';

import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); // prevent page reload

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // needed for cookies if using JWT in cookies
    });

    const data = await res.json();
    setMsg(data.message || data.error);

    if (res.ok) {
      // Redirect based on authenticated role from backend.
      window.location.href = data.role === 'admin' ? '/admin' : '/dashboard';
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}