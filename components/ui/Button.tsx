import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm',
        {
          'bg-gradient-to-r from-mtg-blue to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105': variant === 'primary',
          'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-md': variant === 'secondary',
          'bg-gradient-to-r from-mtg-red to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-105': variant === 'danger',
          'bg-gradient-to-r from-mtg-green to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-105': variant === 'success',
          'px-2 py-1 text-sm': size === 'sm',
          'px-4 py-2': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

