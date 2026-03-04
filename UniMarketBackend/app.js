require("dotenv").config();
const express = require("express");
const sql = require("mssql");

const app = express();
app.use(express.json()); // parse JSON bodies

// These will be removed in the future this is essentially using our .env file which is for testing before full migration to azure and its appservices, aka this is LOCAL validatioon and we would not want these bits of informatiuon getting out to the public
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Test endpoint
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// IN node.js they are called signal but in FLASK this is a POST
app.post("/signal", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ status: "error", error: "Message is required" });

    try {
        // Connect to SQL
        await sql.connect(dbConfig);

        // Insert message
        await sql.query`INSERT INTO Signals (Message) VALUES (${message})`;

        // Return JSON response (Flask-style, stateless)
        res.json({
            status: "success",
            received: message,
            info: "Signal received successfully!"
        });
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ status: "error", error: err.message });
    } finally {
        await sql.close();
    }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));