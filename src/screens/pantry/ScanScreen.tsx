import React, { useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { usePantry } from "../../hooks/usePantry";
import { scanApi } from "../../api/scan";
import { scannedItemToPantryItem } from "./scanLogic";
import { Screen, Header, Button, Pill, Card } from "../../components";
import { spacing, typography, radius } from "../../theme";
import { NewPantryItem } from "../../types";
import { PantryStackParamList } from "../../navigation/types";

type ScanMode = "receipt" | "barcode";
type ScanState = "idle" | "processing" | "review" | "error";
type ScanNavigationProp = NativeStackNavigationProp<PantryStackParamList, "Scan">;

export function ScanScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<ScanNavigationProp>();
  const { addItem } = usePantry();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [mode, setMode] = useState<ScanMode>("receipt");
  const [state, setState] = useState<ScanState>("idle");
  const [reviewItems, setReviewItems] = useState<NewPantryItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const reset = () => {
    setState("idle");
    setReviewItems([]);
    setErrorMessage("");
  };

  const handleCaptureReceipt = async () => {
    if (!cameraRef.current) return;
    setState("processing");
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (!photo?.uri) throw new Error("Couldn't capture that photo. Please try again.");

      // The backend can't read a photo directly - it's a receipt-line text
      // parser, not an image reader - so text has to be extracted
      // on-device first and sent as text/lines instead of the image itself.
      const { text } = await TextRecognition.recognize(photo.uri);
      if (!text.trim()) {
        throw new Error(
          "Couldn't read any text from that photo. Try better lighting or getting closer."
        );
      }

      const result = await scanApi.process({ text });
      setReviewItems((result.items ?? []).map(scannedItemToPantryItem));
      setState("review");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Couldn't process that receipt.");
      setState("error");
    }
  };

  const handleRemoveReviewItem = (index: number) => {
    setReviewItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditReviewItem = (index: number) => {
    const item = reviewItems[index];
    setReviewItems((prev) => prev.filter((_, i) => i !== index));
    navigation.navigate("AddPantryItem", {
      prefill: {
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
      },
    });
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

      {state === "idle" && mode === "barcode" ? (
        <View style={styles.noticeWrapper}>
          <Text style={[styles.noticeText, { color: colors.warning }]}>
            Barcode scanning isn't working yet — the server can look up
            item names from receipt text, but not from a barcode number,
            so a scan attempt here will fail.
          </Text>
          <Button
            label="Add item manually instead"
            variant="outline"
            onPress={() => navigation.navigate("AddPantryItem")}
            style={styles.noticeButton}
          />
        </View>
      ) : null}

      {state === "idle" && mode === "receipt" ? (
        <View style={styles.cameraWrapper}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" autofocus="on" enableTorch={torchOn} />
          <View style={styles.frameOverlay} pointerEvents="box-none">
            <View style={[styles.frame, { borderColor: colors.surface }]} pointerEvents="none" />
            <Text style={[styles.overlayHint, { color: colors.surface }]} pointerEvents="none">
              Fit the receipt in frame
            </Text>
            <Pressable
              style={[styles.torchButton, { backgroundColor: colors.overlay }]}
              onPress={() => setTorchOn((prev) => !prev)}
              accessibilityRole="button"
              accessibilityLabel={torchOn ? "Turn off flashlight" : "Turn on flashlight"}
            >
              <Ionicons name={torchOn ? "flash" : "flash-off"} size={20} color={colors.surface} />
            </Pressable>
          </View>
          <View style={styles.captureRow}>
            <Button label="Capture receipt" onPress={handleCaptureReceipt} />
          </View>
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
            <ScrollView contentContainerStyle={styles.reviewList}>
              <Text style={[styles.reviewHint, { color: colors.textMuted }]}>
                Double-check these before adding — tap the pencil to fix anything the scan got wrong.
              </Text>
              {reviewItems.map((item, index) => (
                <Card key={`${item.name}-${index}`} style={styles.reviewCard}>
                  <View style={styles.reviewCardRow}>
                    <View style={styles.reviewCardInfo}>
                      <Text style={[styles.reviewTitle, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.reviewMeta, { color: colors.textMuted }]}>
                        {item.quantity} {item.unit} · {item.category}
                      </Text>
                    </View>
                    <View style={styles.reviewCardActions}>
                      <Pressable
                        onPress={() => handleEditReviewItem(index)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`Edit ${item.name}`}
                      >
                        <Ionicons name="pencil-outline" size={18} color={colors.primary} />
                      </Pressable>
                      <Pressable
                        onPress={() => handleRemoveReviewItem(index)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${item.name} from scan results`}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.danger} />
                      </Pressable>
                    </View>
                  </View>
                </Card>
              ))}
            </ScrollView>
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
  noticeWrapper: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  noticeText: {
    ...typography.caption,
  },
  noticeButton: {
    marginTop: spacing.sm,
    alignSelf: "flex-start",
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
  torchButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    borderRadius: radius.pill,
    padding: spacing.sm,
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
  reviewList: {
    paddingBottom: spacing.sm,
  },
  reviewHint: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  reviewCard: {
    marginBottom: spacing.sm,
  },
  reviewCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewCardInfo: {
    flexShrink: 1,
  },
  reviewCardActions: {
    flexDirection: "row",
    gap: spacing.md,
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
