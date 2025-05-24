import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const { userId } = await params;

    if (!token) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const { userId: tokenUserId, role } = decoded as { userId: string; role: string };

    const { db } = await connectToDatabase();

    // Solo admin puede ver fórmulas de otros usuarios
      if (role !== 'admin' && tokenUserId !== userId) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    const formulas = await db.collection('formulas')
      .find({ userId: new ObjectId(userId) })
      .toArray();

    return NextResponse.json(formulas);
  } catch (error) {
    console.error('Error al obtener fórmulas del usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 