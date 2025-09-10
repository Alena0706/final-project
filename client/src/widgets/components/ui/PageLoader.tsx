import React from 'react';
import Spinner from './Spinner';

interface PageLoaderProps {
  message?: string;
  className?: string;
}

export default function PageLoader({ 
  message = 'Загрузка...', 
  className = '' 
}: PageLoaderProps): React.JSX.Element {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
        <p className="text-muted-foreground text-lg">{message}</p>
      </div>
    </div>
  );
}
