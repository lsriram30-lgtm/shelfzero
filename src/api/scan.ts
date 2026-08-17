import { apiClient } from "./client";
import { ScanResult } from "../types";

export type ScanPayload = {
  // The backend is a receipt-line text parser, not an image/barcode
  // reader (confirmed live) - it needs already-extracted text, either
  // as one block or pre-split into lines.
  text?: string;
  lines?: string[];
};

export const scanApi = {
  process: (payload: ScanPayload) => apiClient.post<ScanResult>("/api/scan", payload),
};
