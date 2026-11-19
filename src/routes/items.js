const express = require("express");
const router = express.Router();
const db = require("../database/db");
const requireAdmin = require("../middleware/requireAdmin");

// Get all items (optional: ?search=word and ?type=Lost or Found)
router.get("/", (req, res) => {
    const { search, type } = req.query;

    let sql = "SELECT * FROM items WHERE 1=1";
    const params = [];

    if (search) {
        sql += " AND (item_name LIKE ? OR description LIKE ? OR location LIKE ?)";
        const term = `%${search}%`;
        params.push(term, term, term);
    }

    if (type && ["Lost", "Found"].includes(type)) {
        sql += " AND report_type = ?";
        params.push(type);
    }

    sql += " ORDER BY created_at DESC";

    const items = db.prepare(sql).all(...params);

    res.status(200).json({
        success: true,
        items: items
    });
});

// Add a new lost or found item
router.post("/", (req, res) => {
    const { item_name, description, location, report_date, report_type } = req.body;

    if (!item_name || !description || !location || !report_date || !report_type) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all fields."
        });
    }

    if (!["Lost", "Found"].includes(report_type)) {
        return res.status(400).json({
            success: false,
            message: "Report type must be Lost or Found."
        });
    }

    const result = db.prepare(`
        INSERT INTO items (item_name, description, location, report_date, report_type)
        VALUES (?, ?, ?, ?, ?)
    `).run(item_name, description, location, report_date, report_type);

    res.status(201).json({
        success: true,
        message: "Item reported successfully.",
        itemId: result.lastInsertRowid
    });
});
// Update the status of an item (Active or Returned)
router.patch("/:id/status", requireAdmin, (req, res) => {
    const { status } = req.body;

    if (!["Active", "Returned"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Status must be Active or Returned."
        });
    }

    const result = db.prepare(`
        UPDATE items SET status = ? WHERE id = ?
    `).run(status, req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "Item not found."
        });
    }

    res.status(200).json({
        success: true,
        message: "Status updated."
    });
});
module.exports = router;