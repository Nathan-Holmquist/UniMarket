require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const router = express.Router();
//this line of code here just creates an object that is responsible for deciding what routes signals take to be handlded.
//For instance, you would go through this object which would take a signal and then route/send it to the proper function which should handle it.
//It's the intermittent process before arguments are given to a route.

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


//req = request which means it's the signal/data being sent, and res means response, it's essentially the output.
router.post("/", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ status: "error", error: "Message is required" });

    try {

        await sql.connect(dbConfig); //start the connection to the databasem the logic will change later
        await sql.query`INSERT INTO Signals (Message) VALUES (${message})`;
        res.json({ status: "success", received: message });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", error: err.message });
    } finally {
        await sql.close(); //just close the connection to the sql database
    }
});

module.exports = router;