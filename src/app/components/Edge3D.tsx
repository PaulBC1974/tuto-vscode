import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import type { Flow3DArrow, Flow3DNode } from "../types/flow3d";

interface Edge3DProps {
  arrow: Flow3DArrow;
  nodes: Flow3DNode[];
}

export const Edge3D = ({ arrow, nodes }: Edge3DProps) => {
  const { camera } = useThree();
  const points = useMemo(() => {
    const fromNode = nodes.find((node) => node.id === arrow.from);
    const toNode = nodes.find((node) => node.id === arrow.to);
    if (!fromNode || !toNode) {
      return [
        [0, 0, 0],
        [0, 0, 0]
      ];
    }
    return [fromNode.transform.position, toNode.transform.position];
  }, [arrow.from, arrow.to, nodes]);

  const lineWidth = Math.max(1, arrow.style.width * camera.position.length() * 6);

  return <Line points={points} color={arrow.style.color} lineWidth={lineWidth} />;
};
