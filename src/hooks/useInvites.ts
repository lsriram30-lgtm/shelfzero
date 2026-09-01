import { useCallback, useEffect, useRef, useState } from "react";
import { invitesApi } from "../api";
import { HouseholdInvite, NewInvite } from "../types";
import { useNotificationPreferences } from "../context/NotificationPreferencesContext";
import { notifyInviteAccepted } from "../notifications/expiryNotifications";

export function useInvites() {
  const [invites, setInvites] = useState<HouseholdInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousRef = useRef<HouseholdInvite[] | null>(null);
  const { notifyInvites } = useNotificationPreferences();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invitesApi.list();
      const previous = previousRef.current;
      if (previous) {
        data.forEach((invite) => {
          const before = previous.find((p) => p.id === invite.id);
          if (before && before.status === "pending" && invite.status === "accepted") {
            notifyInviteAccepted(invite.name, notifyInvites).catch(() => {});
          }
        });
      }
      previousRef.current = data;
      setInvites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invites");
    } finally {
      setLoading(false);
    }
  }, [notifyInvites]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createInvite = useCallback(async (invite: NewInvite) => {
    const created = await invitesApi.create(invite);
    setInvites((prev) => [created, ...prev]);
    return created;
  }, []);

  const cancelInvite = useCallback(async (id: string) => {
    await invitesApi.cancel(id);
    setInvites((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { invites, loading, error, refresh, createInvite, cancelInvite };
}
