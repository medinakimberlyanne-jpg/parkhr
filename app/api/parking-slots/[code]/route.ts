import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

function parseCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

export async function PATCH(request: Request, context: { params?: { code?: string } }) {
  try {
    // Prefer framework-provided params, fall back to parsing the request URL
    const params = context?.params || {};
    let code = params.code;
    if (!code) {
      try {
        const url = new URL(request.url);
        const segments = url.pathname.split('/').filter(Boolean);
        code = segments[segments.length - 1] || undefined;
      } catch (e) {
        code = undefined;
      }
    }
    if (!code) {
      return NextResponse.json({ error: 'Missing slot code' }, { status: 400 });
    }

    const cookieHeader = request.headers.get('cookie');
    const userId = parseCookieValue(cookieHeader, 'userId');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    // sanitize incoming occupant details
    const occupant = body?.occupantDetails
      ? {
          customerName: String(body.occupantDetails.customerName || '').trim(),
          contactNumber: String(body.occupantDetails.contactNumber || '').trim(),
          plateNumber: String(body.occupantDetails.plateNumber || '').trim().toUpperCase(),
          vehicleType: String(body.occupantDetails.vehicleType || 'Sedan').trim(),
          startTime: String(body.occupantDetails.startTime || ''),
          durationHours: Number(body.occupantDetails.durationHours || 1),
        }
      : null;
    const statusSource = (body && (body.slotStatus || body.status)) || 'reserved';
    const incomingStatus = String(statusSource);
    const normalizedStatus = ['available', 'occupied', 'reserved'].includes(incomingStatus)
      ? incomingStatus
      : 'reserved';

    const collection = db.collection('parkingSlot');
    const existing = await collection.findOne({ code });
    if (!existing) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    // Allow admins to update freely. Regular users may only reserve/occupy slots or cancel their own reserved slot.
    if (String(user.userType || '').toLowerCase() !== 'admin') {
      const existingUserId = existing.userId ? String(existing.userId) : null;
      const isOwnReservedSlot = existing.status === 'reserved' && existingUserId === String(userId);

      if (normalizedStatus === 'available' && isOwnReservedSlot) {
        const update = {
          $set: {
            status: 'available',
            occupantDetails: null,
            userId: null,
            updatedAt: new Date(),
          },
        };
        await collection.updateOne({ code }, update);
        const updated = await collection.findOne({ code });
        return NextResponse.json({ slot: updated });
      }

      // Only allow reserving/occupying if currently available
      if (String(existing.status) !== 'available') {
        return NextResponse.json({ error: 'Slot not available' }, { status: 403 });
      }

      const update = {
        $set: {
          status: normalizedStatus,
          occupantDetails: occupant,
          userId: new ObjectId(userId),
          updatedAt: new Date(),
        },
      };
      await collection.updateOne({ code }, update);
      const updated = await collection.findOne({ code });
      return NextResponse.json({ slot: updated });
    }

    // Admin path: apply allowed updates (status and occupantDetails)
    const allowed: any = {};
    // accept either `slotStatus` (preferred) or `status` from client
    const adminIncomingStatus = body?.slotStatus ?? body?.status;
    if (adminIncomingStatus) allowed.status = String(adminIncomingStatus);
    if (occupant) allowed.occupantDetails = occupant;
    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    allowed.updatedAt = new Date();
    await collection.updateOne({ code }, { $set: allowed });
    const updated = await collection.findOne({ code });
    return NextResponse.json({ slot: updated });
  } catch (err: any) {
    console.error('Error in PATCH /api/parking-slots/[code]:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params?: { code?: string } }) {
  try {
    const params = context?.params || {};
    let code = params.code;
    if (!code) {
      try {
        const url = new URL(request.url);
        const segments = url.pathname.split('/').filter(Boolean);
        code = segments[segments.length - 1] || undefined;
      } catch (e) {
        code = undefined;
      }
    }
    if (!code) {
      return NextResponse.json({ error: 'Missing slot code' }, { status: 400 });
    }

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

    const collection = db.collection('parkingSlot');
    const existing = await collection.findOne({ code });
    if (!existing) {
      return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
    }

    await collection.deleteOne({ code });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error in DELETE /api/parking-slots/[code]:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
