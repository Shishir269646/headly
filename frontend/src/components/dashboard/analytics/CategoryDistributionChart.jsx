"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d'];

const CategoryDistributionChart = ({ distribution }) => {
  if (!distribution || distribution.length === 0) {
    return (
      <div className="card bg-base-200 shadow-xl h-full">
        <div className="card-body items-center justify-center">
          <h2 className="card-title text-2xl text-primary-content mb-4">Category Distribution</h2>
          <p>No content categories to display for this period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl h-full">
      <div className="card-body">
        <h2 className="card-title text-2xl text-primary-content">Category Distribution</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  borderColor: '#4A5568'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CategoryDistributionChart;
