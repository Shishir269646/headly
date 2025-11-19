"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const EngagementChart = ({ trends }) => {
  const formattedData = trends.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd'),
  }));

  return (
    <div className="card bg-base-200 shadow-xl h-full">
      <div className="card-body">
        <h2 className="card-title text-2xl text-primary-content">Engagement Trends</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  borderColor: '#4A5568'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} name="Views" />
              <Line type="monotone" dataKey="likes" stroke="#82ca9d" strokeWidth={2} name="Likes" />
              <Line type="monotone" dataKey="comments" stroke="#fca5a5" strokeWidth={2} name="Comments" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EngagementChart;
