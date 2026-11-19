
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// Create the data folder if it does not exist
const dataFolder = path.join(__dirname, "../../data");

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
}

// Create or open the database
const db = new Database(path.join(dataFolder, "campus.db"));

db.pragma("foreign_keys = ON");

// Create database tables
db.exec(`
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        report_date TEXT NOT NULL,
        report_type TEXT NOT NULL
            CHECK(report_type IN ('Lost', 'Found')),
        status TEXT NOT NULL DEFAULT 'Active'
            CHECK(status IN ('Active', 'Returned')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin'
    );
`);

console.log("Database connected and tables created!");

module.exports = db;
