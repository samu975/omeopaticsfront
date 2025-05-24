import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import { QuestionSet } from '@/app/interfaces/Question.interface';
import { NextRequest } from 'next/server';

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

    const { id } = await params;
    const { db } = await connectToDatabase();

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

    return NextResponse.json(formula.questionSets || []);
  } catch (error) {
    console.error('Error al obtener conjuntos de preguntas:', error);
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

    const questionSet: QuestionSet = await request.json();
    questionSet.createdAt = new Date();

    const result = await db.collection('formulas').updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { "questionSets": questionSet } as any,
        $set: { updatedAt: new Date() }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Error al agregar el conjunto de preguntas' },
        { status: 400 }
      );
    }

    return NextResponse.json(questionSet);
  } catch (error) {
    console.error('Error al agregar conjunto de preguntas:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const { questionSetId, ...updateData } = await request.json();

    const result = await db.collection('formulas').updateOne(
      { 
        _id: new ObjectId(id),
        'questionSets.id': questionSetId
      },
      { 
        $set: { 
          'questionSets.$': { ...updateData, id: questionSetId },
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Error al actualizar el conjunto de preguntas' },
        { status: 400 }
      );
    }

    return NextResponse.json({ ...updateData, id: questionSetId });
  } catch (error) {
    console.error('Error al actualizar conjunto de preguntas:', error);
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

    const { id } = await params;
    const { db } = await connectToDatabase();

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

    const { questionSetId } = await request.json();

    const result = await db.collection('formulas').updateOne(
      { _id: new ObjectId(id) },
      { 
        $pull: { "questionSets": { id: questionSetId } } as any,
        $set: { updatedAt: new Date() }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Error al eliminar el conjunto de preguntas' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Conjunto de preguntas eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar conjunto de preguntas:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 