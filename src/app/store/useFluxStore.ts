import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Camera, Scene, WebGLRenderer } from "three";
import type { Flow3DAsset, Flow3DNode, Flow3DArrow, Flow3DLayer } from "../types/flow3d";

export type ToolMode = "select" | "arrow" | "media";

export interface FluxSnapshot {
  nodes: Flow3DNode[];
  arrows: Flow3DArrow[];
  layers: Flow3DLayer[];
  assets: Flow3DAsset[];
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
}

interface FluxState {
  nodes: Flow3DNode[];
  arrows: Flow3DArrow[];
  layers: Flow3DLayer[];
  assets: Flow3DAsset[];
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
  selection: {
    nodeIds: string[];
  };
  tool: ToolMode;
  showGrid: boolean;
  activeAnchor: string | null;
  renderer: WebGLRenderer | null;
  sceneRef: Scene | null;
  cameraRef: Camera | null;
  setRenderer: (renderer: WebGLRenderer) => void;
  setSceneRef: (scene: Scene) => void;
  setCameraRef: (camera: Camera) => void;
  setTool: (tool: ToolMode) => void;
  toggleGrid: () => void;
  setSelection: (nodeIds: string[]) => void;
  setActiveAnchor: (nodeId: string | null) => void;
  addNode: (partial?: Partial<Flow3DNode>) => void;
  updateNodePosition: (id: string, delta: [number, number, number]) => void;
  rotateSelected: (deltaY: number) => void;
  addArrow: (from: string, to: string) => void;
  addAsset: (asset: Flow3DAsset) => void;
  removeAsset: (assetId: string) => void;
  updateAssetMetadata: (assetId: string, metadata: Record<string, string>) => void;
  loadSnapshot: (snapshot: FluxSnapshot) => void;
}

const defaultLayerId = uuidv4();

export const useFluxStore = create<FluxState>((set) => ({
  nodes: [
    {
      id: uuidv4(),
      layerId: defaultLayerId,
      name: "Nodo A",
      createdAt: new Date().toISOString(),
      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [3, 1, 1]
      },
      symbol: { type: "diamond", label: "A" }
    }
  ],
  arrows: [],
  layers: [{ id: defaultLayerId, name: "Nivel 0", visible: true }],
  assets: [],
  camera: {
    position: [0, 4, 8],
    target: [0, 0, 0],
    fov: 50
  },
  selection: {
    nodeIds: []
  },
  tool: "select",
  showGrid: true,
  activeAnchor: null,
  renderer: null,
  sceneRef: null,
  cameraRef: null,
  setRenderer: (renderer) => set({ renderer }),
  setSceneRef: (scene) => set({ sceneRef: scene }),
  setCameraRef: (camera) => set({ cameraRef: camera }),
  setTool: (tool) => set({ tool }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setSelection: (nodeIds) => set({ selection: { nodeIds } }),
  setActiveAnchor: (nodeId) => set({ activeAnchor: nodeId }),
  addNode: (partial) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id: uuidv4(),
          layerId: state.layers[0]?.id ?? defaultLayerId,
          name: partial?.name ?? `Nodo ${state.nodes.length + 1}`,
          createdAt: new Date().toISOString(),
          transform: {
            position: partial?.transform?.position ?? [0, 0, 0],
            rotation: partial?.transform?.rotation ?? [0, 0, 0],
            scale: partial?.transform?.scale ?? [3, 1, 1]
          },
          symbol: partial?.symbol ?? { type: "circle", label: "N" }
        }
      ]
    })),
  updateNodePosition: (id, delta) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              transform: {
                ...node.transform,
                position: [
                  node.transform.position[0] + delta[0],
                  node.transform.position[1] + delta[1],
                  node.transform.position[2] + delta[2]
                ]
              }
            }
          : node
      )
    })),
  rotateSelected: (deltaY) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        state.selection.nodeIds.includes(node.id)
          ? {
              ...node,
              transform: {
                ...node.transform,
                rotation: [
                  node.transform.rotation[0],
                  node.transform.rotation[1] + deltaY,
                  node.transform.rotation[2]
                ]
              }
            }
          : node
      )
    })),
  addArrow: (from, to) =>
    set((state) => ({
      arrows: [
        ...state.arrows,
        {
          id: uuidv4(),
          from,
          to,
          style: { color: "#38BDF8", width: 0.02 }
        }
      ]
    })),
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
  removeAsset: (assetId) =>
    set((state) => ({ assets: state.assets.filter((asset) => asset.id !== assetId) })),
  updateAssetMetadata: (assetId, metadata) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId ? { ...asset, metadata: { ...asset.metadata, ...metadata } } : asset
      )
    })),
  loadSnapshot: (snapshot) =>
    set({
      nodes: snapshot.nodes,
      arrows: snapshot.arrows,
      layers: snapshot.layers,
      assets: snapshot.assets,
      camera: snapshot.camera
    })
}));
