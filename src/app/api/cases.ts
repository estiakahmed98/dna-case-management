import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const cases = await prisma.case.findMany({
        include: {
          station: true,
          reports: true,
          samples: true
        },
        orderBy: { case_id: 'desc' }
      });
      res.json(cases);
    } catch (error) {
      console.error('Cases API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { police_case_number, case_date, station_id, case_type } = req.body;
      
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
      
      res.status(201).json(case_record);
    } catch (error) {
      console.error('Create case error:', error);
      res.status(500).json({ error: 'Failed to create case' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
