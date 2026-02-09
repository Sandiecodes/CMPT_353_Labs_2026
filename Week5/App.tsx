import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import type { User } from "./types";
import "./App.css";

const API_URL = "http://localhost:8080"; // Your Express API

// --- Users List Page ---
function UsersList() {
  const [users, setUsers] = useState<User[]>([]);

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

  const deleteUser = async (id: number) => {
    await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    loadUsers();
  };

  return (
    <div className="app-container">
      <h1>Users</h1>
      <Link to="/add">
        <button>Add User</button>
      </Link>
      <ul className="users-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            {user.name} ({user.email})
            <Link to={`/edit/${user.id}`}>
              <button>Edit</button>
            </Link>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Add User Page ---
function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const addUser = async () => {
    if (!name || !email) return;
    await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    navigate("/"); // Go back to users list
  };

  return (
    <div className="app-container">
      <h1>Add User</h1>
      <div className="form-group">
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
      </div>
      <div className="button-group">
        <button onClick={addUser}>Add</button>
        <Link to="/">
          <button>Cancel</button>
        </Link>
      </div>
    </div>
  );
}

// --- Edit User Page ---
function EditUser() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const res = await fetch(`${API_URL}/users/${id}`);
      const user: User = await res.json();
      setName(user.name);
      setEmail(user.email);
    };
    loadUser();
  }, [id]);

  const saveUser = async () => {
    await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    navigate("/");
  };

  return (
    <div className="app-container">
      <h1>Edit User</h1>
      <div className="form-group">
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="button-group">
        <button onClick={saveUser}>Save</button>
        <Link to="/">
          <button>Cancel</button>
        </Link>
      </div>
    </div>
  );
}

// --- App Component with Router ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersList />} />
        <Route path="/add" element={<AddUser />} />
        <Route path="/edit/:id" element={<EditUser />} />
      </Routes>
    </Router>
  );
}

export default App;
