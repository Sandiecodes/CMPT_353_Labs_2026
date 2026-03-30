import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getPool, initDB } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface ExistingUser extends RowDataPacket {
  id: number;
}

export async function POST(req: NextRequest) {
  await initDB();
  const pool = getPool();

  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }

  if (username.toLowerCase() === 'admin') {
    return NextResponse.json({ error: 'Cannot use reserved username "admin"' }, { status: 400 });
  }

  const [existing] = await pool.execute<ExistingUser[]>('SELECT id FROM users WHERE username = ?', [username]);
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [
    username,
    hashedPassword,
    'user',
  ]);

  return NextResponse.json({ message: 'Registration successful' });
}