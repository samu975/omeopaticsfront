import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { verify } from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('x-auth-token');
    if (!token) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar el token
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { userId, role } = decoded as { userId: string; role: string };

    const { db } = await connectToDatabase();
    let followUps;

    if (role === 'admin') {
      // Admin puede ver todos los seguimientos
      followUps = await db.collection('followUps').find().toArray();
    } else {
      // Usuario normal solo ve sus seguimientos
      followUps = await db.collection('followUps')
        .find({ userId: new ObjectId(userId) })
        .toArray();
    }

    return NextResponse.json(followUps);
  } catch (error) {
    console.error('Error al obtener seguimientos:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('x-auth-token');
    if (!token) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar el token
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { userId, role } = decoded as { userId: string; role: string };

    // Solo admin puede crear seguimientos
    if (role !== 'admin') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { db } = await connectToDatabase();

    const followUp = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('followUps').insertOne(followUp);
    followUp._id = result.insertedId;

    return NextResponse.json(followUp);
  } catch (error) {
    console.error('Error al crear seguimiento:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 