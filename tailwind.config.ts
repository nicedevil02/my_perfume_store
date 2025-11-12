import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'Vazirmatn', 'Tahoma', 'Arial', 'sans-serif'],
        serif: ["IRANSans", "serif"],
        vazir: ["Vazir", "sans-serif"], // اضافه شد
      },
      colors: {
        'brand-primary': { // رنگ اصلی برند (مثلا یک بنفش شیک)
          light: '#a855f7',
          DEFAULT: '#9333ea',
          dark: '#7e22ce',
        },
        'brand-secondary': { // رنگ دوم (مثلا طلایی یا رزگلد)
          light: '#fde047',
          DEFAULT: '#facc15',
          dark: '#eab308',
        },
        'text-primary': '#1f2937',   // رنگ اصلی متن
        'text-secondary': '#4b5563', // رنگ دوم متن
        'background': '#f8fafc',      // رنگ پس‌زمینه اصلی
      },
      // fontFamily: {  <- این بخش تکراری حذف می‌شود
      //   sans: ["var(--font-vazirmatn)", "Tahoma", "Arial", "sans-serif"],
      //   serif: ["IRANSans", "serif"],
      // },
      // سایر سفارشی‌سازی‌ها را اینجا اضافه کن
      animation: {
        "modal-in": "modal-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "modal-bg": "modal-bg 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "kenburns": "kenburns 20s ease-out infinite both",
        "fade-in-down": "fadeInDown 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "fade-in-right": "fadeInRight 0.6s ease-out forwards",
        "fade-in-left": "fadeInLeft 0.6s ease-out forwards",
        "modal-fade-in": "modal-fade-in 0.3s ease-out",
        "modal-slide-up": "modal-slide-up 0.3s ease-out",
        "modal-backdrop": "modal-backdrop 0.3s ease-out",
        // Added blob float animations
        "blob-float-1": "blob-float 45s ease-in-out -15s infinite",
        "blob-float-2": "blob-float 35s ease-in-out -5s infinite",
        "blob-float-3": "blob-float 50s ease-in-out -20s infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "modal-in": {
          "0%": {
            opacity: "0",
            transform: "translate3d(0, 60px, 0) scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "translate3d(0, 0, 0) scale(1)",
          }
        },
        "modal-bg": {
          "0%": {
            opacity: "0",
            backdropFilter: "blur(0)",
          },
          "100%": {
            opacity: "1",
            backdropFilter: "blur(8px)",
          }
        },
        kenburns: {
          "0%": { transform: "scale(1) translate(0,0)" },
          "100%": { transform: "scale(1.1) translate(10px, -10px)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "modal-fade-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.95) translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
        "modal-slide-up": {
          "0%": {
            transform: "translateY(100%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        "modal-backdrop": {
          "0%": {
            opacity: "0",
            backdropFilter: "blur(0)",
          },
          "100%": {
            opacity: "1",
            backdropFilter: "blur(4px)",
          },
        },
        // Added blob float keyframes
        "blob-float": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30vw, -50vh) scale(1.2)" },
          "66%": { transform: "translate(-20vw, 40vh) scale(0.8)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        // ...existing keyframes...
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        modal: "opacity, transform, visibility",
      },
      transitionDuration: {
        "2000": "2000ms",
      },
      transitionTimingFunction: {
        modal: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      zIndex: {
        modal: "9999",
      },
      // ...existing extend code...
    },
  },
  plugins: [
    // ...existing plugins...
  ],
};
export default config;
