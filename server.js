const express = require("express");
const session = require("express-session");
const path = require("path");
const db = require("./src/database/db");
const itemsRouter = require("./src/routes/items");
const authRouter = require("./src/routes/auth");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || "dev-only-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 }
}));

app.use("/api/auth", authRouter);
app.use("/api/items", itemsRouter);
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Campus Lost and Found server is running!",
        database: db.open ? "Connected" : "Disconnected"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});