'use client';

import React, { useEffect, useState } from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

interface ClientIconProps extends LucideProps {
  icon: LucideIcon;
}

export function ClientIcon({ icon: IconComponent, ...props }: ClientIconProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        className={`inline-block ${props.className || ''}`}
        aria-hidden="true"
      />
    );
  }

  return <IconComponent {...props} suppressHydrationWarning />;
}
