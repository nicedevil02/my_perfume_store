"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { MapPin, Plus, Edit, Trash2, Star, Loader2, Home as HomeIcon } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const PROVINCES_DATA = {
  "آذربایجان شرقی": ["تبریز", "مراغه", "مرند", "میانه", "اهر", "بناب", "سراب", "هشترود", "جلفا", "شبستر", "بستان‌آباد", "عجب‌شیر", "ملکان", "آذرشهر", "ورزقان", "چاراویماق", "هوراند", "خداآفرین"],
  "آذربایجان غربی": ["ارومیه", "خوی", "مهاباد", "بوکان", "پیرانشهر", "نقده", "سلماس", "سردشت", "تکاب", "شاهین‌دژ", "چالدران", "اشنویه", "میاندوآب"],
  "اردبیل": ["اردبیل", "پارس‌آباد", "مشگین‌شهر", "خلخال", "گرمی", "نمین", "بیله‌سوار", "نیر", "کوثر"],
  "اصفهان": ["اصفهان", "کاشان", "نجف‌آباد", "خمینی‌شهر", "فلاورجان", "لنجان", "نطنز", "آران‌وبیدگل", "شهرضا", "سمیرم", "مبارکه", "برخوار", "تیران‌وکرون", "فریدون‌شهر", "فریدن", "چادگان", "خوانسار", "گلپایگان", "دهاقان"],
  "البرز": ["کرج", "فردیس", "نظرآباد", "ساوجبلاغ", "اشتهارد", "طالقان"],
  "ایلام": ["ایلام", "دهلران", "مهران", "آبدانان", "دره‌شهر", "ملکشاهی", "سیروان", "چرداول", "ایوان"],
  "بوشهر": ["بوشهر", "دشتستان", "دشتی", "کنگان", "گناوه", "دیلم", "تنگستان", "عسلویه", "جم"],
  "تهران": ["تهران", "ری", "شمیرانات", "ورامین", "رباط‌کریم", "شهریار", "اسلامشهر", "بهارستان", "ملارد", "دماوند", "پردیس", "قدس", "پاکدشت", "قرچک", "فیروزکوه"],
  "چهارمحال و بختیاری": ["شهرکرد", "بروجن", "فارسان", "کوهرنگ", "اردل", "لردگان", "کیار", "سامان"],
  "خراسان جنوبی": ["بیرجند", "قائنات", "نهبندان", "سربیشه", "فردوس", "بشرویه", "خوسف", "سرایان", "زیرکوه"],
  "خراسان رضوی": ["مشهد", "نیشابور", "سبزوار", "تربت‌حیدریه", "کاشمر", "قوچان", "تربت‌جام", "تایباد", "چناران", "درگز", "فریمان", "گناباد", "سرخس", "خواف", "بردسکن", "کلات"],
  "خراسان شمالی": ["بجنورد", "شیروان", "اسفراین", "مانه‌وسملقان", "فاروج", "راز‌وجرگلان", "جاجرم"],
  "خوزستان": ["اهواز", "آبادان", "خرمشهر", "دزفول", "اندیمشک", "شوشتر", "مسجدسلیمان", "بهبهان", "ایذه", "شوش", "امیدیه", "رامهرمز", "ماهشهر", "کارون", "هویزه", "اندیکا", "لالی", "باوی", "گتوند", "رامشیر"],
  "زنجان": ["زنجان", "ابهر", "خدابنده", "خرمدره", "ایجرود", "ماه‌نشان", "طارم"],
  "سمنان": ["سمنان", "شاهرود", "دامغان", "گرمسار", "مهدیشهر", "آرادان", "سرخه", "میامی"],
  "سیستان و بلوچستان": ["زاهدان", "چابهار", "ایرانشهر", "سراوان", "خاش", "نیک‌شهر", "زهک", "کنارک", "میرجاوه", "فنوج", "دلگان", "سرباز", "سیب‌وسوران", "قصرقند"],
  "فارس": ["شیراز", "مرودشت", "کازرون", "جهرم", "فسا", "داراب", "لارستان", "نی‌ریز", "فیروزآباد", "سپیدان", "ارسنجان", "خرم‌بید", "قیروکارزین", "استهبان", "آباده", "خرامه", "کوار", "زرین‌دشت", "بوانات", "سروستان"],
  "قزوین": ["قزوین", "تاکستان", "آبیک", "البرز", "بوئین‌زهرا", "آوج"],
  "قم": ["قم"],
  "کردستان": ["سنندج", "سقز", "مریوان", "بانه", "کامیاران", "قروه", "بیجار", "دهگلان", "دیواندره", "سروآباد"],
  "کرمان": ["کرمان", "سیرجان", "رفسنجان", "جیرفت", "بم", "زرند", "بافت", "کهنوج", "بردسیر", "عنبرآباد", "فهرج", "منوجان", "قلعه‌گنج", "ریگان", "راور"],
  "کرمانشاه": ["کرمانشاه", "اسلام‌آبادغرب", "سنقر", "صحنه", "کنگاور", "هرسین", "گیلانغرب", "جوانرود", "روانسر", "پاوه", "ثلاث‌باباجانی", "دالاهو"],
  "کهگیلویه و بویراحمد": ["یاسوج", "گچساران", "دهدشت", "بهمئی", "چرام", "باشت", "لنده"],
  "گلستان": ["گرگان", "گنبدکاووس", "علی‌آبادکتول", "بندرترکمن", "آق‌قلا", "کلاله", "آزادشهر", "رامیان", "گمیشان", "مینودشت", "مراوه‌تپه"],
  "گیلان": ["رشت", "انزلی", "لاهیجان", "لنگرود", "رودسر", "صومعه‌سرا", "فومن", "تالش", "آستارا", "رضوانشهر", "ماسال", "رودبار", "آستانه‌اشرفیه", "شفت"],
  "لرستان": ["خرم‌آباد", "بروجرد", "دورود", "الیگودرز", "کوهدشت", "نورآباد", "پلدختر", "ازنا", "سلسله"],
  "مازندران": ["ساری", "بابل", "آمل", "قائم‌شهر", "نوشهر", "چالوس", "تنکابن", "بهشهر", "نکا", "رامسر", "بابلسر", "فریدونکنار", "محمودآباد", "جویبار", "سوادکوه", "کلاردشت", "گلوگاه"],
  "مرکزی": ["اراک", "ساوه", "خمین", "محلات", "دلیجان", "تفرش", "آشتیان", "شازند", "زرندیه", "کمیجان"],
  "هرمزگان": ["بندرعباس", "قشم", "میناب", "بندرلنگه", "جاسک", "بستک", "حاجی‌آباد", "پارسیان", "سیریک", "بشاگرد"],
  "همدان": ["همدان", "ملایر", "نهاوند", "تویسرکان", "کبودرآهنگ", "اسدآباد", "رزن", "فامنین"],
  "یزد": ["یزد", "میبد", "اردکان", "بافق", "مهریز", "خاتم", "ابرکوه", "بهاباد", "تفت"],
};

