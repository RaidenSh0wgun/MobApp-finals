import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import UserAuth from "@/components/hoc/UserAuth";

const tabs = [
  { page: "home", title: "Accounts", icon: "home", showHeader: false },
  { page: "pay-bills", title: "Pay Bills", icon: "receipt-long", showHeader: false },
  { page: "send-money", title: "Send Money", icon: "mobile-screen-share", showHeader: false },
  { page: "profile", title: "User Options", icon: "apps", showHeader: false },
];

const hiddenScreens = [
  { page: "manage-accounts" },
  { page: "create-account" },
  { page: "account/[id]" },
];

function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563eb",
        headerShown: false,
      }}
    >
      {tabs.map((item, index) => (
        <Tabs.Screen
          key={`${item.page}-${index}`}
          name={item.page}
          options={{
            title: item.title,
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={26} name={item.icon as any} color={color} />
            ),
            tabBarShowLabel: true,
            headerShown: item.showHeader,
          }}
        />
      ))}
      {hiddenScreens.map((item) => (
        <Tabs.Screen
          key={item.page}
          name={item.page}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: "none" },
            headerShown: false,
          }}
        />
      ))}
    </Tabs>
  );
}

export default UserAuth(TabLayout);
