import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hash } from 'bcryptjs';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const userData = await request.json();

    // Verificar si el usuario ya existe
    const existingUser = await db.collection('users').findOne({
      cedula: userData.cedula,
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Ya existe un usuario con esta cédula' },
        { status: 400 }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await hash(userData.password, 10);

    const newUser = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      ...userWithoutPassword,
      _id: result.insertedId,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

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

    // Solo admin puede ver todos los usuarios
    if (role !== 'admin') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    const { db } = await connectToDatabase();
    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 