import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const samples = await prisma.dnaSample.findMany({
        include: {
          case: {
            include: {
              station: true
            }
          },
          officer: true,
          location: true
        },
        orderBy: { sample_id: 'desc' }
      });
      res.json(samples);
    } catch (error) {
      console.error('Samples API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      const sample = await prisma.dnaSample.create({ 
        data: {
          ...req.body,
          received_date: new Date(req.body.received_date),
          collection_date: new Date(req.body.collection_date),
          expiry_date: req.body.expiry_date ? new Date(req.body.expiry_date) : null
        }
      });
      res.status(201).json(sample);
    } catch (error) {
      console.error('Create sample error:', error);
      res.status(500).json({ error: 'Failed to create sample' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
