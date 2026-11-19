const bcrypt = require("bcryptjs");
const db = require("./db");

const [username, password] = process.argv.slice(2);

if (!username || !password) {
    console.log("Usage: node src/database/create-admin.js USERNAME PASSWORD");
    process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

try {
    db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')")
      .run(username, hash);
    console.log("Admin created:", username);
} catch (err) {
    console.log("Could not create admin:", err.message);
}