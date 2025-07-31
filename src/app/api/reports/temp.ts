import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
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
      res.json(reports);
    } catch (error) {
      console.error('Reports API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      const report = await prisma.report.create({ 
        data: {
          ...req.body,
          report_received_date: new Date(req.body.report_received_date),
          archive_entry_date: new Date(req.body.archive_entry_date)
        }
      });
      res.status(201).json(report);
    } catch (error) {
      console.error('Create report error:', error);
      res.status(500).json({ error: 'Failed to create report' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
