import { prisma } from "@/lib/prisma";
import { withRole } from "@/lib/rbac";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  if (req.method === "GET") {
    const logs = await prisma.auditTrail.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });
    res.json(logs);
    return;
  }

  res.status(405).end();
}

export default withRole(["Admin"], handler);
