import express from "express";
import type { Request, Response } from "express";
import cors from "cors";


const app = express();
const PORT = 8080;

//Parse JSON
app.use(express.json()); 

//Enable CORS
app.use(cors());

// User type
type User = {
  id: number;
  name: string;
  email: string;
};

// In-memory data
let users: User[] = [
  { id: 1, name: "Alice", email: "alice@test.com" },
  { id: 2, name: "Bob", email: "bob@test.com" },
];

// Get all users
app.get("/users", (_req: Request, res: Response) => {
  res.json(users);
});

// Get user by ID
app.get("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Create a new user
app.post("/users", (req: Request, res: Response) => {
  const { name, email } = req.body as Partial<User>;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  const newUser: User = { id: Date.now(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update a user
app.put("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email } = req.body as Partial<User>;

  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (name) user.name = name;
  if (email) user.email = email;

  res.json(user);
});

// Delete a user
app.delete("/users/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: "User not found" });

  users.splice(index, 1);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
