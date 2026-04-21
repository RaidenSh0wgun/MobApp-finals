import { useBankAccounts } from "@/hooks/useBankAccounts";
import { formatPeso } from "@/utils/formatCurrency";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function Home() {
  const { accounts, loading, error } = useBankAccounts();

  if (loading) {
    return (
      <View className="flex-1 bg-slate-100 px-4 py-4 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-slate-600 mt-3">Loading…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-100 px-4 pt-4">
      {error ? <Text className="text-red-600 mb-3">{error}</Text> : null}
      <View className="gap-3 pb-6">
        {accounts.map((account) => (
          <TouchableOpacity
            key={account.id}
            onPress={() => router.push(`/account/${account.id}`)}
            className="rounded-xl border border-slate-200 bg-white p-4"
            activeOpacity={0.9}
          >
            <Text className="text-lg font-bold uppercase text-[#2563eb]">{account.label}</Text>
            <Text className="text-sm text-slate-500">{account.code}</Text>
            <Text className="text-sm text-slate-900">{account.type}</Text>
            <Text className="mt-1 text-xl font-bold text-slate-900">{formatPeso(account.balance)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {!error && accounts.length === 0 ? (
        <Text className="text-slate-500">No accounts yet. Open User Options → Manage Accounts.</Text>
      ) : null}
    </View>
  );
}
