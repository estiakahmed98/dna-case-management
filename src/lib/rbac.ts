// Role-based access control middleware
import { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "./auth";
import { prisma } from "./prisma";

export function withRole(requiredRoles: string[], handler: (req: NextApiRequest, res: NextApiResponse, user: any) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await requireAuth(req, res);
    if (!session || !session.user || !session.user.email) return;

    // Get the full user data from database with role information
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { role: true }
    });

    if (!dbUser) {
      return res.status(401).json({ error: "User not found" });
    }

    const userRole = dbUser.role?.role_name;

    if (!userRole || !requiredRoles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
    }

    return handler(req, res, dbUser);
  };
}
