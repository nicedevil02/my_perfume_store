"use client";

import { useState } from 'react';
import { Star, ThumbsUp, Filter } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Review {
  id: number;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: string;
  likes: number;
  isVerifiedPurchase: boolean;
}

export default function ProductReviews({ reviews }: { reviews: Review[] }) {
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const { data: session } = useSession();

  const filteredReviews = reviews
    .filter(review => !showVerifiedOnly || review.isVerifiedPurchase)
    .sort((a, b) => {
      switch (sortBy) {
        case 'highest': return b.rating - a.rating;
        case 'lowest': return a.rating - b.rating;
        default: return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const averageRating = Math.round(
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  );

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8">نظرات کاربران</h2>

      {/* خلاصه امتیازات */}
      <div className="bg-purple-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-purple-700">{averageRating}</div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-gray-600">از {reviews.length} نظر</span>
        </div>
      </div>

      {/* فیلترها */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2 rounded-lg border border-gray-200"
        >
          <option value="newest">جدیدترین</option>
          <option value="highest">بیشترین امتیاز</option>
          <option value="lowest">کمترین امتیاز</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showVerifiedOnly}
            onChange={(e) => setShowVerifiedOnly(e.target.checked)}
            className="rounded text-purple-600"
          />
          <span>فقط خریداران محصول</span>
        </label>
      </div>

      {/* لیست نظرات */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {review.user.avatar ? (
                  <img src={review.user.avatar} alt="" className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    {review.user.name[0]}
                  </div>
                )}
                <div>
                  <div className="font-medium">{review.user.name}</div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700 mb-4">{review.comment}</p>
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-gray-500 hover:text-purple-600">
                <ThumbsUp size={18} />
                <span>{review.likes}</span>
              </button>
              {review.isVerifiedPurchase && (
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  خریدار محصول
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* فرم ثبت نظر جدید */}
      {session ? (
        <form className="mt-8 bg-gray-50 p-6 rounded-xl">
          <h3 className="font-bold mb-4">ثبت نظر جدید</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="text-gray-300 hover:text-yellow-400"
                >
                  <Star size={24} />
                </button>
              ))}
            </div>
            <textarea
              placeholder="نظر خود را بنویسید..."
              className="w-full rounded-lg border-gray-200 h-32"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              ثبت نظر
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 bg-gray-50 p-6 rounded-xl text-center">
          <p>برای ثبت نظر لطفاً وارد شوید</p>
          <button className="mt-2 text-purple-600 hover:underline">
            ورود به حساب کاربری
          </button>
        </div>
      )}
    </section>
  );
}
