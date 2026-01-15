import { useRef } from "react";
import type { ChangeEvent } from "react";
import { useFluxStore } from "../store/useFluxStore";
import { buildAsset } from "../assets/assetPipeline";
import { exportFlux3DPdf } from "../export/exportPdf";
import { downloadFlow3D, parseFlow3D } from "../persistence/flow3dIO";
import { migrateFlow3D } from "../persistence/flow3dMigrator";

const resolveAssetType = (mime: string) => {
  if (mime === "image/gif") return "gif";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  return "document";
};

export const Toolbar = () => {
  const setTool = useFluxStore((state) => state.setTool);
  const addNode = useFluxStore((state) => state.addNode);
  const toggleGrid = useFluxStore((state) => state.toggleGrid);
  const addAsset = useFluxStore((state) => state.addAsset);
  const renderer = useFluxStore((state) => state.renderer);
  const sceneRef = useFluxStore((state) => state.sceneRef);
  const cameraRef = useFluxStore((state) => state.cameraRef);
  const nodes = useFluxStore((state) => state.nodes);
  const assets = useFluxStore((state) => state.assets);
  const arrows = useFluxStore((state) => state.arrows);
  const layers = useFluxStore((state) => state.layers);
  const camera = useFluxStore((state) => state.camera);
  const loadSnapshot = useFluxStore((state) => state.loadSnapshot);
  const inputRef = useRef<HTMLInputElement>(null);
  const flowRef = useRef<HTMLInputElement>(null);

  const handleAddNode = () => {
    addNode({ transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [3, 1, 1] } });
  };

  const handleAssetInput = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const type = resolveAssetType(file.type);
    const asset = await buildAsset(file, type);
    addAsset(asset);
  };

  const handleExportPdf = async () => {
    if (!renderer || !sceneRef || !cameraRef) return;
    await exportFlux3DPdf({ renderer, scene: sceneRef, camera: cameraRef, nodes, assets });
  };

  const handleExportFlow = async () => {
    await downloadFlow3D({ nodes, arrows, layers, assets, camera });
  };

  const handleImportFlow = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = await parseFlow3D(text);
      const migrated = migrateFlow3D(parsed);
      loadSnapshot({
        nodes: migrated.nodes,
        arrows: migrated.arrows,
        layers: migrated.layers,
        assets: migrated.assets,
        camera: migrated.camera
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al importar .flow3d");
    }
  };

  return (
    <div className="toolbar">
      <button type="button" onClick={() => setTool("select")}>Seleccionar</button>
      <button type="button" onClick={() => setTool("arrow")}>Flecha</button>
      <button type="button" onClick={() => setTool("media")}>Media</button>
      <button type="button" onClick={handleAddNode} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", "node")}>Nuevo bloque</button>
      <button type="button" onClick={toggleGrid}>Grid</button>
      <button type="button" onClick={() => inputRef.current?.click()}>Importar media</button>
      <button type="button" onClick={handleExportPdf}>Export PDF</button>
      <button type="button" onClick={handleExportFlow}>Export .flow3d</button>
      <button type="button" onClick={() => flowRef.current?.click()}>Import .flow3d</button>
      <input ref={inputRef} type="file" hidden onChange={handleAssetInput} />
      <input ref={flowRef} type="file" hidden accept=".flow3d,.json" onChange={handleImportFlow} />
    </div>
  );
};
