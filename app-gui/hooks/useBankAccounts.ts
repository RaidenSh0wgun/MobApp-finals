import { fetchAccounts } from "@/db/api/bank";
import { deleteSecureItemAsync } from "@/db/api/secureStore";
import type { BankAccountView } from "@/db/banking";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export function useBankAccounts() {
  const [accounts, setAccounts] = useState<BankAccountView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAccounts();
    if (result.ok) {
      setAccounts(result.data);
    } else {
      if (result.message === "Unauthenticated.") {
        await deleteSecureItemAsync("session");
        router.replace("/");
        return;
      }
      setError(result.message);
      setAccounts([]);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return { accounts, loading, error, reload: load };
}
