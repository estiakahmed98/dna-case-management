// OAuth login API (Google/GitHub)
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { provider, provider_account_id, email, name } = req.body;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        role: { connect: { role_name: "Scientific Officer" } },
      },
    });
  }

  await prisma.authAccount.upsert({
    where: { provider_provider_account_id: { provider, provider_account_id } },
    update: {},
    create: {
      provider,
      provider_account_id,
      user_id: user.user_id,
    },
  });

  res.status(200).json({ message: "OAuth login successful", user });
}
