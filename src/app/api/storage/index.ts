import { prisma } from "@/lib/prisma";
import { withRole } from "@/lib/rbac";
import { withAuditLogging } from "@/lib/apiHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  if (req.method === "GET") {
    const locations = await prisma.storageLocation.findMany();
    res.json(locations);
    return;
  }

  if (req.method === "POST") {
    const location = await prisma.storageLocation.create({ data: req.body });
    res.status(201).json(location);
    return;
  }

  res.status(405).end();
}

export default withRole(["Admin"], withAuditLogging(handler, "Storage Location"));
