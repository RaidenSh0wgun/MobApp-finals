import { fetchAccounts, fetchTransactions } from "@/db/api/bank";
import type { BankAccountView, TransactionView } from "@/db/banking";
import { formatPeso, formatTxDate } from "@/utils/formatCurrency";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AccountDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [account, setAccount] = useState<BankAccountView | null>(null);
  const [transactions, setTransactions] = useState<TransactionView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const run = async () => {
        if (!id) {
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const accountsRes = await fetchAccounts();
        if (cancelled) {
          return;
        }

        if (!accountsRes.ok) {
          setError(accountsRes.message);
          setAccount(null);
          setTransactions([]);
          setLoading(false);
          return;
        }

        const found = accountsRes.data.find((item) => item.id === id) ?? null;
        setAccount(found);

        if (!found) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        const txRes = await fetchTransactions(id);
        if (cancelled) {
          return;
        }

        if (!txRes.ok) {
          setError(txRes.message);
          setTransactions([]);
        } else {
          setTransactions(txRes.data);
        }

        setLoading(false);
      };

      void run();

      return () => {
        cancelled = true;
      };
    }, [id]),
  );

  if (loading) {
    return (
      <View className="flex-1 bg-slate-100 justify-center items-center">
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  if (!account) {
    return (
      <View className="flex-1 bg-slate-100 px-4 py-4 justify-center items-center">
        <Text className="text-lg text-slate-900 mb-3">Account not found</Text>
        {error ? <Text className="text-red-600 mb-3 text-center">{error}</Text> : null}
        <TouchableOpacity onPress={() => router.back()} className="rounded-lg border border-slate-300 px-6 py-3">
          <Text className="text-slate-900">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-100">
      <View className="bg-[#dc2626]" style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}>
        <View className="flex-row items-center px-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2" hitSlop={12}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-semibold text-white">Account Transactions</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View className="items-center bg-white px-6 py-8">
          <MaterialIcons name="account-balance" size={48} color="#2563eb" />
          <Text className="mt-3 text-lg font-bold text-[#2563eb]">{account.label}</Text>
          <Text className="text-base text-slate-500">{account.code}</Text>
          <Text className="mt-3 text-3xl font-bold text-slate-900">{formatPeso(account.balance)}</Text>
        </View>

        {error ? <Text className="px-4 py-2 text-red-600">{error}</Text> : null}

        <View className="mt-2 rounded-t-3xl bg-slate-200 px-4 pb-8 pt-4">
          {transactions.map((item) => {
            const positive = item.amount >= 0;
            return (
              <View
                key={item.id}
                className="mb-3 flex-row items-center rounded-2xl bg-white p-4"
              >
                <View
                  className={`h-11 w-11 items-center justify-center rounded-full ${positive ? "bg-[#2563eb]" : "bg-red-500"}`}
                >
                  <MaterialIcons
                    name={positive ? "north-east" : "south-west"}
                    size={22}
                    color="#fff"
                  />
                </View>
                <View className="min-w-0 flex-1 pl-3">
                  <Text className="font-bold text-[#2563eb]" numberOfLines={2}>
                    {item.description.toUpperCase()}
                  </Text>
                  <Text className="text-sm text-slate-500">{formatTxDate(item.date)}</Text>
                </View>
                <Text
                  className={`text-base font-bold ${positive ? "text-emerald-600" : "text-red-600"}`}
                >
                  {positive ? "+ " : "- "}
                  {formatPeso(Math.abs(item.amount))}
                </Text>
              </View>
            );
          })}
          {transactions.length === 0 && !error ? (
            <Text className="py-4 text-center text-slate-500">No transactions yet.</Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
