import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const locations = await prisma.storageLocation.findMany({
      include: {
        reports: true,
        samples: true
      },
      orderBy: { location_id: 'desc' }
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Storage locations API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, cabinet, rack, shelf, freezer_unit, temperature_zone } = await request.json();
    
    const location = await prisma.storageLocation.create({
      data: {
        type,
        cabinet: cabinet || null,
        rack: rack || null,
        shelf: shelf || null,
        freezer_unit: freezer_unit || null,
        temperature_zone: temperature_zone || null
      }
    });
    
    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error('Create storage location error:', error);
    return NextResponse.json({ error: 'Failed to create storage location' }, { status: 500 });
  }
}
