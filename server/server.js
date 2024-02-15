const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080;

const session = require("express-session");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "warmindo2",
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  connection.query(
    "SELECT * FROM pengguna WHERE username = ? AND password = ?",
    [username, password],
    (error, results) => {
      if (error) {
        console.error("Error executing login query:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      } else {
        const date = new Date();
        const currentHour = date.getHours();
        const shift = currentHour >= 11 && currentHour <= 17 ? 1 : 2;

        if (results.length > 0) {
          const idpengguna = results[0].idpengguna;
          req.session.idpengguna = idpengguna;
          req.session.shift = shift;

          console.log("ID:", req.session.idpengguna);
          console.log("Shift:", req.session.shift);

          function getCurrentDate() {
            const date = new Date();
            return `${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}`;
          }

          function getCurrentTime() {
            const date = new Date();
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
          }

          const tanggal = getCurrentDate();
          const waktu = getCurrentTime();
          const aktivitas = "Login";

          connection.query(
            "INSERT INTO aktivitas_pengguna (tanggal, waktu, idpengguna, aktivitas) VALUES (?, ?, ?, ?)",
            [tanggal, waktu, idpengguna, aktivitas],
            (error, logResults) => {
              if (error) {
                console.error("Error executing activity log query:", error);
                res
                  .status(500)
                  .json({ success: false, message: "Internal Server Error" });
              } else {
                res.status(200).json({
                  idpengguna: req.session.idpengguna,
                  shift: req.session.shift,
                  success: true,
                  message: "Login successful",
                });
              }
            }
          );
        } else {
          res
            .status(401)
            .json({ success: false, message: "Invalid credentials" });
        }
      }
    }
  );
});

app.post("/logout", (req, res) => {
  const idpengguna = req.session.idpengguna;
  function getCurrentDate() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  function getCurrentTime() {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  const tanggal = getCurrentDate();
  const waktu = getCurrentTime();
  const aktivitas = "Logout";

  connection.query(
    "INSERT INTO aktivitas_pengguna (tanggal, waktu, idpengguna, aktivitas) VALUES (?, ?, ?, ?)",
    [tanggal, waktu, idpengguna, aktivitas],
    (error, logResults) => {
      if (error) {
        console.error("Error executing activity log query:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      } else {
        req.session.destroy();
        res.status(200).json({ success: true, message: "Logout successful" });
      }
    }
  );
});

app.get("/profile", (req, res) => {
  console.log("ID:", req.session.idpengguna);
  const query = "SELECT * FROM pengguna WHERE idpengguna = ?";
  connection.query(query, [req.session.idpengguna], (err, results) => {
    if (err) {
      console.error("Error fetching pengguna:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // console.log("Data Pengguna:", results); // Tambahkan ini untuk melihat data yang diambil
    res.json({ nama: results[0].namapengguna, shift: req.session.shift });
  });
});

// app.get("/transaksi", (req, res) => {
//   const query = "SELECT * FROM transaksi";
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching transaksi:", err.message);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     console.log("Data Transaksi:", results);
//     res.json(results);
//   });
// });

app.post("/addtransaksi", (req, res) => {
  const {
    idtransaksi,
    tanggal,
    waktu,
    shift,
    idpengguna,
    idpelanggan,
    status,
    kodemeja,
    namapelanggan,
    total,
    metodepembayaran,
    totaldiskon,
    idpromosi,
  } = req.body;

  const query =
    "INSERT INTO transaksi (idtransaksi, tanggal, waktu, shift, idpengguna, idpelanggan, status, kodemeja, namapelanggan, total, metodepembayaran, totaldiskon, idpromosi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [
      idtransaksi,
      tanggal,
      waktu,
      shift,
      idpengguna,
      idpelanggan,
      status,
      kodemeja,
      namapelanggan,
      total,
      metodepembayaran,
      totaldiskon,
      idpromosi,
    ],
    (err, results) => {
      if (err) {
        console.error("Error adding menu:", err.message);
        return res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }

      console.log("Transaksi berhasil ditambahkan:", results);
      res.json({ success: true });
    }
  );
});

app.get("/detailtransaksi/:idtransaksi", (req, res) => {
  const idtransaksi = req.params.idtransaksi;
  const query =
    "SELECT transaksi.idtransaksi, transaksi.tanggal, transaksi.total, transaksi.metodepembayaran, transaksi.status, detail_transaksi.* FROM transaksi INNER JOIN detail_transaksi ON transaksi.idtransaksi = detail_transaksi.idtransaksi WHERE transaksi.idtransaksi = ?";

  connection.query(query, [idtransaksi], (err, results) => {
    if (err) {
      console.error("Error fetching transaksi:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Detail Transaksi:", results);
    res.json(results);
  });
});

app.put("/updatetransaksi/:idtransaksi", (req, res) => {
  const idtransaksi = req.params.idtransaksi;
  const updatedTransaksi = req.body;

  const query = "UPDATE transaksi SET status = ? WHERE idtransaksi = ?";
  connection.query(
    query,
    [updatedTransaksi.status, idtransaksi],
    (err, results) => {
      if (err) {
        console.error("Error updating detail:", err.message);
        return res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }

      console.log("Transaction's status updated:", results);
      res.json({ success: true });
    }
  );
});

app.get("/transaksi", (req, res) => {
  const query = "SELECT * FROM transaksi WHERE shift = ?";
  connection.query(query, [req.session.shift], (err, results) => {
    if (err) {
      console.error("Error fetching transaksi:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // console.log("Data Transaksi:", results);
    res.json(results);
  });
});

// app.get("/transaksi/:idtransaksi", (req, res) => {
//   const query = "SELECT * FROM transaksi WHERE idtransaksi = ?";
//   connection.query(query, [req.session.idtransaksi], (err, results) => {
//     if (err) {
//       console.error("Error fetching transaksi:", err.message);
//       return res.status(500).json({ error: "Internal Server Error" });
//     }

//     // console.log("Data Transaksi:", results);
//     res.json(results);
//   });
// });

// Menjalankan server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
