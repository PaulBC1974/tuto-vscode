import { Html } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Mesh, Vector3 } from "three";
import { useFluxStore } from "../store/useFluxStore";
import type { Flow3DNode } from "../types/flow3d";
import { Symbol2D } from "./Symbol2D";
import { AnchorPoints } from "./AnchorPoints";

interface Node3DProps {
  node: Flow3DNode;
}

const dragScale = 0.01;

export const Node3D = ({ node }: Node3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const [dragging, setDragging] = useState(false);
  const [inspect, setInspect] = useState(false);
  const [hovered, setHovered] = useState(false);
  const updateNodePosition = useFluxStore((state) => state.updateNodePosition);
  const setSelection = useFluxStore((state) => state.setSelection);
  const tool = useFluxStore((state) => state.tool);

  const position = useMemo(() => new Vector3(...node.transform.position), [node]);

  const handlePointerDown = (event: PointerEvent) => {
    event.stopPropagation();
    if (event.ctrlKey) {
      setInspect((value) => !value);
      return;
    }
    setSelection([node.id]);
    setDragging(true);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    event.stopPropagation();
    const deltaX = event.movementX * dragScale;
    const deltaY = -event.movementY * dragScale;
    if (event.shiftKey) {
      updateNodePosition(node.id, [0, 0, deltaY]);
    } else {
      updateNodePosition(node.id, [deltaX, deltaY, 0]);
    }
  };

  return (
    <group position={position.toArray()}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={node.transform.scale} />
        <meshStandardMaterial color={hovered ? "#38BDF8" : "#1f2937"} />
      </mesh>
      <Symbol2D symbol={node.symbol} />
      <Html distanceFactor={10} position={[0, 0.8, 0]}>
        <div style={{ color: "#e2e8f0", fontSize: 12 }}>{node.name}</div>
      </Html>
      {tool === "arrow" && hovered ? <AnchorPoints node={node} /> : null}
      {inspect ? (
        <group position={[0, -0.8, 0]}>
          {Array.from({ length: 6 }).map((_, index) => (
            <mesh key={index} position={[index * 0.35 - 0.9, 0, 0]}>
              <planeGeometry args={[0.3, 0.3]} />
              <meshBasicMaterial color="#93C5FD" />
            </mesh>
          ))}
        </group>
      ) : null}
    </group>
  );
};
