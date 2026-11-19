const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const db = require("../database/db");

// Log in
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter username and password."
        });
    }

    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password."
        });
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    res.status(200).json({
        success: true,
        message: "Logged in successfully."
    });
});

// Log out
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({
            success: true,
            message: "Logged out."
        });
    });
});

// Check if the current visitor is a logged-in admin
router.get("/me", (req, res) => {
    res.status(200).json({
        success: true,
        loggedIn: Boolean(req.session.userId)
    });
});

module.exports = router;