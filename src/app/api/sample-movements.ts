import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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
      res.json(movements);
    } catch (error) {
      console.error('Sample movements API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const {
        sample_id,
        action_type,
        performed_by,
        reason,
        expected_return_date,
        disposal_method,
        disposal_authority
      } = req.body;
      
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
      
      res.status(201).json(movement);
    } catch (error) {
      console.error('Create sample movement error:', error);
      res.status(500).json({ error: 'Failed to create sample movement' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
