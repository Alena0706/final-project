import React from 'react';

interface AuthTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuthTransition({ 
  children, 
  className = '' 
}: AuthTransitionProps): React.JSX.Element {
  return (
    <div className={`transition-opacity duration-300 ease-in-out ${className}`}>
      {children}
    </div>
  );
}
