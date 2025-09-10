import React from 'react';

interface ContentTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentTransition({ 
  children, 
  className = '' 
}: ContentTransitionProps): React.JSX.Element {
  return (
    <div className={`transition-opacity duration-200 ease-in-out ${className}`}>
      {children}
    </div>
  );
}
