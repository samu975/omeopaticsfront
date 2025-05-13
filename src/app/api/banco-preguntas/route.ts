import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const banks = await db.collection('questionBanks').find({}).toArray();
    return NextResponse.json(banks);
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener bancos de preguntas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();
    const newBank = {
      name: data.name,
      questions: data.questions || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('questionBanks').insertOne(newBank);
    return NextResponse.json({ ...newBank, _id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ message: 'Error al crear banco de preguntas' }, { status: 500 });
  }
} 