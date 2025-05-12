import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const formulaId = await Promise.resolve(params.id);
    const formula = await db.collection('formulas').findOne({
      _id: new ObjectId(formulaId)
    });

    if (!formula) {
      return NextResponse.json(
        { message: 'Fórmula no encontrada' },
        { status: 404 }
      );
    }

    // Solo admin puede ver fórmulas de otros usuarios
    if (role !== 'admin' && formula.userId.toString() !== userId) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    return NextResponse.json(formula);
  } catch (error) {
    console.error('Error al obtener fórmula:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const formulaId = await Promise.resolve(params.id);
    const formula = await db.collection('formulas').findOne({
      _id: new ObjectId(formulaId)
    });

    if (!formula) {
      return NextResponse.json(
        { message: 'Fórmula no encontrada' },
        { status: 404 }
      );
    }

    // Solo admin puede modificar fórmulas de otros usuarios
    if (role !== 'admin' && formula.userId.toString() !== userId) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    const updateData = await request.json();
    const { _id, ...cleanUpdateData } = updateData;
    cleanUpdateData.updatedAt = new Date();

    const result = await db.collection('formulas').findOneAndUpdate(
      { _id: new ObjectId(formulaId) },
      { $set: cleanUpdateData },
      { returnDocument: 'after' }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al actualizar fórmula:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const formulaId = await Promise.resolve(params.id);
    const formula = await db.collection('formulas').findOne({
      _id: new ObjectId(formulaId)
    });

    if (!formula) {
      return NextResponse.json(
        { message: 'Fórmula no encontrada' },
        { status: 404 }
      );
    }

    // Solo admin puede eliminar fórmulas de otros usuarios
    if (role !== 'admin' && formula.userId.toString() !== userId) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    await db.collection('formulas').deleteOne({
      _id: new ObjectId(formulaId)
    });

    return NextResponse.json({ message: 'Fórmula eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar fórmula:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 