import { AccountPickerModal } from "@/components/AccountPickerModal";
import { sendMoney } from "@/db/api/bank";
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

export default function SendMoney() {
  const insets = useSafeAreaInsets();
  const { accounts, loading, reload } = useBankAccounts();
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [payFromOpen, setPayFromOpen] = useState(false);
  const [recipientOpen, setRecipientOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (accounts.length && !fromId) {
      setFromId(accounts[0].id);
    }
  }, [accounts, fromId]);

  useEffect(() => {
    if (fromId && toId === fromId) {
      setToId("");
    }
  }, [fromId, toId]);

  const fromAccount = accounts.find((a) => a.id === fromId);
  const toAccount = accounts.find((a) => a.id === toId);
  const recipientChoices = accounts.filter((a) => a.id !== fromId);

  const send = async () => {
    const n = Number(amount);
    if (!fromAccount || !toAccount) {
      setBanner("Choose both accounts.");
      return;
    }
    if (!Number.isFinite(n) || n < 500) {
      setBanner("Amount must be at least 500.");
      return;
    }
    if (n > fromAccount.balance) {
      setBanner("Insufficient balance.");
      return;
    }

    setSubmitting(true);
    const result = await sendMoney({
      from_account_id: Number(fromId),
      to_account_id: Number(toId),
      amount: n,
    });
    setSubmitting(false);

    if (!result.ok) {
      setBanner(result.message);
      return;
    }

    await reload();
    setBanner(`Sent ${formatPeso(n)} from ${fromAccount.label} to ${toAccount.label}`);
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
        <Text className="text-center text-base font-semibold text-white">Send Money to Own Accounts</Text>
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

        <TouchableOpacity
          onPress={() => setRecipientOpen(true)}
          activeOpacity={0.9}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-4"
        >
          <Text className="text-base font-bold text-slate-800">Recipient</Text>
          <Text className={`mt-2 ${toAccount ? "text-[#2563eb]" : "text-slate-400"}`}>
            {toAccount ? toAccount.label.toLowerCase() : "Select an account to transfer funds"}
          </Text>
          <View className="absolute right-4 top-5">
            <MaterialIcons name="keyboard-arrow-down" size={28} color="#2563eb" />
          </View>
        </TouchableOpacity>

        {banner ? <Text className="mb-4 text-center text-emerald-700">{banner}</Text> : null}

        <TouchableOpacity
          onPress={send}
          disabled={!accounts.length || submitting}
          className="items-center rounded-xl bg-[#2563eb] py-4 opacity-100 active:opacity-90 disabled:opacity-40"
        >
          <Text className="text-base font-bold uppercase text-white">
            {submitting ? "Sending..." : "Send Money"}
          </Text>
        </TouchableOpacity>

        {accounts.length === 0 ? (
          <Text className="mt-4 text-center text-slate-500">Add accounts under User Options → Manage Accounts.</Text>
        ) : null}
      </ScrollView>

      <AccountPickerModal
        visible={payFromOpen}
        title="Pay From"
        accounts={accounts}
        onClose={() => setPayFromOpen(false)}
        onSelect={setFromId}
      />
      <AccountPickerModal
        visible={recipientOpen}
        title="Recipient"
        accounts={recipientChoices}
        onClose={() => setRecipientOpen(false)}
        onSelect={setToId}
      />
    </View>
  );
}
