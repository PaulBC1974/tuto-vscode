import { useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { useFluxStore } from "../store/useFluxStore";

const palette = ["#38BDF8", "#A78BFA", "#F472B6", "#FBBF24", "#34D399"];

export const LayerPanel = () => {
  const nodes = useFluxStore((state) => state.nodes);
  const assets = useFluxStore((state) => state.assets);
  const removeAsset = useFluxStore((state) => state.removeAsset);
  const updateAssetMetadata = useFluxStore((state) => state.updateAssetMetadata);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; assetId: string } | null>(
    null
  );

  const layersByDepth = useMemo(() => {
    const levels = Array.from(new Set(nodes.map((node) => node.transform.position[2]))).sort(
      (a, b) => a - b
    );
    return levels.map((level, index) => ({
      depth: level,
      color: palette[index % palette.length]
    }));
  }, [nodes]);

  const handleAssetClick = (assetId: string) => {
    setActiveMediaId((current) => (current === assetId ? null : assetId));
  };

  const handleContextMenu = (event: MouseEvent, assetId: string) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, assetId });
  };

  const handleDownload = (assetId: string) => {
    const asset = assets.find((item) => item.id === assetId);
    if (!asset) return;
    const link = document.createElement("a");
    link.href = `data:${asset.mime};base64,${asset.dataBase64}`;
    link.download = asset.name;
    link.click();
    setContextMenu(null);
  };

  const handleEditProps = (assetId: string) => {
    const font = prompt("Fuente (metadata.font):");
    const radius = prompt("Radio (metadata.radius):");
    const margins = prompt("Margenes 9-grid (metadata.margins):");
    updateAssetMetadata(assetId, {
      font: font ?? "",
      radius: radius ?? "",
      margins: margins ?? ""
    });
    setContextMenu(null);
  };

  return (
    <aside className="panel">
      <h2>Capas por profundidad Z</h2>
      {layersByDepth.length === 0 ? (
        <p>No hay capas aún.</p>
      ) : (
        layersByDepth.map((layer) => (
          <div key={layer.depth} className="layer-card">
            <span className="layer-color" style={{ background: layer.color }} />
            Z = {layer.depth.toFixed(2)}
          </div>
        ))
      )}

      <h2>Media</h2>
      {assets.length === 0 ? (
        <p>No hay assets cargados.</p>
      ) : (
        assets.map((asset) => (
          <div
            key={asset.id}
            className="layer-card"
            onClick={() => handleAssetClick(asset.id)}
            onContextMenu={(event) => handleContextMenu(event, asset.id)}
          >
            {asset.name} ({asset.type})
            {activeMediaId === asset.id ? (
              <div style={{ marginTop: 8 }}>
                {asset.type === "image" || asset.type === "gif" ? (
                  <img
                    src={`data:${asset.mime};base64,${asset.dataBase64}`}
                    alt={asset.name}
                    style={{ width: "100%" }}
                  />
                ) : null}
                {asset.type === "audio" ? (
                  <audio controls src={`data:${asset.mime};base64,${asset.dataBase64}`} />
                ) : null}
                {asset.type === "video" ? (
                  <video controls width="100%" src={`data:${asset.mime};base64,${asset.dataBase64}`} />
                ) : null}
                {asset.type === "youtube" ? (
                  <iframe
                    width="100%"
                    height="180"
                    src={asset.metadata?.url}
                    title={asset.name}
                  />
                ) : null}
                {asset.type === "document" ? (
                  <div>
                    <div>Estado: {asset.metadata?.status ?? "pendiente"}</div>
                    <div>Fuente: {asset.metadata?.font ?? ""}</div>
                    <div>Radio: {asset.metadata?.radius ?? ""}</div>
                    <div>Margenes: {asset.metadata?.margins ?? ""}</div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))
      )}
      {contextMenu ? (
        <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <div onClick={() => handleDownload(contextMenu.assetId)}>Descargar</div>
          <div onClick={() => removeAsset(contextMenu.assetId)}>Eliminar</div>
          <div onClick={() => handleEditProps(contextMenu.assetId)}>Editar propiedades</div>
        </div>
      ) : null}
    </aside>
  );
};
