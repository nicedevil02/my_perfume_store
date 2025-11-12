// src/components/home/AiFinderCta.tsx
"use client";

import { useModalStore } from '@/store/useModalStore';
import { Sparkles } from 'lucide-react';

export default function AiFinderCta() {
  const { openAiFinderModal } = useModalStore();

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto px-4 text-center text-white">
        <Sparkles size={48} className="mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">نمی‌دانید کدام عطر مناسب شماست؟</h2>
        <p className="text-lg mb-6 opacity-90">با کمک هوش مصنوعی، بهترین عطر را پیدا کنید</p>
        <button
          onClick={openAiFinderModal}
          className="px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transition"
        >
          شروع کنید
        </button>
      </div>
    </section>
  );
}