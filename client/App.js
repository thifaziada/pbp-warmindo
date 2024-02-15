import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardPage from "./components/pages/Dashboard";
import HomePage from "./components/pages/Home";
import DetailTransaksi from "./components/pages/DetailTransaksi";
import LoginPage from "./components/pages/Login";
import TransaksiPage from "./components/pages/Transaksi";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Dashboard" component={DashboardPage} />
        <Stack.Screen name="Transaksi" component={TransaksiPage} />
        <Stack.Screen name="DetailTransaksi" component={DetailTransaksi} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
