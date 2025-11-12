// صفحه خطای عمومی سفارشی برای اپلیکیشن
"use client";

// صفحه خطای عمومی سفارشی برای اپلیکیشن

import React from "react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h1>خطا رخ داد!</h1>
      <p>{error.message}</p>
      <button onClick={reset}>تلاش مجدد</button>
    </div>
  );
}

