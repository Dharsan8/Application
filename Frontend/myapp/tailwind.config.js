/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "progress-bar": "progressBar 6s linear forwards",
        fall: 'fall 3s ease-in-out forwards',
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        progressBar: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
        fall: {
          '0%': { transform: 'translateY(-100px) translateX(-50%)', opacity: '0' },
          '20%': { opacity: '1' },
          '100%': { transform: 'translateY(300px) translateX(-50%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

