import { Stack } from "expo-router";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="index"
        />
        <Stack.Screen
          name="(pages)/about-us"
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="(pages)/about-page-2"
          options={{headerShown: true}}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
