'use client';

import React from 'react';

interface CustomButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'text';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  children,
  disabled = false,
  variant = 'primary',
}) => {
  const baseClass = 'py-2 px-4 rounded-sm';
  const primaryClass = 'bg-wearit-red text-white hover:bg-wearit-green';
  const secondaryClass =
    'text-wearit-red border-2 border-wearit-red hover:border-wearit-green hover:text-wearit-green';
  const textClass =
    'text-xs text-wearit-red hover:underline hover:text-red-600';

  let variantClass = primaryClass;
  if (variant === 'secondary') {
    variantClass = secondaryClass;
  } else if (variant === 'text') {
    variantClass = textClass;
  }

  const buttonClass = `${baseClass} ${variantClass}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default CustomButton;
