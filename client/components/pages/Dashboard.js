import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import {
  Div,
  Text,
  ThemeProvider,
  Button,
  Image,
  Badge,
  Icon,
  Header,
  Host,
  Fab,
  Portal,
} from "react-native-magnus";
import Constants from "expo-constants";
import axios from "axios";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import THEMES from "../../constants/themes";
import ThemeSwitcher from "../ThemeSwitcher";
import { BASE_URL } from "@env";

const DashboardPage = () => {
  const [dataProfile, setDataProfile] = useState([]);
  const [username, setUsername] = useState("");
  const [shift, setShift] = useState("");
  const navigation = useNavigation();

  const fetchDataProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/profile`);
      setDataProfile(response.data);
      setUsername(response.data.nama);
      setShift(response.data.shift);
    } catch (error) {
      console.error("Error fetching data Profile:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`);

      console.log("Logout successful");

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  useEffect(() => {
    fetchDataProfile();
  }, []);

  const handleViewTransactions = async () => {
    navigation.navigate("Transaksi");
  };

  return (
    <ThemeProvider theme={THEMES.light}>
      <Div bg="body" flex={1} px="lg">
        <StatusBar barStyle="dark-content" />
        <Div row mt="md">
          <Div flex={1}></Div>
          <Div>
            <ThemeSwitcher />
          </Div>
        </Div>
        <SafeAreaView style={{ flex: 1 }}>
          <Host>
            <Div mx="xl" flex={1} pt={Constants.statusBarHeight}>
              <Header
                suffix={
                  <Badge
                    bg="green500"
                    zIndex={10}
                    right={-5}
                    top={0}
                    h={12}
                    w={12}
                  >
                    <Button
                      bg="gray200"
                      p="none"
                      rounded="circle"
                      onPress={() => {}}
                    >
                      <Image
                        h={40}
                        w={40}
                        source={require("./../../assets/chef.jpg")}
                      />
                    </Button>
                  </Badge>
                }
              >
                <Div flexGrow={1}>
                  <Text fontWeight="bold" fontSize="2xl">
                    {username}
                  </Text>
                  <Text color="gray700" mt="md" mb="sm">
                    Shift : {shift}
                  </Text>
                </Div>
              </Header>
              <Button
                mt="xl"
                bg="#F3CFDA"
                py="lg"
                rounded="md"
                color="#865c6c"
                fontSize="xl"
                onPress={handleViewTransactions}
                block
              >
                Lihat Transaksi
              </Button>
              <Button
                mt="xl"
                bg="#F3CFDA"
                py="lg"
                rounded="md"
                color="#865c6c"
                fontSize="xl"
                onPress={handleLogout}
                block
              >
                Log out
              </Button>
            </Div>
            <Portal>
              <Fab bg="blue600" h={50} w={50}>
                <Button p="none" bg="transparent" justifyContent="flex-end">
                  <Div rounded="sm" bg="white" p="sm">
                    <Text fontSize="text100">Tambah transaksi</Text>
                  </Div>
                  <Icon
                    name="user"
                    color="blue600"
                    h={50}
                    w={50}
                    rounded="circle"
                    ml="md"
                    bg="white"
                  />
                </Button>
                <TouchableOpacity onPress={() => handleLogout()}>
                  <Button p="none" bg="transparent" justifyContent="flex-end">
                    <Div rounded="sm" bg="white" p="sm">
                      <Text fontSize="text100">Log Out</Text>
                    </Div>
                    <Icon
                      name="user"
                      color="blue600"
                      h={50}
                      w={50}
                      rounded="circle"
                      ml="md"
                      bg="white"
                    />
                  </Button>
                </TouchableOpacity>
              </Fab>
            </Portal>
          </Host>
        </SafeAreaView>
      </Div>
    </ThemeProvider>
  );
};

export default DashboardPage;
