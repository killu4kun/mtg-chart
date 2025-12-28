'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = 'Voltar', className }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleClick}
      className={`flex items-center gap-2 ${className || ''}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  );
}

