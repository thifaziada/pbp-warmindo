import React, { useState } from "react";
import axios from "axios";
import { SafeAreaView, StatusBar, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Div, ThemeProvider, Text, Button, Input } from "react-native-magnus";
import Constants from "expo-constants";
import { BASE_URL } from "@env";
import THEMES from "../../constants/themes";

const theme = {
  colors: { primary: "#FF6F61", secondary: "#F3CFDA", accent: "#865c6c" },
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        username,
        password,
      });

      const result = response.data;
      console.log("Login result:", result);

      if (result.success) {
        navigation.navigate("Dashboard");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require("./../../assets/Home.jpeg")}
          style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
        >
          <Div flex={1} alignItems="center" justifyContent="center">
            <Div
              bg="white"
              w="80%"
              p="lg"
              rounded="xl"
              shadow="lg"
              alignItems="center"
            >
              <Text
                mt="xl"
                textAlign="center"
                fontSize="5xl"
                fontWeight="bold"
                color="primary"
              >
                Warmindo A3
              </Text>
              {/* <Text fontSize="lg" color="primary" mt="md" textAlign="center">
                Enter your credentials to sign in
              </Text> */}
              <Div mt="2xl" w="80%">
                <Text color="primary">Username</Text>
                <Input
                  mt="xs"
                  px="md"
                  py="lg"
                  borderColor="gray200"
                  borderWidth={1}
                  keyboardType="default"
                  onChangeText={(text) => setUsername(text)}
                />
              </Div>
              <Div mt="md" w="80%">
                <Text color="primary">Password</Text>
                <Input
                  mt="xs"
                  px="md"
                  py="lg"
                  borderColor="gray200"
                  borderWidth={1}
                  secureTextEntry
                  onChangeText={(text) => setPassword(text)}
                />
              </Div>
              <Button
                mt="xs"
                px="md"
                py="lg"
                bg="secondary"
                rounded="md"
                color="accent"
                fontSize="xl"
                onPress={handleLogin}
                block
              >
                Submit
              </Button>
            </Div>
          </Div>
        </ImageBackground>
      </SafeAreaView>
    </ThemeProvider>
  );
};

export default LoginPage;
