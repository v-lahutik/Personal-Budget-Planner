import React, { useEffect, useContext } from 'react';
import { Chart, registerables } from 'chart.js';
import { BudgetContext } from '../context/Context.jsx';

Chart.register(...registerables); // Register Chart.js components

const IncomeChart = () => {
  const { state } = useContext(BudgetContext); // Get the budget context

  useEffect(() => {
    const ctx = document.getElementById('incomeCategoryChart').getContext('2d');

    // Group data by month and category
    const categoryData = {};

    state.transactions.forEach(transaction => {
      // Only include income transactions
      if (transaction.type === "income") {
        const month = transaction.month;
        const category = transaction.category;
        const amount = parseFloat(transaction.amount); // Convert amount to number

        // Initialize the structure if not already present
        if (!categoryData[month]) {
          categoryData[month] = {};
        }

        // Initialize category if not present
        if (!categoryData[month][category]) {
          categoryData[month][category] = 0;
        }

        // Aggregate the amount
        categoryData[month][category] += amount;
      }
    });

    // Define a static list of months from January to December
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const labels = months; // Use static month labels
    const categories = [...new Set(state.transactions
      .filter(t => t.type === "income") // Only include income transactions
      .map(t => t.category))]; // Unique categories

    const data = {
      labels: labels,
      datasets: categories.map(category => ({
        label: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize category names
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`, // Random color for each category
        borderColor: 'rgba(0, 0, 0, 1)', // Black border
        data: months.map(month => Math.abs(categoryData[month]?.[category] || 0)), // Get data for each category, using absolute values
      })),
    };

    const config = {
      type: 'bar', // Use 'bar' for grouped bar chart
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            text: 'Monthly Specific Income',
            display: false,
            font: {
              size: 24,
              weight: 'bold',
            },
          },
        },
        scales: {
          x: {
            stacked: false, // Stack false to display grouped bars
            title: {
              display: false,
              text: 'Month',
            },
            ticks: {
              autoSkip: false, // Ensure all months are displayed
            },
          },
          y: {
            stacked: false, // Stack false to display grouped bars
            title: {
              display: true,
              text: 'Amount (€)',
            },
            beginAtZero: true,
            min: 0, // Set the minimum value to 0
          },
        },
      },
    };

    const chart = new Chart(ctx, config);

    // Cleanup the chart instance on component unmount
    return () => {
      chart.destroy();
    };
  }, [state.transactions]); // Update the chart if transactions change

  return (
    <div className="my-8 mx-auto max-w-screen-lg p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Monthly Income</h2>
      <div style={{ position: 'relative', height: '500px', width: '100%' }}>
        <canvas id="incomeCategoryChart"></canvas>
      </div>
    </div>
  );
};

export default IncomeChart;
