import React, { useEffect, useState } from "react";
import axios from "axios";
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/price-history"); // <-- your backend API
      const data = response.data;

      // Map API data to chart format
      const labels = data.map((d) =>
        new Date(d.time).toLocaleString("en-GB", { hour12: false })
      );
      const prices = data.map((d) => d.price);

      setChartData({
        labels,
        datasets: [
          {
            label: "Price",
            data: prices,
            borderColor: "blue",
            backgroundColor: "rgba(0,0,255,0.2)",
            fill: true,
            tension: 0.2,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ width: "90%", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Price History</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Price vs Time Chart",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              title: {
                display: true,
                text: "Price",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PriceChart;
