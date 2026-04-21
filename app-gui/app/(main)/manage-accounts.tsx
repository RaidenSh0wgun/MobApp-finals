import { useBankAccounts } from "@/hooks/useBankAccounts";
import { formatPeso } from "@/utils/formatCurrency";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ManageAccounts() {
  const insets = useSafeAreaInsets();
  const { accounts, loading, error } = useBankAccounts();

  return (
    <View className="flex-1 bg-slate-100">
      <View className="bg-[#7c3aed] pb-3" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center px-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2" hitSlop={12}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-semibold text-white">Manage Accounts</Text>
          <View className="w-10" />
        </View>
      </View>

      <View className="flex-row justify-end px-4 py-3">
        <TouchableOpacity
          onPress={() => router.push("/create-account")}
          className="rounded-lg bg-[#15803d] px-4 py-2 active:opacity-90"
        >
          <Text className="font-semibold text-white">+ Add an account</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {loading ? (
          <View className="py-10 items-center">
            <ActivityIndicator size="large" color="#7c3aed" />
          </View>
        ) : null}
        {error ? <Text className="mb-3 text-red-600">{error}</Text> : null}
        <View className="gap-3">
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              activeOpacity={0.85}
              onPress={() => router.push(`/account/${account.id}`)}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <Text className="text-lg font-bold uppercase text-[#2563eb]">{account.label}</Text>
              <Text className="text-sm text-[#2563eb]">{account.code}</Text>
              <Text className="text-sm text-slate-600">{account.type}</Text>
              <Text className="mt-1 text-lg font-bold text-slate-900">{formatPeso(account.balance)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
