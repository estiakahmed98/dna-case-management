// Police Stations CRUD API
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session) return;

  if (req.method === "GET") {
    const stations = await prisma.policeStation.findMany();
    return res.json(stations);
  }

  if (req.method === "POST") {
    const station = await prisma.policeStation.create({ data: req.body });
    return res.status(201).json(station);
  }

  res.status(405).end();
}
