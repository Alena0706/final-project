import React from 'react';
import { Check, X } from 'lucide-react';

type PasswordMatchProps = {
  password: string;
  passwordConfirm: string;
  className?: string;
};

const PasswordMatch: React.FC<PasswordMatchProps> = ({
  password,
  passwordConfirm,
  className = '',
}) => {
  if (passwordConfirm.length === 0) {
    return null;
  }

  const passwordsMatch = password === passwordConfirm;
  const passwordsNotEmpty = password.length > 0 && passwordConfirm.length > 0;

  return (
    <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${className}`}>
      {passwordsNotEmpty ? (
        passwordsMatch ? (
          <>
            <Check className="h-4 w-4 flex-shrink-0 text-[hsl(200_80%_60%)] dark:text-[hsl(200_80%_70%)]" />
            <span className="text-[hsl(200_80%_60%)] dark:text-[hsl(200_80%_70%)]">
              Пароли совпадают
            </span>
          </>
        ) : (
          <>
            <X className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
            <span className="text-red-600 dark:text-red-400">Пароли не совпадают</span>
          </>
        )
      ) : null}
    </div>
  );
};

export default PasswordMatch;
