import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      include: {
        station: true,
        reports: true,
        samples: true
      },
      orderBy: { case_id: 'desc' }
    });
    return NextResponse.json(cases);
  } catch (error) {
    console.error('Cases API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { police_case_number, case_date, station_id, case_type } = await request.json();
    
    const case_record = await prisma.case.create({
      data: {
        police_case_number,
        case_date: new Date(case_date),
        station_id,
        case_type
      },
      include: {
        station: true
      }
    });
    
    return NextResponse.json(case_record, { status: 201 });
  } catch (error) {
    console.error('Create case error:', error);
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}
