import { prisma } from "@/lib/prisma";
import { withAuditLogging } from "@/lib/apiHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  if (req.method === "GET") {
    const samples = await prisma.dnaSample.findMany();
    return res.json(samples);
  }

  if (req.method === "POST") {
    const sample = await prisma.dnaSample.create({ data: req.body });
    return res.status(201).json(sample);
  }

  res.status(405).end();
}

export default withAuditLogging(handler, "DNA Sample");
