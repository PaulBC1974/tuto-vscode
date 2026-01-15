import { OrbitControls } from "@react-three/drei";
import { useFluxStore } from "../store/useFluxStore";

export const CameraControls = () => {
  const camera = useFluxStore((state) => state.camera);
  return (
    <OrbitControls
      target={camera.target}
      enablePan
      enableZoom
      enableRotate
      makeDefault
    />
  );
};
