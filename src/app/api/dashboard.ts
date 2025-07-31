// Dashboard API with counts and overdue
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Temporarily removed authentication for testing
  // const session = await requireAuth(req, res);
  // if (!session) return;

  if (req.method === "GET") {
    try {
      const reportsCount = await prisma.report.count();
      const samplesCount = await prisma.dnaSample.count();
      const overdueReports = await prisma.reportMovement.count({ where: { returned_date: null } });
      const expiredSamples = await prisma.dnaSample.count({
        where: { expiry_date: { lt: new Date() } }
      });

      return res.json({
        reports: reportsCount,
        samples: samplesCount,
        overdueSamples: expiredSamples,
        overdueReports: overdueReports
      });
    } catch (error) {
      console.error('Dashboard API error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
