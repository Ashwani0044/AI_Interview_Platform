import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import "../styles/auth.css";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({

        email: "",

        password: ""

    });

    function handleChange(e) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await loginUser(form);

            login(

                response.user,

                response.access_token

            );

            toast.success("Login Successful");

            navigate("/dashboard");

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Login Failed"

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="auth-container">

            <div className="left-panel">

                <h1>AI Interview</h1>

                <p>

                    Practice smarter.

                    <br />

                    Crack your dream job.

                </p>

            </div>

            <motion.div

                initial={{ opacity: 0, y: 30 }}

                animate={{ opacity: 1, y: 0 }}

                className="login-card"

            >

                <h2>Welcome Back</h2>

                <span>

                    Sign in to continue your AI interview journey.

                </span>

                <form onSubmit={handleSubmit}>

                    <label>Email</label>

                    <input

                        type="email"

                        name="email"

                        value={form.email}

                        onChange={handleChange}

                        placeholder="Enter your email"

                        required

                    />

                    <label>Password</label>

                    <div className="password-box">

                        <input

                            type={

                                showPassword

                                    ? "text"

                                    : "password"

                            }

                            name="password"

                            value={form.password}

                            onChange={handleChange}

                            placeholder="Enter your password"

                            required

                        />

                        <button

                            type="button"

                            onClick={() =>

                                setShowPassword(

                                    !showPassword

                                )

                            }

                        >

                            {

                                showPassword

                                    ? <EyeOff size={20}/>

                                    : <Eye size={20}/>

                            }

                        </button>

                    </div>

                    <div className="forgot-password">

                        <Link to="#">

                            Forgot Password?

                        </Link>

                    </div>

                    <button

                        className="login-btn"

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Logging in..."

                                : "Login"

                        }

                    </button>

                </form>

                <p className="register-text">

                    Don't have an account?

                    <Link to="/register">

                        Register

                    </Link>

                </p>

            </motion.div>

        </div>

    );

}