import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { login } from "@/db/api/auth";
import { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import GuestAuth from "@/components/hoc/GuestAuth";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

function Index() {
  const [showpass, setShowpass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const togglePassword = () => setShowpass(!showpass);

  const SubmitLogin = () => {
    setLoading(true);
    setErrorMsg("");

    login({ username, password })
      .then(async (res) => {
        if (res.ok) {
          router.replace("/home");
          return;
        }

        setErrorMsg(res.message || "Login failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View className="flex-1 justify-center items-center gap-4 px-4">
      <Text className="text-3xl font-bold">Welcome</Text>
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Username</FormControlLabelText>
        </FormControlLabel>
        <Input
          variant="outline"
          size="md"
          className="w-full"
        >
          <InputField
            placeholder="Username..."
            value={username}
            onChangeText={setUsername}
          />
        </Input>
      </FormControl>
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Password</FormControlLabelText>
        </FormControlLabel>
        <Input
          variant="outline"
          size="md"
          className="w-full"
        >
          <InputField
            placeholder="Password..."
            type={showpass ? "text" : "password"}
            value={password}
            onChangeText={setPassword}
          />
          <InputSlot className="pr-3" onPress={togglePassword}>
            <InputIcon as={showpass ? EyeIcon : EyeOffIcon} size="md" />
          </InputSlot>
        </Input>
      </FormControl>
      {errorMsg ? <Text className="text-red-500">{errorMsg}</Text> : null}
      <Button variant="solid" action="positive" onPress={SubmitLogin} disabled={loading}>
        {loading ? <ButtonSpinner color="white" /> : null}
        <ButtonText>{loading ? "Signing In" : "Sign In"}</ButtonText>
      </Button>
    </View>
  );
}

export default GuestAuth(Index);
