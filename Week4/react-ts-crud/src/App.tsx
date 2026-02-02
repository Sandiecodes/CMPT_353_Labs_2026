import { useEffect, useState } from "react";
import type { User } from "./types";
import "./App.css";

const API_URL = "http://localhost:8080"; // Your Express API

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Track which user is being edited
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingEmail, setEditingEmail] = useState("");

  // Fetch users
  const loadUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data: User[] = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Add user
  const addUser = async () => {
    if (!name || !email) return;

    await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    setName("");
    setEmail("");
    loadUsers();
  };

  // Delete user
  const deleteUser = async (id: number) => {
    await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    loadUsers();
  };

  // Save edited user
  const saveUser = async (id: number) => {
    if (!editingName || !editingEmail) return;

    await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName, email: editingEmail }),
    });

    setEditingId(null);
    setEditingName("");
    setEditingEmail("");
    loadUsers();
  };

  return (
    <div className="app-container">
      <h1>React + TS CRUD</h1>

      {/* Add User Form */}
      <div className="add-user-form">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={addUser}>Add User</button>
      </div>

      {/* Users List */}
      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id}>
            <div className="user-item">
              {editingId === user.id ? (
                <>
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <input
                    value={editingEmail}
                    onChange={(e) => setEditingEmail(e.target.value)}
                  />
                  <button onClick={() => saveUser(user.id)}>Save</button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setEditingId(null);
                      setEditingName("");
                      setEditingEmail("");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {user.name} ({user.email})
                  <button
                    onClick={() => {
                      setEditingId(user.id);
                      setEditingName(user.name);
                      setEditingEmail(user.email);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
