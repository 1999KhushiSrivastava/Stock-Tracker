// server.js
console.log(">>> server.js is starting...");

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const cron = require("node-cron");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const db = new sqlite3.Database("./stocks.db");

const STOCK_SYMBOLS = ["AAPL", "GOOGL", "MSFT"];
const FINNHUB_KEY = "d3f2lnhr01qh40fgiv2gd3f2lnhr01qh40fgiv30";

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT,
    threshold REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symbol TEXT,
    price REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Fetch stock price
async function fetchStock(symbol) {
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
    const res = await axios.get(url);
    if (!res.data || res.data.c === undefined) return null;
    return res.data.c;
  } catch (err) {
    console.error(`Error fetching ${symbol}:`, err.message);
    return null;
  }
}

// Fetch & save prices + emit
async function fetchAndSavePrices() {
  for (const symbol of STOCK_SYMBOLS) {
    const price = await fetchStock(symbol);
    if (!price) continue;

    // Save to DB
    db.run("INSERT INTO history (symbol, price) VALUES (?, ?)", [symbol, price]);

    // Emit real-time update
    io.emit("update", { symbol, price, timestamp: new Date().toISOString() });

    // Check alerts
    db.all("SELECT * FROM alerts WHERE symbol = ?", [symbol], (err, rows) => {
      if (err) return console.error("DB error:", err.message);
      rows.forEach((alert) => {
        if (price >= alert.threshold) {
          io.emit("alert", {
            symbol,
            price,
            threshold: alert.threshold,
            message: `🚨 ${symbol} crossed threshold $${alert.threshold} (Now: $${price})`
          });
        }
      });
    });
  }
}

// Cron: fetch every 5 seconds
cron.schedule("*/60 * * * * *", fetchAndSavePrices);

// REST endpoint: history
app.get("/history/:symbol", (req, res) => {
  const { symbol } = req.params;
  db.all(
    "SELECT * FROM history WHERE symbol = ? ORDER BY timestamp DESC LIMIT 100",
    [symbol],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows.reverse());
    }
  );
});

// REST endpoint: add alert
app.post("/alert", (req, res) => {
  const { symbol, threshold } = req.body;
  db.run(
    "INSERT INTO alerts (symbol, threshold) VALUES (?, ?)",
    [symbol, threshold],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Start server
server.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
  fetchAndSavePrices(); // run immediately at startup
});
