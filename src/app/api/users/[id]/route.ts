import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import { hash } from 'bcryptjs';

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
    const { role } = decoded as { role: string };

    // Solo admin puede ver usuarios específicos
    if (role !== 'admin') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    const { id: userId } = await Promise.resolve(params);

    if (!userId) {
      return NextResponse.json(
        { message: 'ID de usuario no proporcionado' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
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
    const { role } = decoded as { role: string };

    // Solo admin puede actualizar usuarios
    if (role !== 'admin') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    const { id: userId } = await Promise.resolve(params);
    const updateData = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: 'ID de usuario no proporcionado' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Si se está actualizando la contraseña, la encriptamos
    if (updateData.password) {
      updateData.password = await hash(updateData.password, 10);
    }

    // Agregamos la fecha de actualización
    updateData.updatedAt = new Date();

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
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
    const { role } = decoded as { role: string };

    // Solo admin puede eliminar usuarios
    if (role !== 'admin') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    const { id: userId } = await Promise.resolve(params);

    if (!userId) {
      return NextResponse.json(
        { message: 'ID de usuario no proporcionado' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(userId)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 