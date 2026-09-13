import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "../App.css";

export default function DashboardLayout({ children }) {

	const { user, logout } = useAuth();
	const navigate = useNavigate();

	function handleLogout() {

		logout();
		navigate("/login", { replace: true });

	}

	const links = [
		{ to: "/dashboard", label: "Dashboard" },
		{ to: "/resume", label: "Resume" },
		{ to: "/interview", label: "Interview" },
		{ to: "/history", label: "History" },
		{ to: "/profile", label: "Profile" }
	];

	return (

		<div className="app-shell">

			<header className="app-header">

				<NavLink className="app-brand" to="/dashboard">
					AI Interview
				</NavLink>

				<nav className="app-nav" aria-label="Main navigation">

					{links.map((link) => (
						<NavLink
							key={link.to}
							to={link.to}
							className={({ isActive }) =>
								isActive ? "app-nav-link active" : "app-nav-link"
							}
						>
							{link.label}
						</NavLink>
					))}

				</nav>

				<div className="app-account">
					<span>Hi, {user?.name || "Candidate"}</span>
					<button className="app-logout" onClick={handleLogout}>
						<LogOut size={16} aria-hidden="true" />
						Logout
					</button>
				</div>

			</header>

			<div className="app-content">
				{children}
			</div>

		</div>

	);

}
