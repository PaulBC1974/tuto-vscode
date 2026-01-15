import { v4 as uuidv4 } from "uuid";
import type { Flow3DAsset } from "../types/flow3d";

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const buildAsset = async (file: File, type: Flow3DAsset["type"]): Promise<Flow3DAsset> => {
  const dataBase64 = await fileToBase64(file);
  return {
    id: uuidv4(),
    type,
    name: file.name,
    mime: file.type,
    dataBase64,
    createdAt: new Date().toISOString()
  };
};
