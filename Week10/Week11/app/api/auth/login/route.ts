import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getPool, initDB } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

interface DbUser extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'user';
}

export async function POST(req: NextRequest) {
  await initDB();
  const pool = getPool();
  const { username, password } = await req.json();

  // Admin login from env
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = signToken({ username, role: 'admin' });
    const res = NextResponse.json({ message: 'Admin login success', role: 'admin' });
    res.cookies.set('token', token, { httpOnly: true, path: '/' });
    return res;
  }

  // Normal user login
  const [rows] = await pool.execute<DbUser[]>('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ id: user.id, username, role: user.role });
  const res = NextResponse.json({ message: 'Login success', role: user.role });
  res.cookies.set('token', token, { httpOnly: true, path: '/' });
  return res;
}