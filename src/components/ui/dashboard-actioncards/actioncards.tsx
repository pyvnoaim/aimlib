import React from 'react';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border shadow-lg transition-all duration-300 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      {icon}
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default ActionCard;
