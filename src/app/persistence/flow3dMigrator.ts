import type { Flow3DFile } from "../types/flow3d";
import { SCHEMA_VERSION } from "./flow3dSchema";

export const migrateFlow3D = (file: Flow3DFile): Flow3DFile => {
  if (file.schema_version === SCHEMA_VERSION) {
    return file;
  }

  const updated: Flow3DFile = {
    ...file,
    schema_version: SCHEMA_VERSION,
    timestamps: {
      ...file.timestamps,
      updated_at: new Date().toISOString()
    }
  };

  return updated;
};
