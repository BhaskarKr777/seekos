'use client';

import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

interface ClientIconProps extends LucideProps {
  icon: LucideIcon;
}

export function ClientIcon({ icon: IconComponent, ...props }: ClientIconProps) {
  return <IconComponent {...props} suppressHydrationWarning />;
}
