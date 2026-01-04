import React from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4">
          <Logo size="sm" showText />
          <p className="text-center text-gray-600 text-xs sm:text-sm leading-relaxed px-2">
            © 2025 Jashore University of Science and Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}