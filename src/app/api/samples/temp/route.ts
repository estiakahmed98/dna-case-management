import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const samples = await prisma.dnaSample.findMany({
      include: {
        case: {
          include: {
            station: true
          }
        },
        officer: true,
        location: true
      },
      orderBy: { sample_id: 'desc' }
    });
    return NextResponse.json(samples);
  } catch (error) {
    console.error('Samples API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const sample = await prisma.dnaSample.create({
      data: {
        ...body,
        received_date: new Date(body.received_date),
        collection_date: new Date(body.collection_date),
        expiry_date: body.expiry_date ? new Date(body.expiry_date) : null
      }
    });
    
    return NextResponse.json(sample, { status: 201 });
  } catch (error) {
    console.error('Create sample error:', error);
    return NextResponse.json({ error: 'Failed to create sample' }, { status: 500 });
  }
}
