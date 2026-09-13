import { useLocation, useNavigate } from "react-router-dom";

import "../styles/evaluation.css";

function formatScore(score) {

    if (score === null || score === undefined || score === "") {
        return "-";
    }

    return `${score}/10`;

}

export default function Evaluation() {

    const location = useLocation();
    const navigate = useNavigate();
    const evaluation = location.state?.evaluation;

    if (!evaluation) {

        return (

            <main className="evaluation-page">

                <section className="evaluation-card empty-evaluation">

                    <h1>Evaluation unavailable</h1>
                    <p>Submit an interview to view its evaluation.</p>

                    <button onClick={() => navigate("/dashboard")}>
                        Back to Dashboard
                    </button>

                </section>

            </main>

        );

    }

    const answers = Array.isArray(evaluation.answers)
        ? evaluation.answers
        : [];

    return (

        <main className="evaluation-page">

            <section className="evaluation-card">

                <div className="evaluation-heading">
                    <div>
                        <p className="eyebrow">Interview complete</p>
                        <h1>Your evaluation</h1>
                    </div>

                    <div className="overall-score">
                        <span>Overall score</span>
                        <strong>{formatScore(evaluation.overall_score)}</strong>
                    </div>
                </div>

                {evaluation.overall_feedback && (
                    <div className="feedback-panel">
                        <h2>Overall feedback</h2>
                        <p>{evaluation.overall_feedback}</p>
                    </div>
                )}

                <div className="answer-feedback">
                    <h2>Question feedback</h2>

                    {answers.length === 0 ? (
                        <p className="muted-text">No question-level feedback was returned.</p>
                    ) : (
                        answers.map((answer, index) => (
                            <article className="answer-item" key={`${answer.question_number}-${index}`}>
                                <div className="answer-item-heading">
                                    <h3>Question {answer.question_number || index + 1}</h3>
                                    <span>{formatScore(answer.score)}</span>
                                </div>
                                <p>{answer.feedback || "No feedback was provided."}</p>
                            </article>
                        ))
                    )}
                </div>

                <div className="evaluation-actions">
                    <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
                    <button className="secondary-button" onClick={() => navigate("/history")}>
                        View History
                    </button>
                </div>

            </section>

        </main>

    );

}
