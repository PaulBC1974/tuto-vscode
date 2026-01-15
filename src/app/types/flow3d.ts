export interface Flow3DTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export type SymbolType = "diamond" | "circle" | "triangle";

export interface Flow3DSymbol {
  type: SymbolType;
  label: string;
}

export interface Flow3DNode {
  id: string;
  layerId: string;
  name: string;
  createdAt: string;
  transform: Flow3DTransform;
  symbol: Flow3DSymbol;
}

export interface Flow3DArrow {
  id: string;
  from: string;
  to: string;
  style: {
    color: string;
    width: number;
  };
}

export interface Flow3DLayer {
  id: string;
  name: string;
  visible: boolean;
}

export interface Flow3DAsset {
  id: string;
  type: "image" | "video" | "youtube" | "audio" | "document" | "gif";
  name: string;
  mime: string;
  dataBase64: string;
  createdAt: string;
  metadata?: Record<string, string>;
}

export interface Flow3DFile {
  version_engine: string;
  schema_version: string;
  timestamps: {
    created_at: string;
    updated_at: string;
  };
  checksum: string;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
  layers: Flow3DLayer[];
  nodes: Flow3DNode[];
  arrows: Flow3DArrow[];
  assets: Flow3DAsset[];
}
