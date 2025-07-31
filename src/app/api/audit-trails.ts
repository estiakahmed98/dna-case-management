import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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
      res.json(auditTrails);
    } catch (error) {
      console.error('Audit trails API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { entity_type, entity_id, action, performed_by, details } = req.body;
      
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
      
      res.status(201).json(auditTrail);
    } catch (error) {
      console.error('Create audit trail error:', error);
      res.status(500).json({ error: 'Failed to create audit trail' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
