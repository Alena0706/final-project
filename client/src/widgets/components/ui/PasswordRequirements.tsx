import React from 'react';
import { Check, X } from 'lucide-react';

type PasswordRequirementsProps = {
  password: string;
  className?: string;
};

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  className = '',
}) => {
  const requirements = [
    {
      text: 'Минимум 8 символов',
      isValid: password.length >= 8,
    },
    {
      text: 'Заглавная буква',
      isValid: /[A-Z]/.test(password),
    },
    {
      text: 'Строчная буква',
      isValid: /[a-z]/.test(password),
    },
    {
      text: 'Специальный символ',
      isValid: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-sm font-medium text-foreground">Требования к паролю:</div>
      <div className="space-y-1">
        {requirements.map((requirement) => (
          <div
            key={requirement.text}
            className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
              requirement.isValid
                ? 'text-[hsl(200_80%_60%)] dark:text-[hsl(200_80%_70%)]'
                : 'text-muted-foreground'
            }`}
          >
            {requirement.isValid ? (
              <Check className="h-4 w-4 flex-shrink-0" />
            ) : (
              <X className="h-4 w-4 flex-shrink-0" />
            )}
            <span>{requirement.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
