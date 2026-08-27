import { getPayload } from "payload";
import config from "@payload-config";

/* eslint-disable @typescript-eslint/no-explicit-any */
const globalForPayload = globalThis as unknown as {
  __payloadInstance?: any;
  __payloadInit?: Promise<any>;
};

export async function getCachedPayload(): Promise<any> {
  if (globalForPayload.__payloadInstance) return globalForPayload.__payloadInstance;
  if (globalForPayload.__payloadInit) return globalForPayload.__payloadInit;

  globalForPayload.__payloadInit = getPayload({ config }).then((p) => {
    globalForPayload.__payloadInstance = p;
    globalForPayload.__payloadInit = undefined;
    return p;
  });

  return globalForPayload.__payloadInit;
}
