import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { startInterview } from "../services/interviewService";
import { getResumes } from "../services/resumeService";

import "../styles/interview.css";

export default function Interview() {

    const navigate = useNavigate();

    const location = useLocation();

    const resumeIdFromNavigation = location.state?.resumeId;

    const [loading, setLoading] = useState(false);

    const [resumes, setResumes] = useState([]);

    const [resumesLoading, setResumesLoading] = useState(true);

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({

        resumeId: resumeIdFromNavigation || "",

        role: "",

        difficulty: "Medium"

    });

    useEffect(() => {

        async function loadResumes() {

            try {

                const response = await getResumes();
                const availableResumes = response.resumes || [];

                setResumes(availableResumes);

                if (!resumeIdFromNavigation && availableResumes.length > 0) {

                    setFormData((current) => ({

                        ...current,

                        resumeId: availableResumes[0].id

                    }));

                }

            } catch (err) {

                console.error(err);
                setError("We could not load your resumes. Please try again.");

            } finally {

                setResumesLoading(false);

            }

        }

        loadResumes();

    }, [resumeIdFromNavigation]);

    function handleChange(e) {

        setError("");

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    }

    async function handleStart(e) {

        e.preventDefault();

        if (!formData.resumeId) {

            setError("Select a resume before starting the interview.");

            return;

        }

        if (!formData.role.trim()) {

            setError("Enter the role you want to practice for.");

            return;

        }

        try {

            setLoading(true);

            const response = await startInterview({

                resume_id: Number(formData.resumeId),

                role: formData.role.trim(),

                difficulty: formData.difficulty

            });

            const questions = response.questions?.questions || response.questions || [];

            if (!response.interview || questions.length === 0) {

                setError("The interview could not be prepared. Please try again.");

                return;

            }

            navigate("/session", {

                state: {

                    interview: response.interview,

                    questions

                }

            });

        }

        catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to start the interview. Please try again."
            );

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

                {error && <p className="form-error">{error}</p>}

                <form onSubmit={handleStart}>

                <label>

                    Resume

                </label>

                <select

                    name="resumeId"

                    value={formData.resumeId}

                    onChange={handleChange}

                    disabled={resumesLoading || loading || resumes.length === 0}

                >

                    <option value="">

                        {resumesLoading ? "Loading resumes..." : "Select a resume"}

                    </option>

                    {resumes.map((resume) => (

                        <option key={resume.id} value={resume.id}>

                            {resume.original_filename || `Resume ${resume.id}`}

                        </option>

                    ))}

                </select>

                <label>

                    Job Role

                </label>

                <input

                    type="text"

                    name="role"

                    placeholder="Backend Developer"

                    value={formData.role}

                    onChange={handleChange}

                    disabled={loading}

                />

                <label>

                    Difficulty

                </label>

                <select

                    name="difficulty"

                    value={formData.difficulty}

                    onChange={handleChange}

                    disabled={loading}

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

                    type="submit"

                    disabled={loading || resumesLoading || resumes.length === 0}

                >

                    {

                        loading

                        ?

                        "Starting..."

                        :

                        "Start Interview"

                    }

                </button>

                </form>

                {resumes.length === 0 && !resumesLoading && (

                    <p className="empty-hint">

                        Upload a resume before starting an interview.

                    </p>

                )}

            </div>

        </div>

    );

}