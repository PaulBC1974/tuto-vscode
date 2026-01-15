import type { Camera, Scene, WebGLRenderer } from "three";

export const captureViewport = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  scale = 2
): string => {
  const currentPixelRatio = renderer.getPixelRatio();
  renderer.setPixelRatio(scale);
  renderer.render(scene, camera);
  const dataUrl = renderer.domElement.toDataURL("image/png");
  renderer.setPixelRatio(currentPixelRatio);
  return dataUrl;
};
