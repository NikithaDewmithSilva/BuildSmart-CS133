// src/MaterialDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register necessary chart elements
ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend);

const Sample = () => {
  const [materialData, setMaterialData] = useState({});
  const [chartData, setChartData] = useState(null);

  // Fetch material data from the Flask API
  useEffect(() => {
    axios.get("http://localhost:5000/get_material_data")
      .then(response => {
        const data = response.data;
        setMaterialData(data);

        // Prepare chart data
        const labels = Object.keys(data);
        const totalValues = labels.map(label => data[label].total || 0);
        const usedValues = labels.map(label => data[label].used || 0);
        const remainingValues = totalValues.map((total, index) => total - usedValues[index]);

        setChartData({
          labels,
          datasets: [
            {
              label: "Used",
              data: usedValues,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
            {
              label: "Remaining",
              data: remainingValues,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      })
      .catch(error => {
        console.error("Error fetching material data", error);
      });
  }, []);

  return (
    <div>
      <h1>Material Usage Dashboard</h1>
      <h2>Material Data</h2>
      <table>
        <thead>
          <tr>
            <th>Material</th>
            <th>Total</th>
            <th>Used</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(materialData).map(([material, { total, used }]) => (
            <tr key={material}>
              <td>{material}</td>
              <td>{total}</td>
              <td>{used || 0}</td>
              <td>{total - (used || 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {chartData && (
        <div>
          <h2>Material Usage Chart</h2>
          <Bar data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: "Material Usage Chart" } } }} />
        </div>
      )}
    </div>
  );
};

export default Sample;
