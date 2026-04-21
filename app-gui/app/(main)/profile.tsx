import { Button, ButtonText } from "@/components/ui/button";
import { logout } from "@/db/api/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <View className="flex-1 bg-slate-100">
      <View className="bg-[#2563eb] pb-3" style={{ paddingTop: insets.top + 8 }}>
        <Text className="text-center text-base font-semibold text-white">User Options</Text>
      </View>
      <View className="flex-1 justify-between px-4 pb-6 pt-6">
        <View>
          <Button variant="solid" action="positive" className="w-full" onPress={() => router.push("/manage-accounts")}>
            <ButtonText>Manage Accounts</ButtonText>
          </Button>
          <View className="mt-10 items-center opacity-40">
            <MaterialIcons name="apps" size={48} color="#64748b" />
          </View>
        </View>
        <Button variant="solid" action="negative" onPress={handleLogout} className="w-full">
          <ButtonText>Logout</ButtonText>
        </Button>
      </View>
    </View>
  );
}
