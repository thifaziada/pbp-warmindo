import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Div, Text, ThemeProvider, Host, Tag } from "react-native-magnus";
import Constants from "expo-constants";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "@env";
import THEMES from "../../constants/themes";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (timeString) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(`2023-01-01T${timeString}`).toLocaleTimeString(
    undefined,
    options
  );
};

const TransaksiPage = () => {
  const navigation = useNavigation();
  const [dataTransaksi, setDataTransaksi] = useState([]);

  const fetchDataTransaksi = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/transaksi`);
      setDataTransaksi(response.data);
    } catch (error) {
      console.error("Error fetching data transaksi:", error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Baru":
        return "blue500";
      case "Diproses":
        return "yellow500";
      case "Disajikan":
        return "green500";
      case "Selesai":
        return "red500";
      default:
        return "gray500";
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDataTransaksi();
    }, [])
  );

  return (
    <ThemeProvider theme={THEMES.light}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <Host>
          <Div mx="xl" flex={1} pt={Constants.statusBarHeight}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={dataTransaksi}
              keyExtractor={(item) => item.idtransaksi.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dataRow}
                  onPress={() => {
                    navigation.navigate("DetailTransaksi", {
                      idtransaksi: item.idtransaksi,
                    });
                  }}
                >
                  <Div
                    p="xl"
                    mb="lg"
                    bg="white"
                    rounded="xl"
                    shadow="lg"
                    justifyContent="center"
                    alignItems="left"
                  >
                    <Text fontSize="2xl" fontWeight="bold" mb="md">
                      Pelanggan: {item.namapelanggan}
                    </Text>
                    <Text fontSize="lg" mb="md">
                      Total: {item.total}
                    </Text>
                    <Text fontSize="lg" mb="md">
                      Tanggal: {formatDate(item.tanggal)}
                    </Text>
                    <Text fontSize="lg" mb="md">
                      Jam pemesanan: {formatTime(item.waktu)}
                    </Text>
                    <Tag bg={getStatusColor(item.status)} mb="md">
                      {item.status}
                    </Tag>
                  </Div>
                </TouchableOpacity>
              )}
            />
          </Div>
        </Host>
      </SafeAreaView>
    </ThemeProvider>
  );
};

export default TransaksiPage;

const styles = {
  dataRow: {
    marginBottom: 16,
  },
};
