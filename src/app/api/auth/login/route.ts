import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { compare } from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const { cedula, password } = await request.json();

    // Buscar usuario por cédula
    const user = await db.collection('users').findOne({ cedula });
    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Crear la clave secreta
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );

    // Generar token
    const token = await new SignJWT({
      userId: user._id.toString(),
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    console.log('Token generado:', token);
    console.log('Payload del token:', {
      userId: user._id.toString(),
      role: user.role,
    });

    // Devolver usuario y token
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 