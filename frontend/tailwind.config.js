/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8f2',
          100: '#ffeddc',
          200: '#ffd1a9',
          300: '#ffb168',
          400: '#ff8a1d',
          500: '#fc8019',
          600: '#e56e0a',
          700: '#c85d09',
          900: '#7b3306'
        },
        ink: {
          900: '#121926',
          800: '#1f2937'
        }
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.12)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(252,128,25,0.22), transparent 30%), radial-gradient(circle at bottom right, rgba(255,177,104,0.35), transparent 25%), linear-gradient(135deg, #fff8f2 0%, #ffffff 42%, #fff4e6 100%)'
      }
    }
  },
  plugins: []
};
