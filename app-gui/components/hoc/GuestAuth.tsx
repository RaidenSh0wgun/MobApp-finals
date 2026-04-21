import { router } from "expo-router";
import { ComponentType, useEffect } from "react";
import { getSecureItemAsync } from "@/db/api/secureStore";

const GuestAuth = (WrappedComponent: ComponentType) => {
  return function GuestAuth() {
    useEffect(() => {
      getSecureItemAsync("session").then((token) => {
        if (token) {
          router.replace("/home");
        }
      });
    }, []);

    return <WrappedComponent />;
  };
};

export default GuestAuth;
