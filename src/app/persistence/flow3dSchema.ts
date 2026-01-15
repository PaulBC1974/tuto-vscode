import type { Flow3DFile } from "../types/flow3d";

export const ENGINE_VERSION = "vFinal.Pro";
export const SCHEMA_VERSION = "1.0.0";

export const createEmptyFlow3D = (): Flow3DFile => {
  const timestamp = new Date().toISOString();
  return {
    version_engine: ENGINE_VERSION,
    schema_version: SCHEMA_VERSION,
    timestamps: {
      created_at: timestamp,
      updated_at: timestamp
    },
    checksum: "",
    camera: {
      position: [0, 4, 8],
      target: [0, 0, 0],
      fov: 50
    },
    layers: [],
    nodes: [],
    arrows: [],
    assets: []
  };
};
