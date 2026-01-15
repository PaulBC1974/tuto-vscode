import type { Flow3DFile } from "../types/flow3d";

const encode = (data: string) => new TextEncoder().encode(data);

export const computeChecksum = async (payload: Flow3DFile): Promise<string> => {
  const clone = { ...payload, checksum: "" };
  const data = JSON.stringify(clone);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

export const serializeFlow3D = async (payload: Flow3DFile): Promise<string> => {
  const checksum = await computeChecksum(payload);
  const updated: Flow3DFile = {
    ...payload,
    timestamps: {
      ...payload.timestamps,
      updated_at: new Date().toISOString()
    },
    checksum
  };
  return JSON.stringify(updated, null, 2);
};

export const verifyChecksum = (payload: Flow3DFile, computed: string): boolean =>
  payload.checksum === computed;
