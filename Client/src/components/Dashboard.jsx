import "./Profile.css";
import { useState } from "react";
import * as api from "../util/api.js";

function Dashboard(props) {
    const [passwordWrong, setPasswordWrong] = useState(false);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const getAnalytics = async () => {
        setLoading(true);
        const data = await api.matches.getDashboardStats(password);
        setAnalytics(data);
        setLoading(false);
        if (!data) {
            setPasswordWrong(true);
        }
    };
    if (!props.user || loading) {
        return <div>Loading...</div>
    }
    if(analytics!==null) {
        return (
            <div className="matches_container">
                <h2>Analytics</h2>
                <p>Free Users: {analytics.numFreeMembers || 0}</p>
                <p>Paid Users: {analytics.numPaidMembers || 0}</p>
                <p>Number of user matches: {analytics.numMatches || 0}</p>
                <p>Amount of communications shared: {analytics.numCommunicationShares || 0}</p>
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
            {passwordWrong && <p style={{color: "red"}}>Incorrect password or failed to load analytics.</p>}
        </div>
    );
}
export default Dashboard;