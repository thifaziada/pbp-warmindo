import React from "react";
import { SafeAreaView, ImageBackground } from "react-native";
import { Div, ThemeProvider, Text, Button } from "react-native-magnus";
import { useNavigation } from "@react-navigation/native";

const theme = {
  colors: { primary: "#FF6F61", secondary: "#F3CFDA", accent: "#865c6c" },
};

const HomePage = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
          source={require("./../../assets/Home.jpeg")}
          style={{ flex: 1, resizeMode: "cover", justifyContent: "center" }}
        >
          <Div
            flex={1}
            px="xl"
            bg="transparent"
            alignItems="center"
            justifyContent="center"
          >
            <Text
              mt="sm"
              color="primary"
              fontSize="5xl"
              fontWeight="bold"
              w="100%"
              textAlign="center"
              textShadow="1px 1px 2px #000"
              letterSpacing={1}
            >
              Warmindo A3
            </Text>
            <Text
              pb="xl"
              mt="sm"
              color="primary"
              fontSize="lg"
              w="80%"
              textAlign="center"
            >
              Welcome to Warmindo A3, where every meal tells a story of flavors
              and traditions.
            </Text>
            <Div alignItems="center">
              <Button
                mt="sm"
                bg="secondary"
                py="lg"
                rounded="md"
                color="accent"
                fontSize="xl"
                onPress={handleLoginPress}
              >
                Login
              </Button>
            </Div>
          </Div>
        </ImageBackground>
      </SafeAreaView>
    </ThemeProvider>
  );
};

export default HomePage;
