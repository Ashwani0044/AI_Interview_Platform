import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

import "../styles/interviewSession.css";

export default function InterviewSession() {

    const location = useLocation();
    const navigate = useNavigate();

    const interview = location.state?.interview;
    const questions = location.state?.questions;

    if (!interview || !questions) {
        navigate("/dashboard");
        return null;
    }

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answers, setAnswers] = useState(
        questions.map(q => ({
            question_id: q.id,
            answer: ""
        }))
    );

    const question = questions[currentQuestion];

    function handleAnswerChange(e) {

        const updatedAnswers = [...answers];

        updatedAnswers[currentQuestion].answer = e.target.value;

        setAnswers(updatedAnswers);

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

        try {

            const response = await api.post(

                `/interview/submit/${interview.id}`,

                {

                    answers

                }

            );

            navigate("/evaluation", {

                state: {

                    evaluation: response.data.evaluation

                }

            });

        }

        catch (err) {

            console.log(err);

            alert("Failed to submit interview.");

        }

    }

    return (

        <div className="session-page">

            <div className="session-card">

                <div className="progress">

                    Question {currentQuestion + 1} / {questions.length}

                </div>

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

                        <button onClick={submitInterview}>

                            Submit Interview

                        </button>

                        :

                        <button onClick={nextQuestion}>

                            Next

                        </button>

                    }

                </div>

            </div>

        </div>

    );

}