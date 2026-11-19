// Blocks anyone who is not logged in as an admin
function requireAdmin(req, res, next) {
    if (req.session && req.session.userId && req.session.role === "admin") {
        return next();
    }

    res.status(401).json({
        success: false,
        message: "Admin login required."
    });
}

module.exports = requireAdmin;