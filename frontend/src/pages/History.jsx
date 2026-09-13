import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getInterview, getInterviewHistory } from "../services/interviewService";

import "../styles/history.css";

export default function History() {

    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        async function loadHistory() {

            try {

                const response = await getInterviewHistory();
                setHistory(response.history || []);

            } catch (err) {

                console.error(err);
                setError("We could not load your interview history.");

            } finally {

                setLoading(false);

            }

        }

        loadHistory();

    }, []);

    async function viewInterview(interviewId) {

        try {

            setDetailsLoading(true);
            setError("");

            const response = await getInterview(interviewId);
            setSelectedInterview(response.interview);

        } catch (err) {

            console.error(err);
            setError("We could not load the interview details.");

        } finally {

            setDetailsLoading(false);

        }

    }

    return (

        <main className="history-page">

            <section className="history-shell">

                <div className="history-heading">
                    <div>
                        <p className="eyebrow">Your progress</p>
                        <h1>Interview history</h1>
                    </div>
                    <button onClick={() => navigate("/interview")}>Start Interview</button>
                </div>

                {error && <p className="form-error">{error}</p>}

                {loading ? (
                    <p className="history-message">Loading your interviews...</p>
                ) : history.length === 0 ? (
                    <div className="history-message">
                        <h2>No interviews yet</h2>
                        <p>Complete an interview to see your progress here.</p>
                    </div>
                ) : (
                    <div className="history-list">
                        {history.map((interview) => (
                            <article className="history-item" key={interview.id}>
                                <div>
                                    <h2>{interview.role}</h2>
                                    <p>
                                        {interview.difficulty} · {new Date(interview.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="history-item-meta">
                                    <span className={`status status-${interview.status}`}>
                                        {interview.status}
                                    </span>
                                    <strong>{interview.overall_score ?? 0}/10</strong>
                                    <button onClick={() => viewInterview(interview.id)} disabled={detailsLoading}>
                                        {detailsLoading ? "Loading..." : "View details"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {selectedInterview && (
                    <section className="interview-details">
                        <div className="details-heading">
                            <div>
                                <p className="eyebrow">Interview details</p>
                                <h2>{selectedInterview.role}</h2>
                            </div>
                            <button className="close-button" onClick={() => setSelectedInterview(null)}>
                                Close
                            </button>
                        </div>

                        {selectedInterview.questions?.map((question) => (
                            <article className="detail-question" key={question.id}>
                                <h3>{question.question}</h3>
                                <p>{question.answer || "No answer recorded."}</p>
                                <span>
                                    Score: {question.score ?? 0}/10
                                    {question.feedback ? ` · ${question.feedback}` : ""}
                                </span>
                            </article>
                        ))}
                    </section>
                )}

            </section>

        </main>

    );

}