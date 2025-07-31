import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        case: {
          include: {
            station: true
          }
        },
        officer: true,
        location: true
      },
      orderBy: { report_id: 'desc' }
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const report = await prisma.report.create({
      data: {
        ...body,
        report_received_date: new Date(body.report_received_date),
        report_delivery_date: body.report_delivery_date ? new Date(body.report_delivery_date) : null,
        archive_entry_date: new Date(body.archive_entry_date)
      }
    });
    
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
