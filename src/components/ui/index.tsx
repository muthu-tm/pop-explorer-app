'use client';
import React from 'react';
import { getStatusClass } from '@/utils/formatters';
import { StatusType } from '@/types';

interface LoadingButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  isLoading = false,
  children,
  className = 'bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm',
  disabled = false,
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${className} ${(isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : ''} transition-opacity`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

interface EmptyStateProps {
  message: string;
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, actionButton }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p className="mb-4">{message}</p>
      {actionButton}
    </div>
  );
};