const express = require("express");
const path = require("path");

const tiktokRouter = require("./backend/tiktok");
const instagramRouter = require("./backend/instagram");

const app = express();
const DEFAULT_PORT = 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Router
app.use("/api/tiktok", tiktokRouter);
app.use("/api/instagram", instagramRouter);

// Route index
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Fungsi untuk mencari port kosong
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} sudah digunakan, mencoba port ${port + 1}...`);
      startServer(port + 1); // naikkan port 1
    } else {
      console.error(err);
    }
  });
}

// Jalankan server mulai dari default port
startServer(DEFAULT_PORT);