import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const PORT = 8080;
const HOST = "0.0.0.0";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- MySQL connection (no database yet) ----
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "mysql1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
});

console.log("Connected to MySQL Server!");

// ---- INIT: create DB + table ----
app.get("/init", async (_req, res) => {
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS usersdb`);
    await connection.query(`USE usersdb`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL
      )
    `);

    res.send("Database and users table created!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Initialization failed");
  }
});

// ---- Create user ----
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  await connection.query(`USE usersdb`);

  const [result] = await connection.execute<mysql.ResultSetHeader>(
    `INSERT INTO users (name, email) VALUES (?, ?)`,
    [name, email]
  );

  res.status(201).json({
    id: result.insertId,
    name,
    email,
  });
});

// ---- Get all users ----
app.get("/users", async (_req, res) => {
  await connection.query(`USE usersdb`);

  const [rows] = await connection.query(
    `SELECT * FROM users`
  );

  res.json(rows);
});

// ---- Get user by ID ----
app.get("/users/:id", async (req, res) => {
  await connection.query(`USE usersdb`);

  const [rows]: any = await connection.query(
    `SELECT * FROM users WHERE id = ?`,
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(rows[0]);
});

// ---- Update user ----
app.put("/users/:id", async (req, res) => {
  const { name, email } = req.body;
  const id = req.params.id;

  await connection.query(`USE usersdb`);

  const [result] = await connection.execute<mysql.ResultSetHeader>(
    `UPDATE users SET name=?, email=? WHERE id=?`,
    [name, email, id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ id, name, email });
});

// ---- Delete user ----
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;

  await connection.query(`USE usersdb`);

  const [result] = await connection.execute<mysql.ResultSetHeader>(
    `DELETE FROM users WHERE id=?`,
    [id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(204).send();
});

// ---- Start server ----
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
