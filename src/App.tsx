import { useEffect } from "react";
import type { DragEvent } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./app/components/Scene";
import { CameraControls } from "./app/components/CameraControls";
import { LayerPanel } from "./app/components/LayerPanel";
import { Toolbar } from "./app/components/Toolbar";
import { useFluxStore } from "./app/store/useFluxStore";

export const App = () => {
  const setRenderer = useFluxStore((state) => state.setRenderer);
  const setSceneRef = useFluxStore((state) => state.setSceneRef);
  const setCameraRef = useFluxStore((state) => state.setCameraRef);
  const rotateSelected = useFluxStore((state) => state.rotateSelected);
  const addNode = useFluxStore((state) => state.addNode);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        rotateSelected(0.1);
      }
      if (event.key === "ArrowDown") {
        rotateSelected(-0.1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rotateSelected]);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = -((event.clientY - rect.top) / rect.height - 0.5) * 6;
    addNode({ transform: { position: [x, y, 0], rotation: [0, 0, 0], scale: [3, 1, 1] } });
  };

  return (
    <div className="app-shell">
      <Toolbar />
      <div className="workspace">
        <LayerPanel />
        <div
          className="viewport"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <Canvas
            camera={{ position: [0, 4, 8], fov: 50 }}
            onCreated={({ gl, scene, camera }) => {
              setRenderer(gl);
              setSceneRef(scene);
              setCameraRef(camera);
            }}
          >
            <color attach="background" args={["#0B0F1A"]} />
            <CameraControls />
            <Scene />
          </Canvas>
        </div>
      </div>
    </div>
  );
};
