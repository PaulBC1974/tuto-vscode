import { Html } from "@react-three/drei";
import type { Flow3DSymbol } from "../types/flow3d";

interface Symbol2DProps {
  symbol: Flow3DSymbol;
}

export const Symbol2D = ({ symbol }: Symbol2DProps) => {
  return (
    <Html position={[0, 0.6, 0]} distanceFactor={12}>
      <div className={`symbol ${symbol.type}`}>
        {symbol.type === "diamond" ? (
          <span style={{ transform: "rotate(-45deg)" }}>{symbol.label}</span>
        ) : symbol.type === "triangle" ? (
          ""
        ) : (
          symbol.label
        )}
      </div>
    </Html>
  );
};
