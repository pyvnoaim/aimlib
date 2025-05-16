import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'full';
}

const baseStyles = 'transition-all duration-300 font-medium active:scale-85';

const variantStyles = {
  solid: 'bg-purple-400 text-white hover:bg-purple-400/70 shadow-md',
  outline:
    'border border-purple-400 text-purple-400 hover:bg-purple-400/70 hover:text-white shadow-sm',
};

const sizeStyles = {
  sm: 'px-4 py-1 text-sm',
  md: 'px-6 py-2 text-md',
  lg: 'px-8 py-3 text-lg',
};

const radiusStyles = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export default function Button({
  children,
  onClick,
  variant = 'solid',
  size = 'lg',
  radius = 'lg',
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        radiusStyles[radius],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
