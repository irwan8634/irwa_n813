const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Setup session
app.use(
  session({
    secret: "rahasia123", // ganti kalau mau, ini buat keamanan session
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // folder buat simpan file HTML

// Data user contoh (username & password + email)
const users = {
  user1: { email: "user1@example.com", password: "12345" },
  user2: { email: "user2@example.com", password: "abcde" },
};

// Halaman login
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// Proses login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    // Simpan data user ke session
    req.session.user = { username, email: users[username].email };
    res.redirect("/form");
  } else {
    res.send("Login gagal! <a href='/login'>Coba lagi</a>");
  }
});

// Halaman form pesan (harus login)
app.get("/form", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.sendFile(__dirname + "/public/form.html");
});

// API untuk ambil email user yang login
app.get("/api/user-email", (req, res) => {
  if (req.session.user) {
    res.json({ email: req.session.user.email });
  } else {
    res.json({ email: null });
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
