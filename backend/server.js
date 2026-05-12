const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// 🔥 WAJIB: pastikan file benar-benar kebaca
const questions = require("./data/questions.json");

console.log("🔥 TOTAL SOAL LOADED =", questions.length);

app.get("/api/questions", (req, res) => {
  const type = req.query.type || "all";

  let count = Number(req.query.count);
  if (!count || Number.isNaN(count)) count = 10;

  console.log("TYPE REQUEST:", type);
  console.log("COUNT REQUEST:", count);

  let filtered = questions;

  if (type !== "all") {
    filtered = questions.filter(q => q.type === type);
  }

  console.log("FILTER RESULT:", filtered.length);

  const shuffled = filtered.sort(() => Math.random() - 0.5);
  const result = shuffled.slice(0, count);

  console.log("RETURN:", result.length);

  res.json(result);
});

app.listen(3000, () => {
  console.log("TOEFL API running on http://localhost:3000");
});