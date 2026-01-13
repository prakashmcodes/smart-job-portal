require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db/mysql");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ message: "Database connected!", rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);
