import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const movements = await prisma.sampleMovement.findMany({
      include: {
        sample: {
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
    console.error('Sample movements API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      sample_id,
      action_type,
      performed_by,
      reason,
      expected_return_date,
      disposal_method,
      disposal_authority
    } = await request.json();
    
    const movement = await prisma.sampleMovement.create({
      data: {
        sample_id,
        action_type,
        performed_by,
        reason,
        expected_return_date: expected_return_date ? new Date(expected_return_date) : null,
        disposal_method,
        disposal_authority
      },
      include: {
        sample: {
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
    console.error('Create sample movement error:', error);
    return NextResponse.json({ error: 'Failed to create sample movement' }, { status: 500 });
  }
}
