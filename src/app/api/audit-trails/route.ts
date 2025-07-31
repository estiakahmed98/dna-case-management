import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const auditTrails = await prisma.auditTrail.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { timestamp: 'desc' },
      take: 100 // Limit to last 100 entries
    });
    return NextResponse.json(auditTrails);
  } catch (error) {
    console.error('Audit trails API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { entity_type, entity_id, action, performed_by, details } = await request.json();
    
    const auditTrail = await prisma.auditTrail.create({
      data: {
        entity_type,
        entity_id,
        action,
        performed_by,
        details
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json(auditTrail, { status: 201 });
  } catch (error) {
    console.error('Create audit trail error:', error);
    return NextResponse.json({ error: 'Failed to create audit trail' }, { status: 500 });
  }
}
