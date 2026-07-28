import { Alert } from "react-native";

export function confirmDestructiveAction({
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
}) {
  Alert.alert(title, message, [
    { text: cancelLabel, style: "cancel" },
    { text: confirmLabel, style: "destructive", onPress: onConfirm },
  ]);
}
