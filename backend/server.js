const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/* ================= AUDIO ================= */

app.use(
  "/audio",
  express.static(
    path.join(__dirname, "public/audio")
  )
);

/* ================= QUESTIONS ================= */

const questions = require("./data/questions.json");

console.log(
  "🔥 TOTAL SOAL LOADED =",
  questions.length
);

app.get("/api/questions", (req, res) => {
  const type = req.query.type || "all";

  let count = Number(req.query.count);

  if (!count || Number.isNaN(count)) {
    count = 10;
  }

  let filtered = questions;

  if (type !== "all") {
    filtered = questions.filter(
      (q) => q.type === type
    );
  }

  const shuffled = [...filtered].sort(
    () => Math.random() - 0.5
  );

  const result = shuffled.slice(0, count);

  res.json(result);
});

/* ================= EXPORT ================= */

module.exports = app;