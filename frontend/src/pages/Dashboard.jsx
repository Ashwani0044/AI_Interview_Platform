import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    FileText,
    Mic,
    Star,
    Upload,
    ArrowRight,
    LogOut
} from "lucide-react";

import { getResumes } from "../services/resumeService";
import { getInterviewHistory } from "../services/interviewService";

import "../styles/dashboard.css";

export default function Dashboard() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [resumeCount, setResumeCount] = useState(0);

    const [interviews, setInterviews] = useState([]);

    const [averageScore, setAverageScore] = useState(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    async function loadDashboard() {

        try {

            const resumeResponse = await getResumes();

            const interviewResponse = await getInterviewHistory();

            const resumes = resumeResponse.resumes || [];

            const history = interviewResponse.history || [];

            setResumeCount(resumes.length);

            setInterviews(history);

            if (history.length > 0) {

                const total = history.reduce(

                    (sum, interview) =>

                        sum + (interview.overall_score || 0),

                    0

                );

                setAverageScore(

                    Math.round(total / history.length)

                );

            }

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    function handleLogout() {

        logout();

        navigate("/login");

    }

    return (

        <div className="dashboard">

            {/* ================= NAVBAR ================= */}

            <nav className="navbar">

                <h2>

                    AI Interview

                </h2>

                <div className="nav-right">

                    <span>

                        Hi, {user?.name}

                    </span>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >

                        <LogOut size={18} />

                        Logout

                    </button>

                </div>

            </nav>

            {/* ================= HERO ================= */}

            <section className="hero">

                <h1>

                    Welcome Back,
                    {" "}
                    {user?.name} 

                </h1>

                <p>

                    Ready to crack your next interview today?

                </p>

            </section>

            {/* ================= STATS ================= */}

            <section className="stats">

                <div className="stat-card">

                    <FileText size={34} />

                    <h3>

                        Resume

                    </h3>

                    <h2>

                        {loading ? "..." : resumeCount}

                    </h2>

                    <span>

                        Uploaded

                    </span>

                </div>

                <div className="stat-card">

                    <Mic size={34} />

                    <h3>

                        Interviews

                    </h3>

                    <h2>

                        {loading ? "..." : interviews.length}

                    </h2>

                    <span>

                        Completed

                    </span>

                </div>

                <div className="stat-card">

                    <Star size={34} />

                    <h3>

                        Average Score

                    </h3>

                    <h2>

                        {loading ? "..." : `${averageScore}%`}

                    </h2>

                    <span>

                        Performance

                    </span>

                </div>

            </section>

            {/* ================= ACTIONS ================= */}

            <section className="actions">

                <div
                    className="action-card"
                    onClick={() => navigate("/resume")}
                >

                    <Upload size={42} />

                    <h2>

                        Upload Resume

                    </h2>

                    <p>

                        Upload your latest resume to begin AI interviews.

                    </p>

                    <ArrowRight />

                </div>

                <div
                    className="action-card"
                    onClick={() => navigate("/interview")}
                >

                    <Mic size={42} />

                    <h2>

                        Start Interview

                    </h2>

                    <p>

                        Begin an AI-powered mock interview.

                    </p>

                    <ArrowRight />

                </div>

            </section>

            {/* ================= RECENT ================= */}

            <section className="recent">

                <div className="section-title">

                    <h2>

                        Recent Interviews

                    </h2>

                </div>

                {

                    interviews.length === 0 ?

                        (

                            <div className="empty-state">

                                <Mic size={55} />

                                <h3>

                                    No Interviews Yet

                                </h3>

                                <p>

                                    Upload your resume and start your first AI interview.

                                </p>

                            </div>

                        )

                        :

                        (

                            interviews.map((interview) => (

                                <div
                                    key={interview.id}
                                    className="history-card"
                                >

                                    <h3>

                                        {interview.role}

                                    </h3>

                                    <p>

                                        Difficulty :
                                        {" "}
                                        {interview.difficulty}

                                    </p>

                                    <p>

                                        Status :
                                        {" "}
                                        {interview.status}

                                    </p>

                                    <p>

                                        Score :
                                        {" "}
                                        {interview.overall_score ?? 0}%

                                    </p>

                                </div>

                            ))

                        )

                }

            </section>

        </div>

    );

}