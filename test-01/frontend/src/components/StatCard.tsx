import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
}

/**
 * Component to display a statistic card with a label and value.
 */
const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
      <p className="text-lg text-gray-600 mb-1">{label}</p>
      <p className="text-4xl font-bold text-amber-800">{value}</p>
    </div>
  );
};

export default StatCard;
