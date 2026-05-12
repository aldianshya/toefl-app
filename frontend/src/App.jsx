import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [answers, setAnswers] = useState([]);

  const [count, setCount] = useState(10);
  const [type, setType] = useState("all");

  // TIMER TOEFL
  const [timeLeft, setTimeLeft] = useState(600);

  // SCORE
  const [correct, setCorrect] = useState(0);

  // ================= TOEFL SCORE =================

  const calculateTOEFLScore = () => {
    const percent = correct / questions.length;

    // simulasi score TOEFL 310 - 677
    return Math.round(310 + percent * (677 - 310));
  };

  // ================= TIMER =================

  useEffect(() => {
    if (!started || finished) return;

    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  // ================= FORMAT TIME =================

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // ================= START TEST =================

  const startTest = async () => {
    const res = await fetch(
      `http://localhost:3000/api/questions?type=${type}&count=${count}`
    );

    const data = await res.json();

    setQuestions(data);

    setIndex(0);
    setCorrect(0);

    setAnswers([]);

    setStarted(true);
    setFinished(false);

    // TIMER BERDASARKAN JUMLAH SOAL
    setTimeLeft(count * 60);
  };

  // ================= HANDLE ANSWER =================

  const handleAnswer = (option) => {
    const current = questions[index];

    const newAnswers = [...answers];
    newAnswers[index] = option;

    setAnswers(newAnswers);

    let totalCorrect = 0;

    questions.forEach((q, i) => {
      const ans =
        i === index ? option : newAnswers[i];

      if (ans === q.answer) {
        totalCorrect++;
      }
    });

    setCorrect(totalCorrect);

    if (index < questions.length - 1) {
      setIndex(index + 1);
    }
  };

  // ================= FINISH =================

  const finishTest = () => {
    setFinished(true);
  };

  // ================= START SCREEN =================

  if (!started) {
    return (
      <div className="app-container">
        <div className="card">

          <h1 className="title">
            🎓 TOEFL Simulation Test
          </h1>

          <div className="form-group">
            <label>Jumlah Soal</label>

            <select
              className="select"
              value={count}
              onChange={(e) =>
                setCount(Number(e.target.value))
              }
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <div className="form-group">
            <label>Section</label>

            <select
              className="select"
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option value="all">All</option>
              <option value="grammar">
                Structure & Written Expression
              </option>

              <option value="reading-comprehension">
                Reading Comprehension
              </option>

              <option value="listening">
                Listening Comprehension
              </option>
            </select>
          </div>

          <button
            className="start-btn"
            onClick={startTest}
          >
            Start TOEFL Test
          </button>

        </div>
      </div>
    );
  }

  // ================= RESULT SCREEN =================

  if (finished || index >= questions.length) {
    return (
      <div className="app-container">
        <div className="card">

          <h1 className="title">
            🎉 TOEFL RESULT
          </h1>

          <div className="result-score">
            TOEFL Score: {calculateTOEFLScore()}
          </div>

          <div className="result-percent">
            Correct: {correct} / {questions.length}
          </div>

          <div className="result-percent">
            Accuracy:{" "}
            {Math.round(
              (correct / questions.length) * 100
            )}
            %
          </div>

          {questions.map((q, i) => (
            <div
              className="review-box"
              key={i}
            >
              <p>
                <b>
                  {i + 1}. {q.question}
                </b>
              </p>

              <p>
                Your Answer:
                <span
                  style={{
                    color:
                      answers[i] === q.answer
                        ? "green"
                        : "red",
                    marginLeft: 6,
                    fontWeight: "bold",
                  }}
                >
                  {answers[i] || "-"}
                </span>
              </p>

              <p>
                Correct Answer:
                <span
                  style={{
                    color: "green",
                    marginLeft: 6,
                    fontWeight: "bold",
                  }}
                >
                  {q.answer}
                </span>
              </p>

              <p style={{ marginTop: 8 }}>
                {q.explanation}
              </p>
            </div>
          ))}

          <button
            className="restart-btn"
            onClick={() => setStarted(false)}
          >
            🔄 Restart Test
          </button>

        </div>
      </div>
    );
  }

  // ================= QUESTION =================

  const q = questions[index];

  return (
    <div className="app-container">
      <div className="card">

        {/* HEADER */}

        <div className="top-bar">

          <div className="question-number">
            Question {index + 1} /{" "}
            {questions.length}
          </div>

          <div className="score-box">
            ⏰ {formatTime(timeLeft)}
          </div>

        </div>

        {/* PROGRESS */}

        <div className="progress-wrapper">
          <div
            className="progress-bar"
            style={{
              width: `${
                ((index + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />
        </div>

        {/* LISTENING */}

        {q.audio && (
          <div className="passage">
            <h3>🎧 Listening Audio</h3>

            <audio controls style={{ width: "100%" }}>
              <source
                src={`http://localhost:3000${q.audio}`}
                type="audio/mpeg"
              />
            </audio>
          </div>
        )}

        {/* PASSAGE */}

        {q?.passage &&
          q.passage.trim() !== "" && (
            <div className="passage">
              <h3>
                📖 Reading Passage
              </h3>

              <p>{q.passage}</p>
            </div>
          )}

        {/* QUESTION */}

        <div className="question-text">
          {q.question}
        </div>

        {/* OPTIONS */}

        <div>
          {q.options.map((option, i) => (
            <button
              key={i}
              className="option-btn"
              onClick={() =>
                handleAnswer(option)
              }
            >
              {option}
            </button>
          ))}
        </div>

        {/* FOOTER */}

        <div style={{ marginTop: 20 }}>
          <button
            className="finish-btn"
            onClick={finishTest}
          >
            ✅ Finish Test
          </button>
        </div>

      </div>
    </div>
  );
}