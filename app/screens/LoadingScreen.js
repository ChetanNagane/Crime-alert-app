import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { colors } from "../colors";
import { useDispatch } from "react-redux";
import { authUser } from "../store/actions/auth";

const LoadingScreen = (props) => {
  const dispatch = useDispatch();
  AsyncStorage.clear();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");

      if (!userData) {
        console.log("Navigate to Start");
        props.navigation.navigate("Start");
        return;
      }

      const transformedData = JSON.parse(userData);
      const { user, token, expirationTime } = transformedData;
      if (
        new Date(expirationTime).getTime() <= new Date().getTime() ||
        !token ||
        !user
      ) {
        props.navigation.navigate("Login");
        return;
      }
      console.log("Navigate to Home");
      props.navigation.navigate("Home");
      dispatch(authUser({ user, token }));
    };
    tryLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.backgroundPrimary} />
    </View>
  );
};

export default LoadingScreen;
