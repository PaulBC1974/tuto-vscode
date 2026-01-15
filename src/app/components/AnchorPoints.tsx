import { useMemo } from "react";
import { useFluxStore } from "../store/useFluxStore";
import type { Flow3DNode } from "../types/flow3d";

interface AnchorPointsProps {
  node: Flow3DNode;
}

const buildGrid = (width: number, height: number, offset: [number, number, number]) => {
  const points: [number, number, number][] = [];
  const cols = 5;
  const rows = 3;
  for (let x = 0; x < cols; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      const px = (x / (cols - 1) - 0.5) * width + offset[0];
      const py = (y / (rows - 1) - 0.5) * height + offset[1];
      points.push([px, py, offset[2]]);
    }
  }
  return points;
};

export const AnchorPoints = ({ node }: AnchorPointsProps) => {
  const addArrow = useFluxStore((state) => state.addArrow);
  const activeAnchor = useFluxStore((state) => state.activeAnchor);
  const setActiveAnchor = useFluxStore((state) => state.setActiveAnchor);

  const points = useMemo(() => {
    const [width, height, depth] = node.transform.scale;
    return [
      ...buildGrid(width, height, [0, 0, depth / 2]),
      ...buildGrid(width, height, [0, 0, -depth / 2]),
      ...buildGrid(depth, height, [width / 2, 0, 0]),
      ...buildGrid(depth, height, [-width / 2, 0, 0]),
      ...buildGrid(width, depth, [0, height / 2, 0]),
      ...buildGrid(width, depth, [0, -height / 2, 0])
    ];
  }, [node.transform.scale]);

  const handleAnchorClick = () => {
    if (!activeAnchor) {
      setActiveAnchor(node.id);
      return;
    }
    if (activeAnchor !== node.id) {
      addArrow(activeAnchor, node.id);
    }
    setActiveAnchor(null);
  };

  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={point} onClick={handleAnchorClick}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={activeAnchor ? "#F97316" : "#38BDF8"} />
        </mesh>
      ))}
    </group>
  );
};
