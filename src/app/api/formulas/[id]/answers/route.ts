import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { answers } = await request.json();
    
    // Obtener el usuario del token
    const userHeader = request.headers.get('user');
    if (!userHeader) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }
    const user = JSON.parse(userHeader);

    const formula = await db.collection('formulas').findOne({
      _id: new ObjectId(params.id),
    });

    if (!formula) {
      return NextResponse.json(
        { message: 'Fórmula no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el usuario tenga permiso para responder
    if (
      formula.userId.toString() !== user.userId &&
      user.role !== 'admin' &&
      user.role !== 'doctor'
    ) {
      return NextResponse.json(
        { message: 'No autorizado para responder esta fórmula' },
        { status: 403 }
      );
    }

    const updatedFormula = await db.collection('formulas').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: { 
          updatedAt: new Date(),
          answers: [...(formula.answers || []), ...answers]
        }
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json(updatedFormula);
  } catch (error) {
    console.error('Error al guardar respuestas:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 