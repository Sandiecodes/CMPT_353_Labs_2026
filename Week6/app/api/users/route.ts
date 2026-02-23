import { NextResponse } from "next/server";

type User = {
  id: number;
  name: string;
  email: string;
};

// Initial users
let users: User[] = [
  { id: 1, name: "Alice", email: "alice@test.com" },
  { id: 2, name: "Bob", email: "bob@test.com" },
];

// GET all users or by ID
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const user = users.find(u => u.id === Number(id));
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  }

  return NextResponse.json(users);
}

// POST create user with sequential ID
export async function POST(req: Request) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json(
      { message: "Name and email required" },
      { status: 400 }
    );
  }

  // Determine the next ID
  const lastId = users.length > 0 ? users[users.length - 1].id : 0;
  const newUser: User = { id: lastId + 1, name, email };

  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}

// PUT update user
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  const { name, email } = await req.json();

  const user = users.find(u => u.id === id);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  return NextResponse.json(user);
}

// DELETE user
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  users.splice(index, 1);
  return new NextResponse(null, { status: 204 });
}