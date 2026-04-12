import "./Profile.css";
import { useState } from "react";
import * as api from "../util/api.js";

function Dashboard(props) {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const getAnalytics = async () => {
        setLoading(true);
        const data = await api.profile.getDashboardStats(password);
        console.log("Analytics data:", data);
        setAnalytics(data);
        setLoading(false);
    };
    if (!props.user || loading) {
        return <div>Loading...</div>
    }
    if(analytics!==null) {
        return (
            <div className="matches_container">
                <h1>Analytics</h1>
                <pre>{JSON.stringify(analytics, null, 2)}</pre>
            </div>
        );
    }
    return (
        <div className="matches_container">
            <h1>Admin Dashboard</h1>
            <h2>Welcome, {props.user.username}</h2>
            <p>This is a protected admin dashboard. Only users with administrator privileges should be able to access this page.</p>
            <p>Here you can view the analytics for the application.</p>
            <h5>Please enter the administrator password:</h5>
            <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={getAnalytics}>
                Get Analytics
            </button>
        </div>
    );
}
export default Dashboard;