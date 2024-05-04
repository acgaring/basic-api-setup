require("dotenv").config(); // loads environtment variables
const express = require("express"); //imports the Express framework into your Node.js application.
const Database = require("./config/database"); //imports the file database.js
const logger = require("morgan"); //import morgan

const app = express(); //creates an instance of the Express application.
const db = new Database();

// app.use
app.use(logger("dev")); // logger

//parsing incoming request to JSON payload. Limiting to 50mb.
app.use(express.urlencoded({ limit: "50mb", extended: true })); //parsing incoming request to URL-encoded payloads. Limiting to 50mb.

//GET
app.get("/api/v1/users/get", async (req, res) => {
  try {
    let result = (await db.query(`SELECT * FROM user`))[0];
    return res.status(200).json({ data: result, message: `Success` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/v1/user/add", async (req, res) => {
  const val = req.body;
  try {
    let result = await db.query(`INSERT INTO user SET ?`, val);
    return res.status(200).json({ data: result, message: `Success` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/v1/user/update/:id", async (req, res) => {
  const { id } = req.params; //extracting the id in params object
  const val = req.body;
  try {
    let result = await db.query(`UPDATE user SET ? WHERE id = ?`, [val, id]);
    return res.status(200).json({ data: result, message: `Success` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || "3000";
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
