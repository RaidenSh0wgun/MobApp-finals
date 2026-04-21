import { createBankAccount } from "@/db/api/bank";
import { ButtonSpinner } from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ACCOUNT_TYPES = ["Savings", "Checking", "Time Deposit"] as const;

function validate(input: {
  nickname: string;
  code: string;
  balance: string;
}): string | null {
  if (!input.nickname.trim()) {
    return "Nickname is required.";
  }
  if (!input.code.trim()) {
    return "Account code is required.";
  }
  if (!/^\d+$/.test(input.code)) {
    return "Code must contain digits only.";
  }
  if (input.code.length > 8) {
    return "Code may be at most 8 digits.";
  }
  const balanceNum = Number(input.balance);
  if (!Number.isFinite(balanceNum) || balanceNum < 5000) {
    return "Minimum opening balance is 5,000.";
  }
  return null;
}

export default function CreateAccount() {
  const insets = useSafeAreaInsets();
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");
  const [balance, setBalance] = useState("");
  const [accountType, setAccountType] = useState<(typeof ACCOUNT_TYPES)[number]>("Savings");
  const [typeModal, setTypeModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const err = validate({ nickname, code, balance });
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    setSubmitting(true);
    const result = await createBankAccount({
      nickname: nickname.trim(),
      code,
      balance: Number(balance),
      account_type: accountType,
    });
    setSubmitting(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-slate-100">
      <View className="bg-[#14532d] pb-3" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center px-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2" hitSlop={12}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-semibold text-white">Account Creation</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        <Text className="mb-1 text-sm font-medium text-slate-700">Code</Text>
        <View className="mb-4 flex-row items-center rounded-xl border border-slate-200 bg-white px-3">
          <MaterialIcons name="code" size={22} color="#64748b" />
          <TextInput
            className="flex-1 py-3 pl-2 text-base text-slate-900"
            placeholder="8-digit code"
            placeholderTextColor="#94a3b8"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={8}
          />
        </View>

        <Text className="mb-1 text-sm font-medium text-slate-700">Nickname</Text>
        <View className="mb-4 flex-row items-center rounded-xl border border-slate-200 bg-white px-3">
          <MaterialIcons name="person" size={22} color="#64748b" />
          <TextInput
            className="flex-1 py-3 pl-2 text-base text-slate-900"
            placeholder="Nickname"
            placeholderTextColor="#94a3b8"
            value={nickname}
            onChangeText={setNickname}
          />
        </View>

        <Text className="mb-1 text-sm font-medium text-slate-700">Desired Funds (min. 5000)</Text>
        <View className="mb-4 flex-row items-center rounded-xl border border-slate-200 bg-white px-3">
          <MaterialIcons name="payments" size={22} color="#64748b" />
          <TextInput
            className="flex-1 py-3 pl-2 text-base text-slate-900"
            placeholder="5000"
            placeholderTextColor="#94a3b8"
            value={balance}
            onChangeText={setBalance}
            keyboardType="numeric"
          />
        </View>

        <Text className="mb-1 text-sm font-medium text-slate-700">Account Type</Text>
        <Pressable
          onPress={() => setTypeModal(true)}
          className="mb-4 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
        >
          <Text className="text-base text-slate-900">{accountType}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={28} color="#2563eb" />
        </Pressable>

        {formError ? <Text className="mb-3 text-red-600">{formError}</Text> : null}

        <TouchableOpacity
          onPress={submit}
          disabled={submitting}
          className="items-center rounded-xl bg-[#16a34a] py-4 active:opacity-90"
        >
          {submitting ? <ButtonSpinner color="white" /> : <Text className="text-base font-bold text-white">Create Account</Text>}
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={typeModal} transparent animationType="fade">
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setTypeModal(false)}>
          <View className="rounded-t-2xl bg-white p-4">
            {ACCOUNT_TYPES.map((t) => (
              <Pressable
                key={t}
                onPress={() => {
                  setAccountType(t);
                  setTypeModal(false);
                }}
                className="border-b border-slate-100 py-4"
              >
                <Text className="text-center text-lg text-slate-900">{t}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
