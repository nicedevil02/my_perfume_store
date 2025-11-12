"use client";

import { useState, useEffect, FormEvent } from "react";
import useSWR from "swr";
import { Loader2, CheckCircle2, Mail, Phone as PhoneIcon, CreditCard, Building2, User as UserIcon, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  const matches = cleaned.match(/(\d{1,4})/g);
  return matches ? matches.join("-") : "";
};

export default function SettingsPage() {
  const { data: user, error, isLoading: isLoadingData, mutate } = useSWR("/api/profile/settings", fetcher);
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [shebaNumber, setShebaNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");
  const [isSendingPhoneCode, setIsSendingPhoneCode] = useState(false);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setNationalId(user.nationalId || "");
      setCardNumber(user.cardNumber ? formatCardNumber(user.cardNumber) : "");
      setShebaNumber(user.shebaNumber || "");
    }
  }, [user]);

  const refreshSession = async () => {
    try {
      await updateSession();
      router.refresh();
    } catch (err) {
      console.error("Failed to refresh session", err);
    }
  };

  const handleSendPhoneCode = async () => {
    setIsSendingPhoneCode(true);
    setSubmitMessage(null);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: phone }),
      });
      if (!res.ok) throw new Error("خطا در ارسال کد تایید.");
      setIsVerifyingPhone(true);
      setSubmitMessage({ type: "success", text: `کد تایید به شماره ${phone} ارسال شد.` });
    } catch (err: any) {
      setSubmitMessage({ type: "error", text: err.message });
    } finally {
      setIsSendingPhoneCode(false);
    }
  };

  const handleVerifyPhone = async () => {
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const res = await fetch("/api/profile/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: phoneVerificationCode }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در تایید شماره.");

      await mutate();
      await refreshSession();
      setIsEditingPhone(false);
      setIsVerifyingPhone(false);
      setPhoneVerificationCode("");
      setSubmitMessage({ type: "success", text: result.message });
    } catch (err: any) {
      setSubmitMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmailCode = async () => {
    setIsSendingEmailCode(true);
    setSubmitMessage(null);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email }),
      });
      if (!res.ok) throw new Error("خطا در ارسال کد تایید.");
      setIsVerifyingEmail(true);
      setSubmitMessage({ type: "success", text: `کد تایید به ایمیل ${email} ارسال شد.` });
    } catch (err: any) {
      setSubmitMessage({ type: "error", text: err.message });
    } finally {
      setIsSendingEmailCode(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const res = await fetch("/api/profile/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: emailVerificationCode }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در تایید ایمیل.");

      await mutate();
      await refreshSession();
      setIsEditingEmail(false);
      setIsVerifyingEmail(false);
      setEmailVerificationCode("");
      setSubmitMessage({ type: "success", text: result.message });
    } catch (err: any) {
      setSubmitMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // **اصلاح کلیدی**: اطمینان از ارسال تمام فیلدهای قابل ویرایش
      const payload = {
        name: name.trim() || null,
        nationalId: nationalId.trim() || null,
        cardNumber: cardNumber.trim() || null,
        shebaNumber: shebaNumber.trim() || null,
      };

      console.log('[Settings] Saving payload:', payload); // برای دیباگ

      const res = await fetch("/api/profile/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطا در ذخیره اطلاعات");

      await mutate();
      await refreshSession();

      setSubmitMessage({ type: "success", text: "اطلاعات با موفقیت ذخیره شد." });
    } catch (err: any) {
      console.error('[Settings] Save error:', err);
      setSubmitMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-float-1" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-float-2" />
        <div className="relative space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-center text-red-500">خطا در بارگذاری اطلاعات.</div>;

  const hasPhone = !!user?.phone;
  const hasEmail = !!user?.email;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl p-8 shadow-2xl">
      {/* Liquid Background Blobs - با z-index پایین */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-float-1 -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-float-2 -z-10" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-bl from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-float-3 -translate-x-1/2 -translate-y-1/2 -z-10" />

      <div className="relative z-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Sparkles className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            اطلاعات حساب کاربری
          </h1>
        </div>

        <form onSubmit={handleSaveChanges} className="space-y-6 max-w-2xl relative z-20">
          {/* **مهم**: اضافه کردن z-20 به form */}
          
          {/* Name */}
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 z-20">
            {/* **مهم**: اضافه کردن z-20 به هر کارت فیلد */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            <div className="relative z-10">
              {/* **مهم**: محتوای داخل کارت با z-10 نسبت به پس‌زمینه کارت */}
              <div className="flex items-center gap-3 mb-3">
                <UserIcon size={20} className="text-purple-600" />
                <label className="text-sm font-medium text-gray-700">نام و نام خانوادگی</label>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none relative z-10"
                placeholder="نام کامل خود را وارد کنید"
              />
            </div>
          </div>

          {/* Email */}
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <Mail size={20} className="text-blue-600" />
                <label className="text-sm font-medium text-gray-700">پست الکترونیکی</label>
                {hasEmail && <CheckCircle2 size={16} className="text-green-500" />}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={hasEmail && !isEditingEmail}
                  className={`flex-1 bg-white/50 border-2 rounded-xl px-4 py-3 transition-all outline-none ${
                    hasEmail && !isEditingEmail
                      ? "border-gray-200 cursor-not-allowed opacity-60"
                      : "border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                  }`}
                  placeholder="example@email.com"
                />
                {hasEmail && !isEditingEmail && (
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(true)}
                    className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-md whitespace-nowrap"
                  >
                    تغییر ایمیل
                  </button>
                )}
                {isEditingEmail && !isVerifyingEmail && (
                  <button
                    type="button"
                    onClick={handleSendEmailCode}
                    disabled={isSendingEmailCode}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSendingEmailCode && <Loader2 className="w-4 h-4 animate-spin" />}
                    تایید
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Email Verification */}
          {isVerifyingEmail && isEditingEmail && (
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg animate-fade-in-down">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30" />
              <label className="block text-sm font-medium text-gray-700 mb-3">کد تایید ارسال شده به ایمیل را وارد کنید</label>
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={emailVerificationCode}
                  onChange={(e) => setEmailVerificationCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="flex-1 bg-white border-2 border-blue-300 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="● ● ● ● ● ●"
                />
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={isSubmitting || emailVerificationCode.length !== 6}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 whitespace-nowrap"
                >
                  بررسی کد
                </button>
              </div>
            </div>
          )}

          {/* Phone */}
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <PhoneIcon size={20} className="text-green-600" />
                <label className="text-sm font-medium text-gray-700">شماره موبایل</label>
                {hasPhone && <CheckCircle2 size={16} className="text-green-500" />}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  maxLength={11}
                  disabled={hasPhone && !isEditingPhone}
                  className={`flex-1 bg-white/50 border-2 rounded-xl px-4 py-3 transition-all outline-none ${
                    hasPhone && !isEditingPhone
                      ? "border-gray-200 cursor-not-allowed opacity-60"
                      : "border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100"
                  }`}
                  placeholder="09123456789"
                />
                {hasPhone && !isEditingPhone && (
                  <button
                    type="button"
                    onClick={() => setIsEditingPhone(true)}
                    className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all shadow-md whitespace-nowrap"
                  >
                    تغییر شماره
                  </button>
                )}
                {isEditingPhone && !isVerifyingPhone && (
                  <button
                    type="button"
                    onClick={handleSendPhoneCode}
                    disabled={isSendingPhoneCode}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSendingPhoneCode && <Loader2 className="w-4 h-4 animate-spin" />}
                    تایید
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Phone Verification */}
          {isVerifyingPhone && isEditingPhone && (
            <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg animate-fade-in-down">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30" />
              <label className="block text-sm font-medium text-gray-700 mb-3">کد تایید ارسال شده را وارد کنید</label>
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={phoneVerificationCode}
                  onChange={(e) => setPhoneVerificationCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="flex-1 bg-white border-2 border-green-300 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                  placeholder="● ● ● ● ● ●"
                />
                <button
                  type="button"
                  onClick={handleVerifyPhone}
                  disabled={isSubmitting || phoneVerificationCode.length !== 6}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg disabled:opacity-50 whitespace-nowrap"
                >
                  بررسی کد
                </button>
              </div>
            </div>
          )}

          {/* Optional Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* National ID */}
            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-3 block">کدملی (اختیاری)</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ""))}
                  maxLength={10}
                  className="w-full bg-white/50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                  placeholder="0123456789"
                />
              </div>
            </div>

            {/* Card Number */}
            <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 z-20">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard size={20} className="text-indigo-600" />
                  <label className="text-sm font-medium text-gray-700">شماره کارت (اختیاری)</label>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="w-full bg-white/50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-mono relative z-10"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                />
              </div>
            </div>
          </div>

          {/* Sheba Number - تمام عرض و بزرگتر */}
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Building2 size={20} className="text-teal-600" />
                <label className="text-sm font-medium text-gray-700">شماره شبا (اختیاری)</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-base">IR</span>
                <input
                  type="text"
                  value={shebaNumber}
                  onChange={(e) => setShebaNumber(e.target.value.replace(/\D/g, "").slice(0, 24))}
                  maxLength={24}
                  className="w-full bg-white/50 border-2 border-gray-200 rounded-xl px-4 py-4 pl-14 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all outline-none font-mono text-left text-xl tracking-[0.15em]"
                  dir="ltr"
                  placeholder="00 0000 0000 0000 0000 0000 00"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isEditingPhone || isEditingEmail}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center gap-2">
              {isSubmitting && !isVerifyingPhone && !isVerifyingEmail ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  ذخیره تغییرات
                </>
              )}
            </div>
          </button>

          {/* Success/Error Message */}
          {submitMessage && (
            <div className={`relative overflow-hidden rounded-2xl p-4 shadow-lg animate-fade-in-up ${
              submitMessage.type === "success"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800"
                : "bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800"
            }`}>
              <div className="flex items-center gap-3">
                {submitMessage.type === "success" ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : (
                  <span className="text-red-600">⚠️</span>
                )}
                <span className="font-medium">{submitMessage.text}</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}