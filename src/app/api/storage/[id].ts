// Single storage location API
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session) return;

  const { id } = req.query;

  if (req.method === "GET") {
    const location = await prisma.storageLocation.findUnique({ where: { location_id: Number(id) } });
    return location ? res.json(location) : res.status(404).json({ error: "Not Found" });
  }

  if (req.method === "PUT") {
    const updated = await prisma.storageLocation.update({ where: { location_id: Number(id) }, data: req.body });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.storageLocation.delete({ where: { location_id: Number(id) } });
    return res.status(204).end();
  }

  res.status(405).end();
}
