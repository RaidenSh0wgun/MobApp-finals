import type { BankAccountView } from "@/db/banking";
import { formatPeso } from "@/utils/formatCurrency";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  title: string;
  accounts: BankAccountView[];
  onClose: () => void;
  onSelect: (id: string) => void;
};

export function AccountPickerModal({ visible, title, accounts, onClose, onSelect }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-slate-100" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center bg-[#2563eb] px-2 py-3">
          <TouchableOpacity onPress={onClose} className="p-2" hitSlop={12}>
            <MaterialIcons name="close" size={26} color="#fff" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-base font-bold uppercase text-white">{title}</Text>
          <View className="w-10" />
        </View>
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
          {accounts.map((account) => (
            <Pressable
              key={account.id}
              onPress={() => {
                onSelect(account.id);
                onClose();
              }}
              className="mb-3 rounded-xl border border-slate-200 bg-white p-4 active:bg-slate-50"
            >
              <Text className="text-base font-bold uppercase text-[#2563eb]">{account.label}</Text>
              <Text className="text-sm text-[#2563eb]">{account.code}</Text>
              <Text className="text-sm text-slate-600">{account.type}</Text>
              <Text className="mt-1 text-base font-semibold text-slate-900">{formatPeso(account.balance)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}
