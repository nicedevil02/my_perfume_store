"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, Phone } from "lucide-react";

// آیکن Google با SVG
function GoogleIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 533.5 544.3" aria-hidden="true">
      <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.2h147.2c-6.3 34.1-25.1 63-53.7 82.3v68h86.9c50.9-47 80.1-116.2 80.1-195.2z"/>
      <path fill="#34A853" d="M272 544.3c72.5 0 133.6-23.9 178.2-64.8l-86.9-68c-24.1 16.2-55 25.7-91.3 25.7-70 0-129.3-47.2-150.6-110.7H31.2v69.6c44.4 88 135.1 148.2 240.8 148.2z"/>
      <path fill="#FBBC05" d="M121.4 326.5c-10.5-31.5-10.5-65.5 0-97l.1-69.6H31.2c-41.8 83-41.8 153.2 0 236.2l90.2-69.6z"/>
      <path fill="#EA4335" d="M272 106.1c39.4-.6 77.3 14.6 105.9 41.9l79.3-79.3C407.7 20.3 343.5-.2 272 0 166.2 0 75.5 60.2 31.2 148.2l90.2 69.6C142.7 154.5 201.9 107.3 272 106.1z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [step, setStep] = useState<"CHOOSE" | "IDENTIFY" | "VERIFY">("CHOOSE");
  const [identifier, setIdentifier] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/profile';
  const didSubmitRef = useRef(false);

  // **اصلاح کلیدی**: بررسی دقیق‌تر session
  useEffect(() => {
    console.log("[LoginPage] Session:", { status, user: session?.user?.email });
    
    if (status === "authenticated") {
      console.log("[LoginPage] ✅ Authenticated, redirecting to:", callbackUrl);
      // استفاده از window.location برای force redirect
      window.location.href = callbackUrl;
    }
  }, [status, session, callbackUrl]);

  // useEffect برای auto-submit کد تایید
  useEffect(() => {
    if (step === "VERIFY" && verificationCode.length === 6 && !didSubmitRef.current && !isLoading) {
      const t = setTimeout(() => handleVerify(), 100);
      return () => clearTimeout(t);
    }
  }, [verificationCode, step, isLoading]); // اضافه کردن dependencies

  // **حالا conditional rendering بعد از همه hooks**
  
  // اگر در حال بررسی session است یا لاگین است، loading نشان بده
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0b]">
        <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
        <p className="text-white text-sm">در حال بارگذاری...</p>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0b0b]">
        <Loader2 className="w-8 h-8 animate-spin text-white mb-4" />
        <p className="text-white text-sm">در حال انتقال...</p>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    console.log("[Google] Starting sign in...");
    setIsLoading(true);
    setError(null);
    
    try {
      // **اصلاح کلیدی**: استفاده از callbackUrl
      await signIn("google", {
        callbackUrl: callbackUrl,
        redirect: true,
      });
    } catch (err: any) {
      console.error("[Google] Error:", err);
      setError("خطا در ورود با گوگل.");
      setIsLoading(false);
    }
  };

  const handleSendCode = async (e?: FormEvent) => {
    e?.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "خطا در ارسال کد");
      }
      setStep("VERIFY");
      setVerificationCode("");
    } catch (err: any) {
      setError(err.message || "خطا در ارسال کد");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (didSubmitRef.current || isLoading) return;
    didSubmitRef.current = true;
    setError(null);
    setIsLoading(true);
    try {
      await signIn("credentials", {
        identifier: identifier.trim(),
        code: verificationCode,
        callbackUrl: "/",
        redirect: true,
      });
    } catch {
      setError("خطا در ورود به حساب کاربری.");
      setIsLoading(false);
      didSubmitRef.current = false;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-vazir bg-[#0b0b0b] text-white relative overflow-hidden">
      {/* افکت نور پس‌زمینه */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#101010] to-[#1a1a1a]">
        <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-[#3a3a3a] via-[#6e6e6e] to-transparent rounded-full blur-3xl opacity-20 top-1/4 right-[-200px]" />
      </div>

      {/* چپ: فرم/دکمه‌ها */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 z-10 text-center px-8 md:px-20 py-16">
        <h2 className="text-3xl font-bold mb-10">ورود به حساب کاربری</h2>

        {step === "CHOOSE" && (
          <div className="w-full max-w-sm space-y-4">
            {/* **دکمه ورود با گوگل - فعال شده** */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-full bg-white text-black hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <GoogleIcon size={22} />
              )}
              <span>{isLoading ? "در حال ورود..." : "ورود با گوگل"}</span>
            </button>

            {/* **یا خط جداکننده** */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#0b0b0b] text-gray-400">یا</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep("IDENTIFY")}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-full border border-gray-500 hover:bg-gray-800 transition disabled:opacity-60"
            >
              <Phone size={20} />
              <span>ورود با شماره تلفن/ایمیل</span>
            </button>

            {error && (
              <div className="mt-6 rounded-xl bg-red-600/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* **راهنمای کوتاه** */}
            <p className="mt-6 text-gray-400 text-xs">
              با ورود، شما{" "}
              <a href="#" className="text-gray-200 underline">شرایط استفاده</a> و{" "}
              <a href="#" className="text-gray-200 underline">حریم خصوصی</a> را می‌پذیرید.
            </p>
          </div>
        )}

        {step === "IDENTIFY" && (
          <form onSubmit={handleSendCode} className="w-full max-w-sm space-y-6" autoComplete="on">
            <button
              type="button"
              onClick={() => {
                setStep("CHOOSE");
                setError(null);
              }}
              className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white"
            >
              <ArrowLeft size={16} />
              بازگشت
            </button>

            <div className="text-sm text-gray-400 -mt-2">
              شماره موبایل یا ایمیل را وارد کن تا کد تأیید ارسال شود.
            </div>

            <div>
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username email tel"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="09123456789 یا user@example.com"
                required
                className="w-full rounded-xl border border-gray-700 bg-[#141414] px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-800 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || identifier.trim().length < 5}
              className="w-full bg-white text-black px-4 py-3 rounded-full font-semibold hover:bg-gray-200 transition disabled:opacity-60 flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  در حال ارسال...
                </>
              ) : (
                "ارسال کد تأیید"
              )}
            </button>

            {error && (
              <div className="rounded-xl bg-red-600/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
                {error}
              </div>
            )}
          </form>
        )}

        {step === "VERIFY" && (
          <div className="w-full max-w-sm space-y-6">
            <button
              type="button"
              onClick={() => {
                setStep("IDENTIFY");
                setVerificationCode("");
                setError(null);
              }}
              className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white"
            >
              <ArrowLeft size={16} />
              تغییر شناسه
            </button>

            <div className="rounded-xl bg-[#121212] border border-gray-700 px-4 py-3 text-sm text-gray-300">
              کد ۶ رقمی ارسال‌شده برای{" "}
              <strong className="text-white">{identifier}</strong> را وارد کن.
            </div>

            <div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setVerificationCode(value);
                }}
                inputMode="numeric"
                maxLength={6}
                placeholder="۱۲۳۴۵۶"
                className="w-full tracking-[0.5em] text-center text-lg font-semibold rounded-xl border border-gray-700 bg-[#141414] text-gray-100 px-4 py-3 focus:border-gray-400 focus:ring-2 focus:ring-gray-800 transition"
              />
            </div>

            {isLoading && (
              <div className="flex justify-center items-center gap-2 text-gray-300">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-sm">در حال ورود...</span>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-600/10 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* راست: لوگو/پس‌زمینه */}
      <div className="hidden md:flex w-1/2 relative justify-center items-center overflow-hidden">
        <img
          src="/logo.png"
          alt="لوگو"
          className="absolute opacity-10 scale-150 select-none"
        />
      </div>
    </div>
  );
}
