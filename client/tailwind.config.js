/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Brahm Shakti 3-Color Wave Palette Specification
        // Color 1: #0284A5 / #018AA5 (Deep Ocean / Cerulean Blue)
        // Color 2: #0DAFD5 (Vibrant Sky Blue / Cyan Medical Blue)
        // Color 3: #CEF5FA (Soft Ice Blue / Ambient Light Cyan)
        primary: {
          DEFAULT: '#018AAE', // Deep Ocean Blue (from image right band)
          hover: '#007595',
          light: '#0DAFD5',   // Vibrant Sky Blue (from image middle band)
          dark: '#015F78',
          50: '#F0FBFC',
          100: '#CEF5FA',     // Soft Ice Blue (from image top band)
          200: '#A5ECF5',
          300: '#73E0EF',
          400: '#3BD1E8',
          500: '#0DAFD5',
          600: '#018AAE',
          700: '#017290',
          800: '#015B73',
          900: '#013B4A'
        },
        secondary: {
          DEFAULT: '#0B2545', // Deep Healthcare Midnight Navy
          dark: '#061629',
          light: '#133D6E',
          50: '#F0F5FA',
          100: '#DDE9F5',
          900: '#040F1D'
        },
        skybrand: {
          DEFAULT: '#0DAFD5',
          hover: '#0C9DC0',
          dark: '#018AAE',
          light: '#CEF5FA'
        },
        icebrand: {
          DEFAULT: '#CEF5FA',
          light: '#E6FAFC',
          border: '#B6EEF6'
        },
        accent: {
          DEFAULT: '#CEF5FA', // Soft Ice Blue
          hover: '#B5EEF6',
          dark: '#018AAE'
        },
        medical: {
          white: '#FFFFFF',
          coolgray: '#F0FBFC',
          slate: '#1E293B',
          muted: '#64748B',
          border: '#E2E8F0',
          card: '#FFFFFF'
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(18, 48, 74, 0.05)',
        'elevated': '0 10px 30px -5px rgba(18, 48, 74, 0.08), 0 4px 6px -2px rgba(18, 48, 74, 0.03)',
        'card-hover': '0 20px 35px -5px rgba(15, 118, 110, 0.12), 0 10px 15px -5px rgba(18, 48, 74, 0.06)'
      }
    },
  },
  plugins: [],
}
