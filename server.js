const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./ckcondo.db");

// =====================
// DATABASE
// =====================
db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      price TEXT,
      type TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      service TEXT
    )
  `);

});

// =====================
// ITEMS
// =====================

// รายการทั้งหมด
app.get("/list", (req, res) => {
  db.all("SELECT * FROM items ORDER BY id DESC", (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// เพิ่มรายการ
app.post("/add", (req, res) => {
  const { title, price, type } = req.body;

  db.run(
    "INSERT INTO items (title, price, type) VALUES (?,?,?)",
    [title, price, type],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        ok: true,
        id: this.lastID
      });
    }
  );
});

// =====================
// BOOKINGS
// =====================

// จอง
app.post("/book", (req, res) => {
  const { name, phone, service } = req.body;

  db.run(
    "INSERT INTO bookings (name, phone, service) VALUES (?,?,?)",
    [name, phone, service],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        ok: true,
        id: this.lastID
      });
    }
  );
});

// รายการจอง
app.get("/bookings", (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});

// =====================
// LOGIN
// =====================

app.post("/login", (req, res) => {

  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, row) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (row) {
        res.json({
          ok: true,
          user: row
        });
      } else {
        res.json({
          ok: false
        });
      }

    }
  );

});

// =====================
// REGISTER
// =====================

app.post("/register", (req, res) => {

  const { username, password } = req.body;

  db.run(
    "INSERT INTO users(username,password) VALUES(?,?)",
    [username, password],
    function (err) {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        ok: true,
        id: this.lastID
      });

    }
  );

});

// =====================
// START SERVER
// =====================

app.listen(PORT, () => {
  console.log("CK Condo running on " + PORT);
});

});

// =====================
// ITEMS
// =====================
app.get("/list", (req, res) => {
  db.all("SELECT * FROM items ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

app.post("/add", (req, res) => {
  const { title, price, type } = req.body;

  db.run(
    "INSERT INTO items (title, price, type) VALUES (?,?,?)",
    [title, price, type],
    () => res.json({ ok: true })
  );
});

// =====================
// BOOKINGS
// =====================
app.post("/book", (req, res) => {
  const { name, phone, service } = req.body;

  db.run(
    "INSERT INTO bookings (name, phone, service) VALUES (?,?,?)",
    [name, phone, service],
    () => res.json({ ok: true })
  );
});

app.get("/bookings", (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

// =====================
// LOGIN
// =====================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, row) => {
      if (row) {
        res.json({ ok: true });
      } else {
        res.json({ ok: false });
      }
    }
  );
});

// =====================
app.listen(PORT, () => {
  console.log("CK Condo running on " + PORT);
});