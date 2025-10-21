/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand-button': '#245A48',
        'brand-title': '#C29A42',
        'brand-cream': '#F5F4EC',
      }
    },
  },
  plugins: [],
};
