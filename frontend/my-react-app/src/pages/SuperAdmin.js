import Header from "../components/Header";
import SideBar from "../components/SideBar";
import React, { useState} from "react";
import { Icon } from "@iconify/react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function DashBoard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Bar Chart Data
  const barChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: [5000, 7000, 8000, 6000, 9000, 10000],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ["Approved", "Pending", "Rejected", "Updated"],
    datasets: [
      {
        label: "Template Status",
        data: [45, 30, 20, 5],
        backgroundColor: ["#28a745", "#ffc107", "#dc3545", "#0000FF"],
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  

  // Generate random values for goals and progress
  const generateRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const yearlyGoal = generateRandomValue(80, 1200000); // Random yearly goal between 80,000 and 120,000
  const monthlyGoal = yearlyGoal / 12; // Monthly goal based on the yearly goal
  const progressThisYear = generateRandomValue(0, yearlyGoal); // Random progress for the year
  const progressThisMonth = generateRandomValue(0, monthlyGoal); // Random progress for the month

  // Calculate progress percentages
  const yearlyProgressPercentage = (progressThisYear / yearlyGoal) * 100;
  const monthlyProgressPercentage = (progressThisMonth / monthlyGoal) * 100;

  return (
    <>
      <SideBar isCollapsed={isCollapsed} />
      <div className={`dashboardlist ${isCollapsed ? "dashboard-collapsed" : "dashboardlist"}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-content">
          <h2>Dashboard</h2>
          <div className="widgets">
            <div className="widget">
              <Icon icon="mdi:monitor" style={{ fontSize: "40px", color: "#000" }} />
              <p>Total Templates</p>
              <h3>45</h3>
            </div>
            <div className="widget">
              <Icon icon="mdi:progress-check" style={{ fontSize: "40px", color: "#28a745" }} />
              <p>Approved Templates</p>
              <h3>30</h3>
            </div>
            <div className="widget">
              <Icon icon="mdi:clock-outline" style={{ fontSize: "40px", color: "#ffc107" }} />
              <p>Pending Approvals</p>
              <h3>20</h3>
            </div>
            <div className="widget">
              <Icon icon="mdi:pen" style={{ fontSize: "40px", color: "#000" }} />
              <p>Updated Template</p>
              <h3>5</h3>
            </div>
          </div>
          <div className="charts">
            <div className="chart-wrapper">
              <h3 className="chart-title">Monthly Revenue</h3>
              <div className="chart">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>
            <div className="chart-wrapper">
              <h3 className="chart-title">Template Status</h3>
              <div className="chart">
                <Pie data={pieChartData} options={chartOptions} />
              </div>
            </div>
          </div>
          <div className="goal-tracker-container">
            <h3 className="goal-title">Yearly and Monthly Goal Progress</h3>
            <div className="goal-trackers">
              <div className="goal-circle">
                <div
                  className="goal-circle-fill"
                  style={{ height: `${yearlyProgressPercentage}%` }}
                ></div>
                <div className="goal-text">
                  {Math.round(yearlyProgressPercentage)}% <br /> Yearly Goal
                </div>
              </div>
              <div className="goal-circle">
                <div
                  className="goal-circle-fill"
                  style={{ height: `${monthlyProgressPercentage}%` }}
                ></div>
                <div className="goal-text">
                  {Math.round(monthlyProgressPercentage)}% <br /> Monthly Goal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
