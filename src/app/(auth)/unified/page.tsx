"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

type AuthStep = "INITIAL" | "VERIFY" | "REGISTER" | "COMPLETE_PROFILE";

export default function UnifiedAuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>("INITIAL");
  const [identifier, setIdentifier] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const isEmail = identifier.includes("@");
  const Icon = isEmail ? Mail : Phone;

  // اضافه کردن تایمر برای ارسال مجدد کد
  useEffect(() => {
    if (timer > 0 && step === "VERIFY") {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, step]);

  // اضافه کردن useEffect برای submit اتوماتیک
  useEffect(() => {
    if (step === "VERIFY" && verificationCode.length === 6) {
      // کاهش تاخیر برای تجربه کاربری بهتر
      const timer = setTimeout(() => {
        handleVerifySubmit(new Event('submit') as any);
      }, 100); // کاهش تاخیر از 500 به 100
      return () => clearTimeout(timer);
    }
  }, [verificationCode, step]);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });

      if (!res.ok) throw new Error(await res.text());
      
      setStep("VERIFY");
      setTimer(120); // 2 دقیقه تایمر
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        code: verificationCode,
        redirect: false,
      });

      if (result?.error) {
        setError("کد تأیید نامعتبر یا منقضی شده است.");
        setIsLoading(false);
        return;
      }

      // رفرش کامل صفحه برای بارگذاری مجدد نشست
      window.location.href = "/profile";

    } catch (error: any) {
      setError("خطا در ورود به حساب کاربری.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 px-4">
      <div className="w-full max-w-md">
        {/* لوگو */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-extrabold text-purple-600 dark:text-purple-400">
              AQS
            </h1>
          </Link>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">ورود | ثبت‌نام</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">سلام!</p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="ml-2 shrink-0" size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {step === "INITIAL" && (
            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  لطفا شماره موبایل یا ایمیل خود را وارد کنید
                </label>
                <div className="relative">
                  <input
                    type={isEmail ? "email" : "tel"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full p-3 pr-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600"
                    placeholder={isEmail ? "example@gmail.com" : "09123456789"}
                    pattern={isEmail ? undefined : "^09\\d{9}$"}
                    required
                  />
                  <Icon className="absolute top-3 right-3 text-gray-400" size={20} />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "ورود"}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
                ورود شما به معنای پذیرش{" "}
                <Link href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
                  شرایط و قوانین
                </Link>{" "}
                و{" "}
                <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
                  قوانین حریم خصوصی
                </Link>{" "}
                است.
              </p>
            </form>
          )}

          {step === "VERIFY" && (
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  کد تأیید ارسال شده را وارد کنید
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                />
                {timer > 0 ? (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} تا ارسال مجدد کد
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleInitialSubmit}
                    className="w-full text-sm text-purple-600 mt-2"
                  >
                    ارسال مجدد کد
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "تأیید و ورود"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
