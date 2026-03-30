import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface ExistingUser extends RowDataPacket {
  id: number;
}

// Helper to check if user is admin
async function isAdmin(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return false;
  try {
    const user = await verifyToken(token);
    return typeof user === 'object' && user?.role === 'admin';
  } catch {
    return false;
  }
}

// GET /api/users - list all users
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const pool = getPool();
  const [rows] = await pool.query('SELECT id, username, role FROM users');
  return NextResponse.json(rows);
}

// POST /api/users - create a new user
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { username, password, role } = await req.json();

  if (!username || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  if (username.toLowerCase() === 'admin') return NextResponse.json({ error: 'Cannot use reserved username' }, { status: 400 });

  const pool = getPool();
  const [existing] = await pool.query<ExistingUser[]>('SELECT id FROM users WHERE username = ?', [username]);
  if (existing.length > 0) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

  const bcrypt = await import('bcrypt');
  const hash = await bcrypt.hash(password, 10);

  await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role || 'user']);

  return NextResponse.json({ message: 'User created successfully' });
}

// DELETE /api/users/:id
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });

  const pool = getPool();
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return NextResponse.json({ message: 'User deleted successfully' });
}