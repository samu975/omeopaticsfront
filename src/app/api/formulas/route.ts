import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { userId, role } = decoded as { userId: string; role: string };

    const { db } = await connectToDatabase();
    let formulas;

    // Si es admin, puede ver todas las fórmulas
    if (role === 'admin') {
      formulas = await db.collection('formulas').find().toArray();
    } else {
      // Si no es admin, solo puede ver sus propias fórmulas
      formulas = await db.collection('formulas').find({
        userId: new ObjectId(userId)
      }).toArray();
    }

    return NextResponse.json(formulas);
  } catch (error) {
    console.error('Error al obtener fórmulas:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { userId, role } = decoded as { userId: string; role: string };

    // Solo admin y doctor pueden crear fórmulas
    if (role !== 'admin' && role !== 'doctor') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    const formulaData = await request.json();
    const { db } = await connectToDatabase();

    const newFormula = {
      ...formulaData,
      userId: new ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('formulas').insertOne(newFormula);

    return NextResponse.json({
      ...newFormula,
      _id: result.insertedId,
    });
  } catch (error) {
    console.error('Error al crear fórmula:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 