import { useAuth } from "../context/AuthContext";

import "../styles/profile.css";

export default function Profile() {

    const { user } = useAuth();

    return (

        <main className="profile-page">

            <section className="profile-card">
                <p className="eyebrow">Account</p>
                <h1>Your profile</h1>
                <p className="profile-intro">Your account details are managed by your sign-in account.</p>

                <div className="profile-fields">
                    <div>
                        <span>Name</span>
                        <strong>{user?.name || "Not available"}</strong>
                    </div>
                    <div>
                        <span>Email</span>
                        <strong>{user?.email || "Not available"}</strong>
                    </div>
                    <div>
                        <span>Role</span>
                        <strong>{user?.role || "Candidate"}</strong>
                    </div>
                </div>
            </section>

        </main>

    );

}