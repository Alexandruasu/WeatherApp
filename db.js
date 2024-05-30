const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Testam conexiunea la baza de date
db.getConnection((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("MySQL database connection established successfully.");
});

// Verificați acreditările de conectare
async function checkCredentials(username, password) {
  if (!username || !password) {
    throw new Error("Invalid username or password");
  }

  const [user] = await db.query(
    "SELECT * FROM users WHERE username = ? LIMIT 1",
    [username],
  );
  if (user[0].length === 0) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return user[0];
}

// Exemplu de funcție pentru a cripta o parolă și a salva un utilizator
async function createUser(username, password) {
// Verificați dacă numele de utilizator există deja în baza de date
  const [existingUsers] = await db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
  );
  if (existingUsers.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12); // 12 este numărul de runde de sare
  db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
    username,
    hashedPassword,
  ]);
}

module.exports = { db, createUser, checkCredentials };
