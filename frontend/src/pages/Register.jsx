import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import "../styles/auth.css";

import { registerUser } from "../services/authService";

export default function Register() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({

        name: "",

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

            await registerUser(form);

            toast.success("Registration Successful");

            navigate("/login");

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Registration Failed"

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

                    Create your account.

                    <br />

                    Start your interview journey.

                </p>

            </div>

            <motion.div

                initial={{ opacity: 0, y: 30 }}

                animate={{ opacity: 1, y: 0 }}

                className="login-card"

            >

                <h2>Create Account</h2>

                <span>

                    Join AI Interview and start practicing today.

                </span>

                <form onSubmit={handleSubmit}>

                    <label>Name</label>

                    <input

                        type="text"

                        name="name"

                        value={form.name}

                        onChange={handleChange}

                        placeholder="Enter your name"

                        required

                    />

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

                            placeholder="Enter password"

                            required

                        />

                        <button

                            type="button"

                            onClick={() =>

                                setShowPassword(!showPassword)

                            }

                        >

                            {

                                showPassword

                                    ? <EyeOff size={20}/>

                                    : <Eye size={20}/>

                            }

                        </button>

                    </div>

                    <button

                        className="login-btn"

                        disabled={loading}

                    >

                        {

                            loading

                                ? "Creating Account..."

                                : "Register"

                        }

                    </button>

                </form>

                <p className="register-text">

                    Already have an account?

                    <Link to="/login">

                        Login

                    </Link>

                </p>

            </motion.div>

        </div>

    );

}