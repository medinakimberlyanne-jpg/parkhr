import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

function parseCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const cookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('parkingSlot');
    const slots = await collection.find({}).toArray();
    return NextResponse.json({ slots });
  } catch (err: any) {
    console.error('Error in GET /api/parking-slots:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const userId = parseCookieValue(cookieHeader, 'userId');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user || String(user.userType || '').toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'Empty payload' }, { status: 400 });
    }

    const allowedFields = {
      code: String(body.code || '').trim(),
      zone: String(body.zone || '').trim(),
      level: String(body.level || '').trim(),
      status: String(body.status || 'available') as 'available' | 'occupied' | 'reserved',
      pricePerHour: Number(body.pricePerHour || 0),
      features: Array.isArray(body.features) ? body.features.map(String) : [],
      createdAt: new Date(),
    };

    if (!allowedFields.code || !allowedFields.zone || !allowedFields.level) {
      return NextResponse.json({ error: 'Missing required slot fields' }, { status: 400 });
    }

    const collection = db.collection('parkingSlot');
    const result = await collection.insertOne(allowedFields);
    const slot = { _id: result.insertedId, ...allowedFields };
    return NextResponse.json({ slot });
  } catch (err: any) {
    console.error('Error in POST /api/parking-slots:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
