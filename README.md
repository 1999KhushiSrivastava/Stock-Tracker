Real-Time Stock Tracker

A full-stack project that tracks stock prices in real-time using Node.js, Express, SQLite, Socket.io, Chart.js and the Finnhub API.

📊 Line chart visualization for multiple stocks

💵 Live price table with auto-updates

🔔 Custom stock alerts when thresholds are crossed

⏱ Historical data storage with SQLite

🚀 Features

Real-time stock price updates (via Socket.io)

Fetches prices every 60 seconds from Finnhub API

Stores historical data in SQLite database

Interactive line chart with Chart.js

Alerts system: Set price thresholds and get notified when crossed

📂 Project Structure
.
├── server.js        # Backend (Node.js + Express + Socket.io + SQLite)
├── stocks.db        # SQLite database (auto-created)
├── index.html       # Frontend (Chart.js + Socket.io client)
└── README.md        # Documentation

🔧 Prerequisites

Node.js
 (v14+)

SQLite3

Finnhub API Key
 (free signup)

⚙️ Setup & Installation

Clone the repo

git clone https://github.com/1999KhushiSrivastava/Stock-Tracker.git
cd Stock-Tracker


Install dependencies

npm install express socket.io axios node-cron sqlite3 cors


Set your API Key
Inside server.js, replace:

const FINNHUB_KEY = "YOUR_API_KEY_HERE";


Run backend

node server.js


✅ Server runs at: http://localhost:3000

Run frontend
Use a static server (don’t open index.html directly). Example:

npx http-server . -p 8080


Open → http://localhost:8080/index.html

📊 Usage

See live stock prices in the table.

Watch line charts updating in real time.

Set a stock alert threshold → get notified when crossed.

🗄 Database

SQLite automatically creates:

history → stores symbol, price, timestamp

alerts → stores user-defined alerts

🖼 Demo Screenshot

(Add screenshot of chart + table here)

🛠 Tech Stack

Backend: Node.js, Express, Socket.io, SQLite, Cron Jobs

Frontend: HTML, JavaScript, Chart.js, Socket.io-client

📜 License

MIT License. Free to use & modify.
