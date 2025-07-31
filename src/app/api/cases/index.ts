// Cases CRUD API
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session) return;

  if (req.method === "GET") {
    const cases = await prisma.case.findMany({ include: { station: true } });
    return res.json(cases);
  }

  if (req.method === "POST") {
    const newCase = await prisma.case.create({ data: req.body });
    return res.status(201).json(newCase);
  }

  res.status(405).end();
}
