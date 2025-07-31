// Report movement log API
import { prisma } from "@/lib/prisma";
import { withAuditLogging } from "@/lib/apiHandler";
import { withRole } from "@/lib/rbac";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse, user: any) {
  const { id } = req.query;

  if (req.method === "POST") {
    const { action_type, reason, expected_return_date } = req.body;

    const movement = await prisma.reportMovement.create({
      data: {
        report_id: Number(id),
        action_type,
        reason,
        expected_return_date: expected_return_date ? new Date(expected_return_date) : null,
        performed_by: user.user_id,
      },
    });

    res.status(201).json(movement);
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}

export default withRole(
  ["Admin", "Scientific Officer", "Archive In-Charge"],
  withAuditLogging(handler, "Report Movement")
);
