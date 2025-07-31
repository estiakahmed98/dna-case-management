// API handler wrapper with audit logging
import { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "./auth";
import { logAudit } from "./audit";
import { prisma } from "./prisma";

export function withAuditLogging(handler: (req: NextApiRequest, res: NextApiResponse, user: any) => Promise<void>, entityType: string) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await requireAuth(req, res);
    if (!session || !session.user || !session.user.email) return;

    // Get the full user data from database using email
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!dbUser) {
      return res.status(401).json({ error: "User not found" });
    }

    await handler(req, res, dbUser);

    // Only log for write operations
    if (["POST", "PUT", "DELETE"].includes(req.method || "")) {
      await logAudit({
        entityType,
        entityId: req.body?.id || 0,
        action: `${req.method} ${entityType}`,
        userId: dbUser.user_id,
        details: req.body
      });
    }
  };
}
