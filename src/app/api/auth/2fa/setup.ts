// 2FA setup API
import { prisma } from "@/lib/prisma";
import { generate2FASecret } from "@/lib/twoFactor";
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

  const { secret, qrCode } = await generate2FASecret(session.user.email);
  await prisma.twoFactorAuth.upsert({
    where: { user_id: dbUser.user_id },
    create: { user_id: dbUser.user_id, secret_key: secret },
    update: { secret_key: secret }
  });

  res.status(200).json({ qrCode });
}