const PROVINCES = Object.keys(PROVINCES_DATA);

interface Address {
  id: string;
  title: string;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { data: addresses, error, isLoading, mutate } = useSWR<Address[]>('/api/profile/addresses', fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    receiverName: '',
    receiverPhone: '',
    province: '',
    city: '',
    postalCode: '',
    address: '',
    isDefault: false,
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const openModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        title: address.title,
        receiverName: address.receiverName,
        receiverPhone: address.receiverPhone,
        province: address.province,
        city: address.city,
        postalCode: address.postalCode,
        address: address.address,
        isDefault: address.isDefault,
      });
      setAvailableCities(PROVINCES_DATA[address.province as keyof typeof PROVINCES_DATA] || []);
    } else {
      setEditingAddress(null);
      setFormData({
        title: '',
        receiverName: '',
        receiverPhone: '',
        province: '',
        city: '',
        postalCode: '',
        address: '',
        isDefault: false,
      });
      setAvailableCities([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingAddress
        ? `/api/profile/addresses/${editingAddress.id}`
        : '/api/profile/addresses';
      const method = editingAddress ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'خطا در ذخیره آدرس');
      }

      await mutate();
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این آدرس اطمینان دارید؟')) return;

    try {
      const res = await fetch(`/api/profile/addresses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('خطا در حذف آدرس');
      await mutate();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/profile/addresses/${id}/set-default`, { method: 'PATCH' });
      if (!res.ok) throw new Error('خطا در تنظیم آدرس پیش‌فرض');
      await mutate();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleProvinceChange = (province: string) => {
    setFormData({ ...formData, province, city: '' });
    setAvailableCities(PROVINCES_DATA[province as keyof typeof PROVINCES_DATA] || []);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl p-8 shadow-2xl">
      {/* Liquid Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-float-1 -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-float-2 -z-10" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <MapPin className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              آدرس‌های من
            </h1>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus size={20} />
            افزودن آدرس جدید
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        )}

        {error && <div className="text-center py-16 text-red-500">خطا در بارگذاری آدرس‌ها</div>}

        {!isLoading && !error && addresses && addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="relative group bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/50 hover:shadow-xl transition-all"
              >
                {addr.isDefault && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                    <Star size={14} fill="currentColor" />
                    پیش‌فرض
                  </div>
                )}
                
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <HomeIcon size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{addr.title}</h3>
                    <p className="text-sm text-gray-600">{addr.receiverName}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p><span className="font-medium">استان:</span> {addr.province}</p>
                  <p><span className="font-medium">شهر:</span> {addr.city}</p>
                  <p><span className="font-medium">کدپستی:</span> {addr.postalCode}</p>
                  <p><span className="font-medium">آدرس:</span> {addr.address}</p>
                  <p><span className="font-medium">تلفن:</span> {addr.receiverPhone}</p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                      <Star size={16} />
                      پیش‌فرض کن
                    </button>
                  )}
                  <button
                    onClick={() => openModal(addr)}
                    className="flex items-center justify-center gap-1 px-4 py-2 text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                  >
                    <Edit size={16} />
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="flex items-center justify-center gap-1 px-4 py-2 text-sm bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : !isLoading && !error && (
          <div className="text-center py-16">
            <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">هنوز آدرسی ثبت نکرده‌اید</p>
            <button
              onClick={() => openModal()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition"
            >
              افزودن اولین آدرس
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              {editingAddress ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">عنوان آدرس *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition outline-none"
                    placeholder="مثلا: منزل، محل کار"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام گیرنده *</label>
                  <input
                    type="text"
                    value={formData.receiverName}
                    onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن گیرنده *</label>
                  <input
                    type="tel"
                    value={formData.receiverPhone}
                    onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                    required
                    maxLength={11}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition outline-none"
                    placeholder="09123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">استان *</label>
                  <select
                    value={formData.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition outline-none"
                  >
                    <option value="">انتخاب کنید</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">شهر *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    disabled={!formData.province}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">ابتدا استان را انتخاب کنید</option>
                    {availableCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">کدپستی (۱۰ رقم) *</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    required
                    maxLength={10}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition outline-none font-mono"
                    placeholder="1234567890"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">آدرس کامل *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition outline-none"
                  placeholder="آدرس دقیق را وارد کنید"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                  تنظیم به عنوان آدرس پیش‌فرض
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'ذخیره'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}