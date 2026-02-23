"use client";

import { useState, useEffect } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!name || !email) return alert("Name and email required");

    if (editId) {
      await fetch(`/api/users?id=${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      setEditId(null);
    } else {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
    }

    setName("");
    setEmail("");
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user.id);
  };

  return (
    <main className="main-container">
      <h1>Users CRUD Demo</h1>

      <div>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <button onClick={handleSubmit} className="button">
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setName("");
              setEmail("");
            }}
            className="button"
          >
            Cancel
          </button>
        )}
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => handleEdit(u)} className="button">
                  Edit
                </button>{" "}
                <button onClick={() => handleDelete(u.id)} className="button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}