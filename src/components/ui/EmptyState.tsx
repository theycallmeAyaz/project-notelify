import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-primary-light/10 mb-5">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
        <p className="text-neutral mb-6">{description}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="btn btn-primary px-6 py-2"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;