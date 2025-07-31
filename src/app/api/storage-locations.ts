import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const locations = await prisma.storageLocation.findMany({
        include: {
          reports: true,
          samples: true
        },
        orderBy: { location_id: 'desc' }
      });
      res.json(locations);
    } catch (error) {
      console.error('Storage locations API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { type, cabinet, rack, shelf, freezer_unit, temperature_zone } = req.body;
      
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
      
      res.status(201).json(location);
    } catch (error) {
      console.error('Create storage location error:', error);
      res.status(500).json({ error: 'Failed to create storage location' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
