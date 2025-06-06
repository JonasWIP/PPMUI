import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  'full': 'max-w-full'
};

export default function PageContainer({ 
  children, 
  className,
  maxWidth = 'xl' 
}: PageContainerProps) {
  return (
    <div className={cn(
      'container mx-auto px-4 py-8', 
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}