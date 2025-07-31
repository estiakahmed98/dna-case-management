import { prisma } from "@/lib/prisma";
import { withRole } from "@/lib/rbac";
import { withAuditLogging } from "@/lib/apiHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  if (req.method === "GET") {
    const reports = await prisma.report.findMany();
    res.json(reports);
    return;
  }

  if (req.method === "POST") {
    const report = await prisma.report.create({ data: req.body });
    res.status(201).json(report);
    return;
  }

  res.status(405).end();
}

// Combine RBAC and Audit
export default withRole(["Admin", "Scientific Officer"], withAuditLogging(handler, "Report"));
