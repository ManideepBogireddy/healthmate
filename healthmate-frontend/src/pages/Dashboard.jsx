import React, { useEffect, useState, useContext } from "react";
import UserService from "../services/user.service";
import { AuthContext } from "../context/AuthContext";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [plan, setPlan] = useState(null);
    const [history, setHistory] = useState([]);
    const [weight, setWeight] = useState("");
    const [calories, setCalories] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        UserService.getHealthPlan().then(
            (response) => {
                setPlan(response.data);
            },
            (error) => {
                console.error("Error fetching plan", error);
            }
        );

        loadHistory();
    }, []);

    const loadHistory = () => {
        UserService.getHistory().then(
            (response) => {
                setHistory(response.data);
            },
            (error) => {
                console.error("Error fetching history", error);
            }
        )
    };

    const handleLogSubmit = (e) => {
        e.preventDefault();
        UserService.logDailyStats(new Date().toISOString().split('T')[0], weight, calories, "Daily Log")
            .then(() => {
                setMsg("Logged successfully!");
                setWeight("");
                setCalories("");
                loadHistory(); // Reload chart
            });
    };

    const chartData = {
        labels: history.map((log) => log.date),
        datasets: [
            {
                label: "Weight (kg)",
                data: history.map((log) => log.weight),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
            {
                label: "Calories Burned",
                data: history.map((log) => log.caloriesBurned),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                yAxisID: 'y1'
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            },
        }
    };

    return (
        <div className="container dashboard-grid" style={{ marginTop: '20px' }}>
            {/* Content removed as per user request to 'remove in this' and keep only tabs */}
            <h2>Dashboard</h2>
        </div>
    );
};

export default Dashboard;
