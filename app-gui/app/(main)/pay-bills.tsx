import { AccountPickerModal } from "@/components/AccountPickerModal";
import { payBill } from "@/db/api/bank";
import { useBankAccounts } from "@/hooks/useBankAccounts";
import { formatPeso } from "@/utils/formatCurrency";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PayBills() {
  const insets = useSafeAreaInsets();
  const { accounts, loading, reload } = useBankAccounts();
  const [fromId, setFromId] = useState("");
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState("");
  const [payFromOpen, setPayFromOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (accounts.length && !fromId) {
      setFromId(accounts[0].id);
    }
  }, [accounts, fromId]);

  const fromAccount = accounts.find((a) => a.id === fromId);

  const pay = async () => {
    const n = Number(amount);
    if (!company.trim() || !Number.isFinite(n) || n < 500) {
      setBanner("Enter company and amount of at least 500.");
      return;
    }
    if (!fromAccount) {
      setBanner("Choose an account.");
      return;
    }

    if (n > fromAccount.balance) {
      setBanner("Insufficient balance.");
      return;
    }

    setSubmitting(true);
    const result = await payBill({
      from_account_id: Number(fromId),
      company: company.trim(),
      amount: n,
    });
    setSubmitting(false);

    if (!result.ok) {
      setBanner(result.message);
      return;
    }

    await reload();
    setBanner(`Paid ${formatPeso(n)} to ${company.trim()} from ${fromAccount.label}`);
    setCompany("");
    setAmount("");
  };

  if (loading && accounts.length === 0) {
    return (
      <View className="flex-1 bg-slate-100 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-100">
      <View className="bg-[#2563eb] pb-3" style={{ paddingTop: insets.top + 8 }}>
        <Text className="text-center text-base font-semibold text-white">Pay Bills</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <TouchableOpacity
          onPress={() => setPayFromOpen(true)}
          activeOpacity={0.9}
          className="mb-4 rounded-2xl border border-slate-200 bg-white p-4"
        >
          <Text className="text-base font-bold text-slate-800">Pay From</Text>
          {fromAccount ? (
            <>
              <Text className="mt-1 text-sm text-[#2563eb]">{fromAccount.label.toLowerCase()}</Text>
              <Text className="mt-2 text-sm text-slate-600">Available Balance</Text>
              <Text className="text-xl font-bold text-slate-900">{formatPeso(fromAccount.balance)}</Text>
            </>
          ) : (
            <Text className="mt-2 text-slate-500">Select an account</Text>
          )}
          <View className="absolute right-4 top-6">
            <MaterialIcons name="keyboard-arrow-down" size={28} color="#2563eb" />
          </View>
        </TouchableOpacity>

        <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="mb-2 font-semibold text-slate-800">Company</Text>
          <TextInput
            className="rounded-lg border border-slate-200 px-3 py-3 text-base text-slate-900"
            placeholder="Company name"
            placeholderTextColor="#94a3b8"
            value={company}
            onChangeText={setCompany}
          />
        </View>

        <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <Text className="mb-2 text-lg font-semibold text-slate-800">Amount (min. 500)</Text>
          <View className="flex-row items-end border-b-2 border-slate-300 pb-1">
            <Text className="mr-1 text-2xl text-slate-700">₱</Text>
            <TextInput
              className="min-w-0 flex-1 text-2xl text-slate-900"
              placeholder="0.00"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {banner ? <Text className="mb-4 text-center text-emerald-700">{banner}</Text> : null}

        <TouchableOpacity
          onPress={pay}
          disabled={!accounts.length || submitting}
          className="items-center rounded-xl bg-[#2563eb] py-4 active:opacity-90 disabled:opacity-40"
        >
          <Text className="text-base font-bold uppercase text-white">
            {submitting ? "Paying..." : "Pay Bill"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <AccountPickerModal
        visible={payFromOpen}
        title="Pay From"
        accounts={accounts}
        onClose={() => setPayFromOpen(false)}
        onSelect={setFromId}
      />
    </View>
  );
}
