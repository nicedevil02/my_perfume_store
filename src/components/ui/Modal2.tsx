// src/components/ui/Modal.tsx
"use client"; // این کامپوننت برای مدیریت باز و بسته شدن نیاز به کلاینت دارد

import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react'; // آیکون برای دکمه بستن
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const modalSizes = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-full'
};

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md' // سایز پیش‌فرض
}: ModalProps) {
  
  useEffect(() => {
    // جلوگیری از اسکرول صفحه اصلی وقتی مودال باز است
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // پاک‌سازی با unmount شدن کامپوننت
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-fade-in`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          aria-label="بستن"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  // Use portal to render at root level
  if (typeof window !== 'undefined') {
    const portalRoot = document.getElementById('portal-root');
    if (portalRoot) {
      return createPortal(modalContent, portalRoot);
    }
  }

  return modalContent;
}