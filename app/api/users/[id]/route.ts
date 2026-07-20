import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const { db } = await connectToDatabase();
    const col = db.collection('users');
    const user = await col.findOne({ _id: new ObjectId(id) });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const { password: _pw, ...safe } = user;
    return NextResponse.json({ user: safe });
  } catch (err: any) {
    console.error('Error in GET /api/users/[id]:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
