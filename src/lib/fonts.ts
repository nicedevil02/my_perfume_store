import localFont from 'next/font/local'

export const vazirmatn = localFont({
  src: [
    {
      path: '../../public/fonts/Vazirmatn-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Vazirmatn-Bold.ttf',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-vazirmatn',
  display: 'swap',
  fallback: ['Tahoma', 'Arial', 'sans-serif']
})
