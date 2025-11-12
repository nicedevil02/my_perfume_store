"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useInView } from '@/lib/hooks/useInView';

const blogPosts = [
  { id: 1, title: 'راهنمای انتخاب عطر مناسب', excerpt: 'نکاتی برای یافتن عطر ایده‌آل', image: 'https://placehold.co/400x300/E8D5F2/8B5CF6?text=Blog+1' },
  { id: 2, title: 'نگهداری صحیح از عطر', excerpt: 'چگونه عطر را بیشتر دوام دهیم؟', image: 'https://placehold.co/400x300/F2D5E8/F65C8B?text=Blog+2' },
  { id: 3, title: 'تفاوت ادوپرفیوم و ادوتویلت', excerpt: 'آشنایی با انواع غلظت عطر', image: 'https://placehold.co/400x300/D5E8F2/5C8BF6?text=Blog+3' },
];

const BlogPreview = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section 
      ref={ref}
      id="blog-preview" 
      className="py-20 lg:py-28 bg-transparent"
    >
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight">
            از وبلاگ ما بخوانید
          </h2>
          <p className="mt-4 text-md lg:text-lg text-gray-600 max-w-2xl mx-auto">
            جدیدترین مقالات، نقدها و راهنماهای دنیای عطر
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {blogPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-10 rounded-xl text-md transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
          >
            مشاهده همه مقالات
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;