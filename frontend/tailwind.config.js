// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // ✅ if using App Router
    './pages/**/*.{js,ts,jsx,tsx}', // ✅ if using Pages Router
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}', // optional if you use /src structure
  ],
  theme: {
    extend: {
      spacing: {
        18: '4.5rem', // ✅ add this so you can use p-18
      },
    },
  },
  plugins: [],
};
