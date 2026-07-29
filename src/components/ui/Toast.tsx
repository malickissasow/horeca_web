import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <i className="fas fa-info-circle text-accent"></i>
        <span>{message}</span>
      </div>
    </div>
  );
};
