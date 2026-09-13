import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitInterview as submitInterviewRequest } from "../services/interviewService";

import "../styles/interviewSession.css";

export default function InterviewSession() {

    const location = useLocation();
    const navigate = useNavigate();

    const interview = location.state?.interview;
    const questions = location.state?.questions;

    const validSession = interview && Array.isArray(questions) && questions.length > 0;

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answers, setAnswers] = useState(
        (questions || []).map(q => ({
            question_id: q.id,
            answer: ""
        }))
    );

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        if (!validSession) {
            navigate("/dashboard", { replace: true });
        }

    }, [navigate, validSession]);

    if (!validSession) {
        return null;
    }

    const question = questions[currentQuestion];

    function handleAnswerChange(e) {

        setError("");
        setAnswers((currentAnswers) => currentAnswers.map((answer, index) =>
            index === currentQuestion
                ? { ...answer, answer: e.target.value }
                : answer
        ));

    }

    function nextQuestion() {

        if (currentQuestion < questions.length - 1) {

            setCurrentQuestion(currentQuestion + 1);

        }

    }

    function previousQuestion() {

        if (currentQuestion > 0) {

            setCurrentQuestion(currentQuestion - 1);

        }

    }

    async function submitInterview() {

        if (answers.some((answer) => !answer.answer.trim())) {

            setError("Please answer every question before submitting.");

            return;

        }

        try {

            setLoading(true);
            setError("");

            const response = await submitInterviewRequest(interview.id, { answers });

            navigate("/evaluation", {

                state: {

                    evaluation: response.evaluation

                }

            });

        }

        catch (err) {

            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to submit the interview. Please try again."
            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="session-page">

            <div className="session-card">

                <div className="progress">

                    Question {currentQuestion + 1} / {questions.length}

                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="progress-bar">

                    <div

                        className="progress-fill"

                        style={{

                            width: `${((currentQuestion + 1) / questions.length) * 100}%`

                        }}

                    />

                </div>

                <h2>

                    {question.question}

                </h2>

                <textarea

                    rows="10"

                    placeholder="Write your answer here..."

                    value={answers[currentQuestion].answer}

                    onChange={handleAnswerChange}

                    disabled={loading}

                />

                <div className="buttons">

                    <button

                        onClick={previousQuestion}

                        disabled={currentQuestion === 0}

                    >

                        Previous

                    </button>

                    {

                        currentQuestion === questions.length - 1

                        ?

                        <button onClick={submitInterview} disabled={loading}>

                            {loading ? "Submitting..." : "Submit Interview"}

                        </button>

                        :

                        <button onClick={nextQuestion} disabled={loading}>

                            Next

                        </button>

                    }

                </div>

            </div>

        </div>

    );

}