import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

type Props = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const bank = await db.collection('questionBanks').findOne({ _id: new ObjectId(id) });
    
    if (!bank) {
      return NextResponse.json({ message: 'Banco no encontrado' }, { status: 404 });
    }

    return NextResponse.json(bank);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al obtener banco de preguntas' }, 
      { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    console.log('PUT banco-preguntas, id recibido:', id);
    const { db } = await connectToDatabase();
    const data = await request.json();
    console.log('PUT banco-preguntas, data recibida:', data);
    // Verificar si existe el banco antes de actualizar
    const exists = await db.collection('questionBanks').findOne({ _id: new ObjectId(id) });
    console.log('PUT banco-preguntas, existe en DB:', exists);
    if (!exists) return NextResponse.json({ message: 'Banco no encontrado (pre-update)' }, { status: 404 });
    const update = {
      name: data.name,
      questions: data.questions,
      updatedAt: new Date()
    };
    const result = await db.collection('questionBanks').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    console.log('PUT banco-preguntas, resultado update:', result);
    if (!result) return NextResponse.json({ message: 'Banco no encontrado (post-update)' }, { status: 404 });
    return NextResponse.json(result.value || result);
  } catch (error) {
    console.error('Error en PUT banco-preguntas:', error);
    return NextResponse.json({ message: 'Error al actualizar banco de preguntas', error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const result = await db.collection('questionBanks').deleteOne({ _id: new ObjectId(id) });
    if (!result || result.deletedCount === 0) return NextResponse.json({ message: 'Banco no encontrado' }, { status: 404 });
    return NextResponse.json({ message: 'Banco eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar banco de preguntas' }, { status: 500 });
  }
} 