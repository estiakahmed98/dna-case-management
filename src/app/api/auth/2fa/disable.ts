// 2FA disable API
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await requireAuth(req, res);
  if (!session || !session.user || !session.user.email) return;

  // Get the user from database
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!dbUser) {
    return res.status(401).json({ error: "User not found" });
  }

  await prisma.twoFactorAuth.updateMany({
    where: { user_id: dbUser.user_id },
    data: { is_enabled: false, secret_key: "", backup_codes: [] },
  });

  res.json({ message: "Two-factor authentication disabled successfully" });
}
