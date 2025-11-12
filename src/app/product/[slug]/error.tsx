'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function ProductError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-lg font-semibold">مشکلی پیش آمد</h2>
        <p className="mt-2 text-sm text-gray-500">{error.message}</p>
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
