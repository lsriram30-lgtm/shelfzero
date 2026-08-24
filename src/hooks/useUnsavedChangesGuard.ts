import { useEffect, useRef } from "react";
import { Alert } from "react-native";

interface GuardedNavigation {
  addListener: (
    event: "beforeRemove",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (e: { preventDefault: () => void; data: { action: any } }) => void
  ) => () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: (action: any) => void;
}

// Intercepts leaving the screen (swipe-back, Android back button, or a
// programmatic goBack elsewhere) while isDirty is true, and confirms first
// instead of silently discarding whatever was typed. Returns an
// `allowLeave` function - call it right before any goBack() that follows a
// successful save/delete, so that expected navigation isn't itself
// second-guessed by the same prompt.
export function useUnsavedChangesGuard(navigation: GuardedNavigation, isDirty: boolean) {
  const bypassRef = useRef(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!isDirty || bypassRef.current) return;
      e.preventDefault();
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Leaving now will discard them.",
        [
          { text: "Keep editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]
      );
    });
    return unsubscribe;
  }, [navigation, isDirty]);

  return () => {
    bypassRef.current = true;
  };
}
