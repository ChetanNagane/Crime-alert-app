import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "../screens/StartScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "../screens/LoadingScreen";
import HomeScreen from "../screens/HomeScreen";

const AuthNavigator = () => {
  const AuthStack = createStackNavigator();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "black" },
        headerTintColor: "white",
        headerShown: false,
      }}
    >
      <AuthStack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{
          title: "Loading",
        }}
      />
      <AuthStack.Screen
        name="Start"
        component={StartScreen}
        options={{
          title: "Crime Alert",
        }}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: "Login",
        }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ title: "Register" }}
      />
      <AuthStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
