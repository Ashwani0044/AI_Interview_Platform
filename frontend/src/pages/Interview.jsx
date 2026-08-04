import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { startInterview } from "../services/interviewService";

import "../styles/interview.css";

export default function Interview() {

    const navigate = useNavigate();

    const location = useLocation();

    const resumeId = location.state?.resumeId;

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        role: "",

        difficulty: "Medium"

    });

    function handleChange(e) {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    }

    async function handleStart() {

        if (!formData.role) {

            alert("Please enter a job role.");

            return;

        }

        try {

            setLoading(true);

            const response = await startInterview({

                resume_id: resumeId,

                role: formData.role,

                difficulty: formData.difficulty

            });

            console.log(response);

            navigate("/session", {

                state: {

                    interview: response.interview,

                    questions: response.questions

                }

            });

        }

        catch (err) {

            console.log(err);

            alert("Failed to start interview.");

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="interview-page">

            <div className="interview-card">

                <h1>

                    AI Interview Setup

                </h1>

                <p>

                    Configure your interview before starting.

                </p>

                <label>

                    Job Role

                </label>

                <input

                    type="text"

                    name="role"

                    placeholder="Backend Developer"

                    value={formData.role}

                    onChange={handleChange}

                />

                <label>

                    Difficulty

                </label>

                <select

                    name="difficulty"

                    value={formData.difficulty}

                    onChange={handleChange}

                >

                    <option>

                        Easy

                    </option>

                    <option>

                        Medium

                    </option>

                    <option>

                        Hard

                    </option>

                </select>

                <button

                    onClick={handleStart}

                    disabled={loading}

                >

                    {

                        loading

                        ?

                        "Starting..."

                        :

                        "Start Interview"

                    }

                </button>

            </div>

        </div>

    );

}