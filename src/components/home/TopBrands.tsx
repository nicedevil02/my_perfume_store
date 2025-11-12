// src/components/home/TopBrands.tsx
"use client";

const brands = [
  { name: 'Chanel', logo: '🌸' },
  { name: 'Dior', logo: '💎' },
  { name: 'Versace', logo: '👑' },
  { name: 'Tom Ford', logo: '🎩' },
];

export default function TopBrands() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          برندهای محبوب
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{brand.logo}</div>
              <h3 className="font-bold text-gray-800">{brand.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}