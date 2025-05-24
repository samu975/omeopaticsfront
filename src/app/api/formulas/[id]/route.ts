import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params;
    const formula = await db.collection('formulas').findOne({
      _id: new ObjectId(id)
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
      { message: 'Error al obtener fórmula' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params;
    const formula = await db.collection('formulas').findOne({
      _id: new ObjectId(id)
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
      { _id: new ObjectId(id) },
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params;
    const formula = await db.collection('formulas').findOne({
      _id: new ObjectId(id)
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
      _id: new ObjectId(id)
    });

    // Eliminar el ID de la fórmula del array asignedFormulas del usuario
    if (formula.user) {
      await db.collection('users').updateOne(
        { _id: new ObjectId(formula.user) },
        { $pull: { asignedFormulas: id as any } }
      );
    } else if (formula.userId) {
      await db.collection('users').updateOne(
        { _id: new ObjectId(formula.userId) },
        { $pull: { asignedFormulas: id as any } }
      );
    }

    return NextResponse.json({ message: 'Fórmula eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar fórmula:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const { db } = await connectToDatabase();

    const formulaData = await request.json();
    const newFormula = {
      ...formulaData,
      user: new ObjectId(id),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Crear la fórmula
    const result = await db.collection('formulas').insertOne(newFormula);
    const insertedFormula = await db.collection('formulas').findOne({
      _id: result.insertedId
    });

    // Actualizar el usuario para agregar la fórmula a asignedFormulas
    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $push: { "asignedFormulas": result.insertedId.toString() } as any }
    );

    return NextResponse.json(insertedFormula);
  } catch (error) {
    console.error('Error al crear fórmula:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 