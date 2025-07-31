// 2FA verification API
import { prisma } from "@/lib/prisma";
import { verify2FACode } from "@/lib/twoFactor";
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

  const { code } = req.body;

  const twoFA = await prisma.twoFactorAuth.findUnique({
    where: { user_id: dbUser.user_id },
  });

  if (!twoFA || !verify2FACode(twoFA.secret_key, code)) {
    return res.status(400).json({ error: "Invalid 2FA code" });
  }

  await prisma.twoFactorAuth.update({
    where: { user_id: dbUser.user_id },
    data: { is_enabled: true },
  });

  res.json({ message: "2FA verified successfully" });
}
