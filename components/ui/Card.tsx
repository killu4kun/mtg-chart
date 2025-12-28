import { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200',
        hover && 'hover:shadow-lg hover:border-mtg-blue/50 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
