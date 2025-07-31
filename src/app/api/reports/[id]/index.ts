// Single report fetch/update/delete
import { prisma } from "@/lib/prisma";
import { withRole } from "@/lib/rbac";
import { withAuditLogging } from "@/lib/apiHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "GET") {
    const report = await prisma.report.findUnique({
      where: { report_id: Number(id) },
      include: { movements: true },
    });

    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ error: "Report not found" });
    }
    return;
  }

  if (req.method === "PUT") {
    const updatedReport = await prisma.report.update({
      where: { report_id: Number(id) },
      data: req.body,
    });

    res.json(updatedReport);
    return;
  }

  if (req.method === "DELETE") {
    await prisma.report.delete({ where: { report_id: Number(id) } });
    res.status(204).end();
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default withRole(["Admin", "Scientific Officer"], withAuditLogging(handler, "Report"));
