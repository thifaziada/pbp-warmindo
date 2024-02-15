import React, { useEffect, useState, useRef } from "react";
import { Text, StyleSheet } from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { Div, ThemeProvider, Button, Dropdown } from "react-native-magnus";
import { FlatList } from "react-native";
import { BASE_URL } from "@env";
import THEMES from "../../constants/themes";
import { useNavigation } from "@react-navigation/native";

const DetailTransaksi = () => {
  const [detailTransaksi, setDetailTransaksi] = useState([]);
  const [error, setError] = useState("");
  const route = useRoute();
  const dropdownRef = useRef(null);
  const navigation = useNavigation();
  const { idtransaksi } = route.params;

  const fetchDetailTransaksi = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/detailtransaksi/${idtransaksi}`
      );

      console.log("Detail Transaksi:", response.data);

      setDetailTransaksi(response.data);
    } catch (error) {
      console.error("Error fetching data detail:", error.message);
      setError("Error fetching detail. Please try again.");
    }
  };

  useEffect(() => {
    fetchDetailTransaksi();
  }, []);

  if (error) {
    return <Text>{error}</Text>;
  }

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updatetransaksi/${idtransaksi}`,
        { status: newStatus }
      );

      console.log("Status updated:", response.data);
      fetchDetailTransaksi();
      dropdownRef.current.close();
      navigation.navigate("Transaksi");
    } catch (error) {
      console.error("Error updating status:", error.message);
      setError("Error updating status. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const firstItem = detailTransaksi.length > 0 ? detailTransaksi[0] : {};

  return (
    <ThemeProvider theme={THEMES.light}>
      <Div style={styles.container}>
        <Div style={styles.header}>
          <Text style={styles.title}>
            ID Transaksi: {firstItem.idtransaksi}
          </Text>
          <Text style={styles.title}>
            Tanggal Transaksi: {formatDate(firstItem.tanggal)}
          </Text>
          <Text style={styles.title}>Status: {firstItem.status}</Text>
        </Div>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={detailTransaksi}
          keyExtractor={(item) => item.idtransaksi.toString()}
          renderItem={({ item }) => (
            <Div style={styles.card}>
              <Text style={styles.text}>Nama Menu: {item.namamenu}</Text>
              <Text style={styles.text}>Harga Menu: {item.harga}</Text>
              <Text style={styles.text}>Jumlah: {item.jumlah}</Text>
              <Text style={styles.text}>Subtotal: {item.subtotal}</Text>
              <Text style={styles.text}>Status: {item.status_detail}</Text>
            </Div>
          )}
        />

        <Div style={styles.header}>
          <Text style={styles.title}>Total : {firstItem.total}</Text>
          <Text style={styles.title}>
            Metode Pembayaran: {firstItem.metodepembayaran}
          </Text>
        </Div>

        <Button
          mt="0.6xl"
          bg="#F3CFDA"
          py="lg"
          rounded="md"
          color="#865c6c"
          fontSize="xl"
          block
          onPress={() => dropdownRef.current.open()}
        >
          Ubah Status
        </Button>
        <Button
          mt="xl"
          bg="#F3CFDA"
          py="lg"
          rounded="md"
          color="#865c6c"
          fontSize="xl"
          block
          onPress={() => handleUpdateStatus("Selesai")}
        >
          Selesaikan Pesanan
        </Button>

        <Dropdown
          ref={dropdownRef}
          title={
            <Text mx="xl" color="gray500" pb="md">
              Ubah status anda
            </Text>
          }
          mt="md"
          pb="2xl"
          showSwipeIndicator={true}
          roundedTop="xl"
        >
          <Dropdown.Option
            py="md"
            px="xl"
            block
            onPress={() => handleUpdateStatus("Diproses")}
          >
            Diproses
          </Dropdown.Option>
          <Dropdown.Option
            py="md"
            px="xl"
            block
            onPress={() => handleUpdateStatus("Disajikan")}
          >
            Disajikan
          </Dropdown.Option>
          {/* <Dropdown.Option py="md" px="xl" block onPress={() => handleUpdateStatus('Selesai')}>
          Selesai
        </Dropdown.Option> */}
        </Dropdown>
      </Div>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  card: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8, // Adjusted marginBottom
    color: "#333", // Consistent color
  },
  text: {
    fontSize: 16,
    marginBottom: 8, // Adjusted marginBottom
    color: "#555", // Consistent color
  },
  button: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#ff6b6b", // Button background color
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DetailTransaksi;
