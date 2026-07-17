import { useCallback, useEffect, useState } from "react";
import { invitesApi } from "../api";
import { HouseholdInvite, NewInvite } from "../types";

export function useInvites() {
  const [invites, setInvites] = useState<HouseholdInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invitesApi.list();
      setInvites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invites");
    } finally {
      setLoading(false);
    }
  }, []);

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
