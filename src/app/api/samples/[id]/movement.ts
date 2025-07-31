// DNA Sample movement API
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await requireAuth(req, res);
  if (!session || !session.user || !session.user.email) return;

  // Get the user from database
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!dbUser) {
    return res.status(401).json({ error: "User not found" });
  }

  const { id } = req.query;

  if (req.method === "POST") {
    const movement = await prisma.sampleMovement.create({
      data: { ...req.body, sample_id: Number(id), performed_by: dbUser.user_id }
    });
    return res.status(201).json(movement);
  }

  res.status(405).end();
}
