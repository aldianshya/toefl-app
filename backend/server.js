const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/audio",
  express.static(
    path.join(__dirname, "public/audio")
  )
);

const questions = require("./data/questions.json");

app.get("/questions", (req, res) => {

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

module.exports = app;