import { apiClient } from "./client";
import { ScanResult } from "../types";

export type ScanPayload = {
  type: "receipt" | "barcode";
  imageBase64?: string;
  code?: string;
};

export const scanApi = {
  process: (payload: ScanPayload) => apiClient.post<ScanResult>("/api/scan", payload),
};
