import { verify2FA } from '@/entities/auth/model/thunks';
import { useAppDispatch } from '@/shared/hooks/hooks';
import { BaseModal } from '@/shared/ui/BaseModal';
import React, { useState } from 'react';

type Props = {
  open: boolean;
  email: string | undefined;
};

export default function TwoFactorModal({ open, email }: Props): React.JSX.Element | null {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState('');
  console.log(email);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCode(event.target.value);
  };

  const handleSubmit = async (): Promise<void> => {
    const isValid = await dispatch(verify2FA({ token: code, email }));
    console.log(isValid);
  };

  return (
    <BaseModal
      isOpen={open}
      onClose={() => {}} // TwoFactorModal не должен закрываться по клику
      title="Введите код двухфакторной аутентификации"
      size="sm"
      showCloseButton={false}
      closeOnBackdropClick={false}
    >
      <div className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          autoFocus
          placeholder="Код 2FA"
          className="w-full rounded-lg border border-border bg-input px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 font-medium transition-colors"
        >
          Подтвердить
        </button>
      </div>
    </BaseModal>
  );
}
