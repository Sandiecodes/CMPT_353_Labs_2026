'use client';

import { useCallback, useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [msg, setMsg] = useState('');

  // Handle logout
  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout');
      if (res.ok) {
        window.location.href = '/';
      }
    } catch (err: unknown) {
      setMsg(errorMessage(err, 'Error logging out: '));
    }
  }

  function errorMessage(err: unknown, fallback: string) {
    return err instanceof Error ? `${fallback}${err.message}` : `${fallback}Unknown error`;
  }

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/users', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || 'Failed to fetch users');
      else setUsers(data);
    } catch (err: unknown) {
      setMsg(errorMessage(err, 'Error fetching users: '));
    }
  }, []);

  // Add new user
  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setMsg(data.message || data.error);
      setNewUsername('');
      setNewPassword('');
      fetchUsers();
    } catch (err: unknown) {
      setMsg(errorMessage(err, 'Error adding user: '));
    }
  }

  // Delete a user
  async function deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      setMsg(data.message || data.error);
      fetchUsers();
    } catch (err: unknown) {
      setMsg(errorMessage(err, 'Error deleting user: '));
    }
  }

  useEffect(() => {
    setTimeout(() => {
      void fetchUsers();
    }, 0);
  }, [fetchUsers]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {msg && <p style={{ color: 'red' }}>{msg}</p>}

      <h2>Registered Users</h2>
      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '2rem', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '8%' }} />
          <col style={{ width: '40%' }} />
          <col style={{ width: '27%' }} />
          <col style={{ width: '25%' }} />
        </colgroup>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ textAlign: 'left', padding: '10px' }}>ID</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Username</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Role</th>
            <th style={{ textAlign: 'center', padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ padding: '10px' }}>{user.id}</td>
              <td style={{ padding: '10px', wordBreak: 'break-word' }}>{user.username}</td>
              <td style={{ padding: '10px' }}>{user.role}</td>
              <td style={{ textAlign: 'center', padding: '10px' }}>
                <button onClick={() => deleteUser(user.id)} style={{ color: 'white', background: 'red', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New User</h2>
      <form onSubmit={addUser}>
        <input
          type="text"
          placeholder="Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          required
          style={{ marginRight: '1rem', padding: '0.3rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={{ marginRight: '1rem', padding: '0.3rem' }}
        />
        <select value={newRole} onChange={(e) => setNewRole(e.target.value)} style={{ marginRight: '1rem', padding: '0.3rem' }}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={{ padding: '0.3rem 0.7rem' }}>Add User</button>
      </form>
    </div>
  );
}