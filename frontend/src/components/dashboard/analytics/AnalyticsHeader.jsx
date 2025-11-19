"use client";

const AnalyticsHeader = ({ selectedPeriod, onPeriodChange, loading }) => {
  const periods = [
    { label: "Last 7 Days", value: 7 },
    { label: "Last 30 Days", value: 30 },
    { label: "Last 90 Days", value: 90 },
    { label: "All Time", value: 0 },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-4xl font-bold text-primary">Analytics Dashboard</h1>
      <div className="join">
        {periods.map(({ label, value }) => (
          <button
            key={value}
            className={`join-item btn btn-sm ${selectedPeriod === value ? 'btn-primary' : ''}`}
            onClick={() => onPeriodChange(value)}
            disabled={loading}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsHeader;
