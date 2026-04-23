require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const multer = require("multer");
const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: false
    },
    pool: {
        max: 10,        // max connections in pool
        min: 2,         // keep at least 2 alive to avoid cold starts
        idleTimeoutMillis: 30000
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
};

// Create a single pool and reuse it across all requests
const poolPromise = sql.connect(dbConfig)
    .then(pool => {
        console.log("Connected to Azure SQL");
        return pool;
    })
    .catch(err => {
        console.error("Database connection failed:", err);
        process.exit(1);
    });

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

const containerClient = BlobServiceClient
    .fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING)
    .getContainerClient("images");

async function uploadImageToBlob(file) {
    const ext = (file.mimetype.split("/")[1] || "jpg").replace("jpeg", "jpg");
    const blobName = `listings/${uuidv4()}.${ext}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(file.buffer, file.size, {
        blobHTTPHeaders: { blobContentType: file.mimetype }
    });
    return blockBlobClient.url;
}

// Health check
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// GET all listings
app.get("/listings", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT id AS Id, title AS Name, price AS Price, imageURL1 AS ImageUrl
            FROM Listing
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET single listing by id
app.get("/listings/:id", async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, req.params.id)
            .query(`
                SELECT id AS Id, title AS Title, description AS Description,
                       price AS Price, imageURL1, imageURL2, imageURL3, imageURL4
                FROM Listing
                WHERE id = @id
            `);
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Listing not found" });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST create listing
app.post("/listings", upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
]), async (req, res) => {
    const { title, description, price } = req.body;

    if (!title || !price) {
        return res.status(400).json({ error: "title and price are required" });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
        return res.status(400).json({ error: "price must be a valid number" });
    }

    const imageKeys = ["image1", "image2", "image3", "image4"];
    const imageURLs = [null, null, null, null];

    try {
        for (let i = 0; i < imageKeys.length; i++) {
            const files = req.files && req.files[imageKeys[i]];
            if (files && files[0]) {
                imageURLs[i] = await uploadImageToBlob(files[0]);
            }
        }
    } catch (err) {
        console.error("Blob upload error:", err);
        return res.status(500).json({ error: "Image upload failed: " + err.message });
    }

    const desc = description || null;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("title",      sql.NVarChar,  title)
            .input("desc",       sql.NVarChar,  desc)
            .input("price",      sql.Decimal,   parsedPrice)
            .input("imageURL1",  sql.NVarChar,  imageURLs[0])
            .input("imageURL2",  sql.NVarChar,  imageURLs[1])
            .input("imageURL3",  sql.NVarChar,  imageURLs[2])
            .input("imageURL4",  sql.NVarChar,  imageURLs[3])
            .query(
                "INSERT INTO Listing (title, description, price, created_at, updated_at, imageURL1, imageURL2, imageURL3, imageURL4) " +
                "OUTPUT INSERTED.* " +
                "VALUES (@title, @desc, @price, GETDATE(), GETDATE(), @imageURL1, @imageURL2, @imageURL3, @imageURL4)"
            );
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST signal
app.post("/signal", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ status: "error", error: "Message is required" });

    try {
        const pool = await poolPromise;
        await pool.request()
            .input("message", sql.NVarChar, message)
            .query("INSERT INTO Signals (Message) VALUES (@message)");
        res.json({
            status: "success",
            received: message,
            info: "Signal received successfully!"
        });
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ status: "error", error: err.message });
    }
});

app.use((err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
    }
    res.status(400).json({ error: err.message });
});

const httpPort = process.env.PORT || 3000;
app.listen(httpPort, () => console.log(`Server running on port ${httpPort}`));