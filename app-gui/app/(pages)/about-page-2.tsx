import UserAuth from "@/components/hoc/UserAuth";
import { Text, View } from "react-native";

function AboutPage2() {
  return (
    <View
      className="flex-1 justify-center items-center gap-2.5"
    >
        <Text className="text-9xl">Hi</Text>
    </View>
  );
}

export default UserAuth(AboutPage2)