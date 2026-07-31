import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterLoginHook,
  GlobalAfterChangeHook,
} from "payload";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyReq = {
  [key: string]: any;
  headers?: any;
  user?: any;
  payload?: any;
  collection?: any;
  global?: any;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const getIP = (req: AnyReq) =>
  req.ip ||
  req.headers?.get?.("x-forwarded-for") ||
  req.headers?.["x-forwarded-for"] ||
  "unknown";
const getUserAgent = (req: AnyReq) =>
  req.headers?.get?.("user-agent") || req.headers?.["user-agent"] || "unknown";

export const auditLogAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  const r = req as AnyReq;
  if (!r.user) return doc;

  const resourceType = r.collection?.config?.slug || "unknown";

  try {
    await r.payload.create({
      collection: "audit-logs",
      data: {
        actor: r.user.id,
        action: operation,
        resourceType,
        resourceId: doc.id ? String(doc.id) : "unknown",
        metadata: { before: previousDoc, after: doc },
        ipHash: String(getIP(r)),
        userAgent: String(getUserAgent(r)),
        outcome: "success",
      },
      overrideAccess: true,
    });
  } catch (error) {
    r.payload.logger.error(
      `Failed to create audit log for ${operation} on ${resourceType}: ${error}`,
    );
  }

  return doc;
};

export const auditLogAfterDelete: CollectionAfterDeleteHook = async ({
  req,
  id,
  doc,
}) => {
  const r = req as AnyReq;
  if (!r.user) return doc;

  const resourceType = r.collection?.config?.slug || "unknown";

  try {
    await r.payload.create({
      collection: "audit-logs",
      data: {
        actor: r.user.id,
        action: "delete",
        resourceType,
        resourceId: id ? String(id) : "unknown",
        metadata: { deletedDoc: doc },
        ipHash: String(getIP(r)),
        userAgent: String(getUserAgent(r)),
        outcome: "success",
      },
      overrideAccess: true,
    });
  } catch (error) {
    r.payload.logger.error(
      `Failed to create audit log for delete on ${resourceType}: ${error}`,
    );
  }

  return doc;
};

export const auditLogGlobalAfterChange: GlobalAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const r = req as AnyReq;
  if (!r.user) return doc;

  const resourceType = r.global?.config?.slug || "unknown";

  try {
    await r.payload.create({
      collection: "audit-logs",
      data: {
        actor: r.user.id,
        action: "update",
        resourceType,
        resourceId: "global",
        metadata: { before: previousDoc, after: doc },
        ipHash: String(getIP(r)),
        userAgent: String(getUserAgent(r)),
        outcome: "success",
      },
      overrideAccess: true,
    });
  } catch (error) {
    r.payload.logger.error(
      `Failed to create global audit log for ${resourceType}: ${error}`,
    );
  }

  return doc;
};

export const auditLogAfterLogin: CollectionAfterLoginHook = async ({
  req,
  user,
}) => {
  const r = req as AnyReq;
  try {
    await r.payload.create({
      collection: "audit-logs",
      data: {
        actor: user.id,
        action: "login",
        resourceType: "admin-users",
        resourceId: String(user.id),
        metadata: { email: user.email },
        ipHash: String(getIP(r)),
        userAgent: String(getUserAgent(r)),
        outcome: "success",
      },
      overrideAccess: true,
    });
  } catch (error) {
    r.payload.logger.error(`Failed to create login audit log: ${error}`);
  }

  return user;
};
