import React, { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { usePantry } from "../../hooks/usePantry";
import { scanApi } from "../../api/scan";
import { Screen, Header, Button, Pill, Card } from "../../components";
import { spacing, typography, radius } from "../../theme";
import { NewPantryItem } from "../../types";

type ScanMode = "receipt" | "barcode";
type ScanState = "idle" | "processing" | "review" | "error";

export function ScanScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { addItem } = usePantry();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [mode, setMode] = useState<ScanMode>("receipt");
  const [state, setState] = useState<ScanState>("idle");
  const [reviewItems, setReviewItems] = useState<NewPantryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const barcodeLocked = useRef(false);

  const reset = () => {
    setState("idle");
    setReviewItems([]);
    setErrorMessage("");
    barcodeLocked.current = false;
  };

  const handleCaptureReceipt = async () => {
    if (!cameraRef.current) return;
    setState("processing");
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      const result = await scanApi.process({
        type: "receipt",
        imageBase64: photo?.base64 ?? undefined,
      });
      setReviewItems(result.items ?? []);
      setState("review");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Couldn't process that receipt.");
      setState("error");
    }
  };

  const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
    if (barcodeLocked.current) return;
    barcodeLocked.current = true;
    setState("processing");
    try {
      const scanResult = await scanApi.process({ type: "barcode", code: result.data });
      setReviewItems(scanResult.items ?? []);
      setState("review");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Couldn't identify that barcode.");
      setState("error");
    }
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      for (const item of reviewItems) {
        await addItem(item);
      }
      navigation.goBack();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Couldn't save those items.");
      setState("error");
    } finally {
      setSaving(false);
    }
  };

  if (!permission) {
    return (
      <Screen>
        <Header title="Scan" />
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Header title="Scan" subtitle="Camera access is needed to scan receipts and barcodes." />
        <View style={styles.center}>
          <Button label="Grant camera access" onPress={requestPermission} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Scan" subtitle="Add pantry items from a receipt or barcode" />

      <View style={styles.modeRow}>
        <Pill label="Receipt" selected={mode === "receipt"} onPress={() => { setMode("receipt"); reset(); }} />
        <Pill label="Barcode" selected={mode === "barcode"} onPress={() => { setMode("barcode"); reset(); }} />
      </View>

      {state === "idle" ? (
        <View style={styles.cameraWrapper}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={
              mode === "barcode" ? { barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"] } : undefined
            }
            onBarcodeScanned={mode === "barcode" ? handleBarcodeScanned : undefined}
          />
          <View style={styles.frameOverlay} pointerEvents="none">
            <View style={[styles.frame, { borderColor: colors.surface }]} />
            <Text style={[styles.overlayHint, { color: colors.surface }]}>
              {mode === "receipt" ? "Fit the receipt in frame" : "Center the barcode in frame"}
            </Text>
          </View>
          {mode === "receipt" ? (
            <View style={styles.captureRow}>
              <Button label="Capture receipt" onPress={handleCaptureReceipt} />
            </View>
          ) : null}
        </View>
      ) : null}

      {state === "processing" ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.statusText, { color: colors.textMuted }]}>Reading scan…</Text>
        </View>
      ) : null}

      {state === "review" ? (
        <View style={styles.reviewWrapper}>
          {reviewItems.length === 0 ? (
            <Text style={[styles.statusText, { color: colors.textMuted }]}>
              We couldn't detect any items. Try again or add items manually.
            </Text>
          ) : (
            reviewItems.map((item, index) => (
              <Card key={`${item.name}-${index}`} style={styles.reviewCard}>
                <Text style={[styles.reviewTitle, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.reviewMeta, { color: colors.textMuted }]}>
                  {item.quantity} {item.unit} · {item.category}
                </Text>
              </Card>
            ))
          )}
          <View style={styles.reviewActions}>
            <Button label="Rescan" variant="outline" onPress={reset} style={styles.reviewButton} />
            <Button
              label={saving ? "Saving…" : "Add to pantry"}
              onPress={handleConfirm}
              disabled={reviewItems.length === 0 || saving}
              loading={saving}
              style={styles.reviewButton}
            />
          </View>
        </View>
      ) : null}

      {state === "error" ? (
        <View style={styles.center}>
          <Text style={[styles.statusText, { color: colors.danger }]}>{errorMessage}</Text>
          <Button label="Try again" onPress={reset} style={styles.retryButton} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  modeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  cameraWrapper: {
    flex: 1,
    marginHorizontal: spacing.xl,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  frameOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: "80%",
    height: "50%",
    borderWidth: 2,
    borderRadius: radius.md,
  },
  overlayHint: {
    ...typography.caption,
    marginTop: spacing.md,
  },
  captureRow: {
    position: "absolute",
    bottom: spacing.xl,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  statusText: {
    ...typography.body,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.sm,
  },
  reviewWrapper: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  reviewCard: {
    marginBottom: spacing.sm,
  },
  reviewTitle: {
    ...typography.bodyMedium,
  },
  reviewMeta: {
    ...typography.caption,
    marginTop: spacing.xs / 2,
  },
  reviewActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  reviewButton: {
    flex: 1,
  },
});
