import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'paid' | 'unpaid';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const isPaid = status === 'paid';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isPaid 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800'
    } ${className}`}>
      {isPaid ? (
        <CheckCircle className="h-3 w-3 mr-1" />
      ) : (
        <Clock className="h-3 w-3 mr-1" />
      )}
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
};

export default StatusBadge;