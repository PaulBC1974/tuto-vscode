import { Grid } from "@react-three/drei";
import { useFluxStore } from "../store/useFluxStore";
import { Node3D } from "./Node3D";
import { Edge3D } from "./Edge3D";

export const Scene = () => {
  const nodes = useFluxStore((state) => state.nodes);
  const arrows = useFluxStore((state) => state.arrows);
  const showGrid = useFluxStore((state) => state.showGrid);
  const selection = useFluxStore((state) => state.selection);
  const selectedNode = nodes.find((node) => selection.nodeIds.includes(node.id));

  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      {showGrid ? (
        <Grid
          args={[20, 20]}
          cellColor="#1f2937"
          sectionColor="#334155"
          fadeDistance={30}
          fadeStrength={1}
        />
      ) : null}
      {arrows.map((arrow) => (
        <Edge3D key={arrow.id} arrow={arrow} nodes={nodes} />
      ))}
      {selectedNode ? <axesHelper args={[2]} position={selectedNode.transform.position} /> : null}
      {nodes.map((node) => (
        <Node3D key={node.id} node={node} />
      ))}
    </group>
  );
};
