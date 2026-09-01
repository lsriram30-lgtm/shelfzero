import { useCallback, useEffect, useState } from "react";
import { householdApi } from "../api/household";
import { HouseholdMember } from "../types";

export function useHouseholdMembers() {
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await householdApi.members();
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load household members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const removeMember = useCallback(async (id: string) => {
    await householdApi.removeMember(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { members, loading, error, refresh, removeMember };
}
