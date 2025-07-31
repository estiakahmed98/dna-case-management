// Authentication and session handler
import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "./prisma";

export async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, {});
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return session;
}
