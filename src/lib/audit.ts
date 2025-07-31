// Audit logging utility
import { prisma } from "@/lib/prisma";

export async function logAudit({
  entityType,
  entityId,
  action,
  userId,
  details
}: {
  entityType: string;
  entityId?: number;
  action: string;
  userId: number;
  details?: any;
}) {
  await prisma.auditTrail.create({
    data: {
      entity_type: entityType,
      entity_id: entityId || 0,
      action,
      performed_by: userId,
      details: details || {}
    }
  });
}
