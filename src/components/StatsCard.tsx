import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  secondaryText?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
  secondaryText
}) => {
  return (
    <div
      className={`${bgColor} rounded-xl p-6 text-center hover:shadow-lg transition-shadow`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div
        className={`text-3xl font-bold ${textColor}`}
      >
        {value}
      </div>
      <div className="text-sm mt-2 font-medium">{title}</div>
      {secondaryText && (
        <div className="text-xs mt-1 text-gray-500">{secondaryText}</div>
      )}
    </div>
  );
};

export default StatsCard;