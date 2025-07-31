import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const movements = await prisma.reportMovement.findMany({
      include: {
        report: {
          include: {
            case: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(movements);
  } catch (error) {
    console.error('Report movements API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      report_id,
      action_type,
      performed_by,
      reason,
      expected_return_date
    } = await request.json();
    
    const movement = await prisma.reportMovement.create({
      data: {
        report_id,
        action_type,
        performed_by,
        reason,
        expected_return_date: expected_return_date ? new Date(expected_return_date) : null
      },
      include: {
        report: {
          include: {
            case: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    console.error('Create report movement error:', error);
    return NextResponse.json({ error: 'Failed to create report movement' }, { status: 500 });
  }
}
