import { NextResponse } from 'next/server';

export async function GET() {
    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.set('token', '', { expires: new Date(0) });
    return res;
}