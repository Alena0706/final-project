import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTransition({ 
  children, 
  className = '' 
}: PageTransitionProps): React.JSX.Element {
  return (
    <div className={`transition-opacity duration-300 ease-in-out ${className}`}>
      {children}
    </div>
  );
}
