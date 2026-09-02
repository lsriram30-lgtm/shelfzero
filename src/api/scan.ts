import { apiClient } from "./client";
import { BarcodeLookupResponse, ScanResult } from "../types";

export type ScanPayload = {
  type: "receipt" | "barcode";
  imageBase64?: string;
  code?: string;
};

export const scanApi = {
  process: (payload: ScanPayload) => apiClient.post<ScanResult>("/api/scan", payload),
  // A separate public endpoint (no auth required), not a variant of
  // POST /api/scan - confirmed live that /api/scan still only ever
  // accepts a receipt's "text"/"lines", regardless of payload shape.
  lookupBarcode: (code: string) =>
    apiClient.get<BarcodeLookupResponse>(`/api/barcode/${code}`),
};
