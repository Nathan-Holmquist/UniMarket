require("dotenv").config();
const express = require("express");
const sql = require("mssql");


const app = express();
app.use(express.json()); // parse JSON bodies
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);


// These will be removed in the future this is essentially using our ..env file which is for testing before full migration to azure and its appservices, aka this is LOCAL validatioon and we would not want these bits of informatiuon getting out to the public
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Test endpoint
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// GET all listings
app.get("/listings", async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query`SELECT id, title, price, ImageURL FROM Listing`;
        res.json(result.recordset); // sends back an array of row objects
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ error: err.message });
    } finally {
        await sql.close();
    }
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

// Start server (HTTP port is separate from the DB port)
const httpPort = process.env.PORT || 3000;
app.listen(httpPort, () => console.log(`Server running on port ${httpPort}`));