import { router } from "expo-router";
import { ComponentType, useEffect } from "react";
import { getSecureItemAsync } from "@/db/api/secureStore";

const UserAuth = (WrappedComponent: ComponentType) => {
  return function UserAuth() {
    useEffect(() => {
      getSecureItemAsync("session").then((token) => {
        if (!token) {
          router.replace("/");
        }
      });
    }, []);

    return <WrappedComponent />;
  };
};

export default UserAuth