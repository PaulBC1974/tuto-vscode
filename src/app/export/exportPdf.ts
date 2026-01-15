import jsPDF from "jspdf";
import QRCode from "qrcode";
import type { Flow3DAsset, Flow3DNode } from "../types/flow3d";
import type { Camera, Scene, WebGLRenderer } from "three";
import { captureViewport } from "./viewportCapture";

interface ExportPdfPayload {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: Camera;
  nodes: Flow3DNode[];
  assets: Flow3DAsset[];
}

const sortByCreatedAt = <T extends { createdAt: string }>(items: T[]) =>
  [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

export const exportFlux3DPdf = async ({
  renderer,
  scene,
  camera,
  nodes,
  assets
}: ExportPdfPayload) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
  const cover = captureViewport(renderer, scene, camera, 2);
  doc.addImage(cover, "PNG", 20, 20, 760, 420, undefined, "FAST");

  const orderedNodes = sortByCreatedAt(nodes);
  const orderedAssets = sortByCreatedAt(assets);

  if (orderedNodes.length || orderedAssets.length) {
    doc.addPage();
    doc.text("Anexos técnicos", 20, 30);
  }

  let cursorY = 60;
  orderedNodes.forEach((node) => {
    doc.text(`Objeto: ${node.name} (${node.createdAt})`, 20, cursorY);
    cursorY += 20;
  });

  for (const asset of orderedAssets) {
    if (cursorY > 480) {
      doc.addPage();
      cursorY = 30;
    }
    doc.text(`Asset: ${asset.name} (${asset.type})`, 20, cursorY);
    cursorY += 16;
    if (asset.type === "youtube") {
      const thumbnailUrl = `https://img.youtube.com/vi/${asset.metadata?.youtubeId ?? ""}/hqdefault.jpg`;
      doc.text(`Miniatura: ${thumbnailUrl}`, 40, cursorY);
      cursorY += 16;
      const qrData = await QRCode.toDataURL(asset.metadata?.url ?? "");
      doc.addImage(qrData, "PNG", 40, cursorY, 64, 64);
      cursorY += 80;
    }
    if (asset.type === "document") {
      doc.text(`Estado: ${asset.metadata?.status ?? "pendiente"}`, 40, cursorY);
      cursorY += 16;
    }
  }

  doc.save("flux3d-export.pdf");
};
