import type { Flow3DFile } from "../types/flow3d";
import type { FluxSnapshot } from "../store/useFluxStore";
import { createEmptyFlow3D } from "./flow3dSchema";
import { computeChecksum, serializeFlow3D, verifyChecksum } from "./flow3dSerializer";

export const buildFlow3DFromState = (snapshot: FluxSnapshot): Flow3DFile => {
  const base = createEmptyFlow3D();
  return {
    ...base,
    camera: snapshot.camera,
    layers: snapshot.layers,
    nodes: snapshot.nodes,
    arrows: snapshot.arrows,
    assets: snapshot.assets
  };
};

export const downloadFlow3D = async (snapshot: FluxSnapshot, filename = "scene.flow3d") => {
  const payload = buildFlow3DFromState(snapshot);
  const data = await serializeFlow3D(payload);
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const parseFlow3D = async (raw: string): Promise<Flow3DFile> => {
  const parsed = JSON.parse(raw) as Flow3DFile;
  const computed = await computeChecksum(parsed);
  if (!verifyChecksum(parsed, computed)) {
    throw new Error("Checksum inválido");
  }
  return parsed;
};
